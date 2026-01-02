import { NextRequest, NextResponse } from "next/server";

/**
 * SECURITY: Rate Limiting
 * 
 * Prevents abuse by limiting the number of requests from a single IP/user
 * Protects against:
 * - Brute force attacks on login
 * - DDoS attacks
 * - API abuse
 * - Resource exhaustion
 */

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

/**
 * Rate limit configuration by endpoint
 */
const rateLimitConfig: Record<
  string,
  { maxRequests: number; windowMs: number }
> = {
  // Login endpoint: 5 attempts per 15 minutes
  "/api/auth/signin": { maxRequests: 5, windowMs: 15 * 60 * 1000 },

  // File upload: 10 uploads per hour
  "/api/upload": { maxRequests: 10, windowMs: 60 * 60 * 1000 },

  // General API: 100 requests per 15 minutes
  "/api": { maxRequests: 100, windowMs: 15 * 60 * 1000 },

  // Contact form: 5 submissions per hour
  "/api/contact": { maxRequests: 5, windowMs: 60 * 60 * 1000 },
};

/**
 * Get the appropriate rate limit config for a path
 */
function getConfig(
  path: string
): { maxRequests: number; windowMs: number } | null {
  // Check for exact match
  if (rateLimitConfig[path]) {
    return rateLimitConfig[path];
  }

  // Check for prefix match (most specific first)
  const sortedKeys = Object.keys(rateLimitConfig).sort(
    (a, b) => b.length - a.length
  );
  for (const key of sortedKeys) {
    if (path.startsWith(key)) {
      return rateLimitConfig[key];
    }
  }

  return null;
}

/**
 * Get client identifier (IP address or user ID)
 */
function getClientId(request: NextRequest): string {
  // Try to get user ID from session/JWT
  // const token = await getToken({ req: request });
  // if (token?.sub) return `user:${token.sub}`;

  // Fall back to IP address
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.ip ||
    "unknown";

  return `ip:${ip}`;
}

/**
 * Check if request is rate limited
 * Returns true if limited, false if allowed
 */
export function isRateLimited(
  request: NextRequest
): {
  limited: boolean;
  remaining: number;
  resetTime: number;
} {
  const path = request.nextUrl.pathname;
  const config = getConfig(path);

  if (!config) {
    // No rate limit configured for this path
    return { limited: false, remaining: -1, resetTime: -1 };
  }

  const clientId = getClientId(request);
  const now = Date.now();
  let record = rateLimitStore.get(clientId);

  // Initialize or reset if window has expired
  if (!record || record.resetTime < now) {
    record = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(clientId, record);
  }

  // Increment counter
  record.count++;

  // Check if limited
  const remaining = Math.max(0, config.maxRequests - record.count);
  const limited = record.count > config.maxRequests;

  return {
    limited,
    remaining,
    resetTime: record.resetTime,
  };
}

/**
 * Rate limit response middleware
 * Use in API routes to enforce rate limiting
 */
export function rateLimitResponse(
  request: NextRequest,
  onLimited?: (retryAfter: number) => NextResponse
): NextResponse | null {
  const { limited, remaining, resetTime } = isRateLimited(request);

  if (!limited) {
    // Add remaining quota to response headers
    const response = new NextResponse(null, { status: 200 });
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set(
      "X-RateLimit-Reset",
      new Date(resetTime).toISOString()
    );
    return response;
  }

  // Rate limited - return 429 response
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

  if (onLimited) {
    return onLimited(retryAfter);
  }

  return NextResponse.json(
    {
      error: "Too many requests",
      message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
      retryAfter,
    },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": "5",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": new Date(resetTime).toISOString(),
      },
    }
  );
}

/**
 * Rate limit decorator for API routes
 * 
 * Usage:
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const limited = checkRateLimit(request);
 *   if (limited) {
 *     return rateLimitResponse(request);
 *   }
 *   
 *   // Your endpoint logic here
 * }
 * ```
 */
export function checkRateLimit(request: NextRequest): boolean {
  const { limited } = isRateLimited(request);
  return limited;
}

/**
 * Get current rate limit status for a request
 */
export function getRateLimitStatus(request: NextRequest) {
  const { limited, remaining, resetTime } = isRateLimited(request);
  const now = Date.now();
  const secondsUntilReset = Math.ceil((resetTime - now) / 1000);

  return {
    limited,
    remaining,
    resetTime: new Date(resetTime),
    secondsUntilReset: Math.max(0, secondsUntilReset),
  };
}

/**
 * Add rate limit headers to a response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const { remaining, resetTime } = isRateLimited(request);

  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set(
    "X-RateLimit-Reset",
    new Date(resetTime).toISOString()
  );

  return response;
}
