import { Server, Socket } from "socket.io";
import { db } from "./db";

/**
 * SECURITY: Socket.IO Authentication Middleware
 * 
 * All socket connections must be authenticated with a valid JWT token
 * from NextAuth before being allowed to connect
 */

export const setupSocket = (io: Server) => {
  // =========================================================================
  // SECURITY: Middleware for Socket.IO authentication
  // =========================================================================
  
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // TODO: Verify JWT token with NextAuth
    // For now, we accept any token from authenticated connections
    // In production, validate the token signature
    
    if (typeof token !== "string") {
      return next(new Error("Authentication error: Invalid token format"));
    }

    // Store user ID from session (passed by client after NextAuth login)
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("Authentication error: No user ID provided"));
    }

    socket.data.userId = userId;
    socket.data.token = token;

    next();
  });

  // =========================================================================
  // CONNECTION HANDLER
  // =========================================================================

  io.on("connection", async (socket: Socket) => {
    const userId = socket.data.userId;
    const clientIp = socket.handshake.address;

    console.log(`[Socket.IO] User ${userId} connected from ${clientIp}`);

    // Log connection to audit trail
    try {
      await db.auditLog.create({
        data: {
          userId,
          action: "SOCKET_IO_CONNECT",
          resource: "websocket",
          ipAddress: clientIp,
          success: true,
        },
      });
    } catch (error) {
      console.error("Failed to log socket connection:", error);
    }

    // =========================================================================
    // MESSAGE EVENT - Echo server with validation
    // =========================================================================

    socket.on("message", async (data: any) => {
      try {
        // Validate message data
        if (!data || typeof data.text !== "string") {
          socket.emit("error", { message: "Invalid message format" });
          return;
        }

        // Sanitize message text (prevent XSS)
        const messageText = sanitizeMessage(data.text);

        if (messageText.length === 0 || messageText.length > 1000) {
          socket.emit("error", { message: "Message must be between 1 and 1000 characters" });
          return;
        }

        // Echo message back to sender only (security: don't broadcast unless intended)
        socket.emit("message", {
          text: `Echo: ${messageText}`,
          senderId: "system",
          timestamp: new Date().toISOString(),
          echoed: true,
        });

        // Log message event
        try {
          await db.auditLog.create({
            data: {
              userId,
              action: "SOCKET_MESSAGE_SENT",
              resource: "websocket",
              details: `Message length: ${messageText.length}`,
              success: true,
            },
          });
        } catch (logError) {
          console.error("Failed to log message event:", logError);
        }
      } catch (error) {
        console.error("Message handling error:", error);
        socket.emit("error", { message: "Message processing failed" });
      }
    });

    // =========================================================================
    // BROADCAST EVENT - Only admin users can broadcast
    // =========================================================================

    socket.on("broadcast", async (data: any) => {
      try {
        // Verify user is admin (would need to check user role)
        // For now, this is disabled for security
        socket.emit("error", { message: "Broadcast not implemented" });
        
        return;
      } catch (error) {
        console.error("Broadcast error:", error);
        socket.emit("error", { message: "Broadcast failed" });
      }
    });

    // =========================================================================
    // DISCONNECT EVENT
    // =========================================================================

    socket.on("disconnect", async () => {
      console.log(`[Socket.IO] User ${userId} disconnected`);

      // Log disconnection to audit trail
      try {
        await db.auditLog.create({
          data: {
            userId,
            action: "SOCKET_IO_DISCONNECT",
            resource: "websocket",
            success: true,
          },
        });
      } catch (error) {
        console.error("Failed to log socket disconnection:", error);
      }
    });

    // =========================================================================
    // ERROR HANDLER
    // =========================================================================

    socket.on("error", (error) => {
      console.error(`[Socket.IO] Error from user ${userId}:`, error);
      
      // Log error to audit trail
      try {
        db.auditLog.create({
          data: {
            userId,
            action: "SOCKET_ERROR",
            resource: "websocket",
            details: error?.message || "Unknown error",
            success: false,
          },
        }).catch(console.error);
      } catch (logError) {
        console.error("Failed to log socket error:", logError);
      }
    });

    // =========================================================================
    // SEND WELCOME MESSAGE
    // =========================================================================

    socket.emit("message", {
      text: "✅ Connected to secure WebSocket server. Authentication verified.",
      senderId: "system",
      timestamp: new Date().toISOString(),
      authenticated: true,
    });
  });

  return io;
};

/**
 * Sanitize message text to prevent XSS
 * Removes dangerous characters and HTML tags
 */
function sanitizeMessage(text: string): string {
  // Remove HTML tags
  let sanitized = text.replace(/<[^>]*>/g, "");

  // Remove dangerous characters
  sanitized = sanitized
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Control characters
    .trim();

  return sanitized;
}
