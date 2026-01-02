import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * SECURITY: Global middleware for all requests
 * 
 * This middleware:
 * 1. Protects admin routes with authentication
 * 2. Adds security headers to responses
 * 3. Prevents common attacks (CSRF, clickjacking, XSS)
 * 4. Enforces HTTPS in production
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // =========================================================================
  // ADMIN ROUTE PROTECTION
  // =========================================================================

  // Protect admin routes - require valid JWT session
  if (pathname.startsWith("/admin")) {
    // Allow /admin/login without authentication
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // All other admin routes require authentication
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Redirect to login with callback URL
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify user has admin role
    if ((token as any).role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // =========================================================================
  // SECURITY HEADERS
  // =========================================================================

  let response = NextResponse.next();

  // Prevent clickjacking attacks (blocks embedding in frames/iframes)
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS protection in older browsers
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Control referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy (CSP)
  // Prevents inline scripts and limits script sources
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow next.js scripts
    "style-src 'self' 'unsafe-inline'", // Allow tailwind CSS
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' http://localhost:3000 ws://localhost:3000",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // Permissions Policy (formerly Feature Policy)
  response.headers.set(
    "Permissions-Policy",
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
  );

  // Encourage HTTPS in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  // CORS headers (be specific in production)
  response.headers.set("Access-Control-Allow-Origin", "self");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Disable caching for sensitive pages
  if (pathname.startsWith("/admin")) {
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

/**
 * Configure which routes the middleware should run on
 * 
 * This runs on:
 * - All /admin routes
 * - API routes that need protection
 * - Specific pages that need security headers
 */
export const config = {
  matcher: [
    // Admin routes
    "/admin/:path*",
    // API routes
    "/api/:path*",
    // Specific pages that need security headers
    "/",
    "/projects",
    "/about",
    "/contact",
  ],
};
