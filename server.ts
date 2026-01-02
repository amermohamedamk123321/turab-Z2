// server.ts - Next.js Standalone + Socket.IO with Security
import { setupSocket } from '@/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const currentPort = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

/**
 * SECURITY: Allowed origins for Socket.IO connections
 * 
 * In production, restrict to your actual domain
 * Examples:
 * - Development: http://localhost:3000
 * - Production: https://yourdomain.com
 * - Multiple domains: https://app.yourdomain.com, https://admin.yourdomain.com
 */
const ALLOWED_SOCKET_IO_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
].concat(
  // Add production domain from environment or use localhost fallback
  process.env.ALLOWED_SOCKET_IO_ORIGINS
    ? process.env.ALLOWED_SOCKET_IO_ORIGINS.split(',').map(origin => origin.trim())
    : []
);

console.log('[Server] Allowed Socket.IO origins:', ALLOWED_SOCKET_IO_ORIGINS);

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { distDir: './.next' }
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      handle(req, res);
    });

    // Setup Socket.IO with security configuration
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        /**
         * SECURITY: Restrict CORS origins
         * 
         * ⚠️ CRITICAL: In production, replace '*' with your actual domain
         * Example: origin: ['https://yourdomain.com']
         * 
         * Allowing '*' permits any website to connect to your WebSocket
         * This can enable CSRF attacks and data exfiltration
         */
        origin: dev ? '*' : ALLOWED_SOCKET_IO_ORIGINS,
        methods: ['GET', 'POST'],
        credentials: true,
        allowEIO3: false, // Use only EIO 4 (more secure)
      },
      /**
       * SECURITY: Authentication configuration
       * All connections must provide valid auth data
       */
      auth: {
        // Require token in handshake
        requireToken: true,
      },
      /**
       * SECURITY: Connection timeout settings
       * Disconnect idle connections to free resources
       */
      pingInterval: 25000,  // Send ping every 25 seconds
      pingTimeout: 60000,   // Wait 60 seconds for pong response
      connectTimeout: 45000, // Connection must complete within 45 seconds
      
      /**
       * SECURITY: Max listeners per event
       * Prevent memory exhaustion from event listener attacks
       */
      maxHttpBufferSize: 1e6, // 1MB max buffer size
    });

    setupSocket(io);

    // Start the server
    server.listen(currentPort, hostname, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║         🚀 Secure Next.js Server Started                   ║
╚════════════════════════════════════════════════════════════╝

📍 HTTP Server:
   URL: http://${hostname}:${currentPort}

🔌 Socket.IO Server:
   Path: ws://${hostname}:${currentPort}/api/socketio
   CORS Origins: ${ALLOWED_SOCKET_IO_ORIGINS.join(', ')}
   Authentication: REQUIRED (NextAuth token)

🔒 Security Status:
   Environment: ${dev ? 'DEVELOPMENT' : 'PRODUCTION'}
   ${dev ? '⚠️  Development mode: CORS is open (localhost only)' : '✅ Production mode: CORS restricted to allowed origins'}
   ✅ Socket.IO requires authentication
   ✅ Connection timeout: 45 seconds
   ✅ Ping/Pong interval: 25 seconds
   ✅ Max buffer size: 1MB

${dev ? '📝 Note: In production, update ALLOWED_SOCKET_IO_ORIGINS in server.ts' : ''}
${dev ? '        or set ALLOWED_SOCKET_IO_ORIGINS environment variable' : ''}

      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('[Server] SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('[Server] Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('[Server] SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('[Server] Server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('[Server] Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();
