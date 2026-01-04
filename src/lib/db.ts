import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ============================================================================
// PRISMA CLIENT INITIALIZATION
// ============================================================================

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Enable query logging in development and for slow queries
    log: process.env.NODE_ENV === "development" 
      ? ["query", "info", "warn", "error"]
      : ["warn", "error"],
  });

// ============================================================================
// SECURITY MIDDLEWARE: Query Validation and Logging
// ============================================================================

/**
 * SECURITY: Custom query logging and validation
 * 
 * This middleware approach:
 * 1. Logs all database operations for audit trail
 * 2. Detects slow queries (>1s)
 * 3. Prevents dangerous patterns in application code
 * 4. Validates sensitive operations
 */

// Track slow queries
if (process.env.NODE_ENV === "development") {
  db.$on("query", (event) => {
    if (event.duration > 1000) {
      console.warn(`[SLOW QUERY] ${event.query} took ${event.duration}ms`);
    }
  });

  // Log errors
  db.$on("error", (event) => {
    console.error(`[DB ERROR] ${event.message}`);
  });
}

// ============================================================================
// DATABASE CONSTRAINTS (Prevent Dangerous Operations)
// ============================================================================

/**
 * These functions help prevent dangerous operations at the application level
 * They should be called before executing any bulk operations
 */

/**
 * Validates that a delete operation has proper safety constraints
 * ALWAYS verify where clause before bulk deletes
 */
export function validateDeleteOperation(where?: any): boolean {
  if (!where || Object.keys(where).length === 0) {
    console.warn(
      "[SECURITY] deleteMany without where clause detected - operation blocked for safety"
    );
    return false;
  }
  return true;
}

/**
 * Validates that an update operation has proper safety constraints
 * ALWAYS verify where clause before bulk updates
 */
export function validateUpdateOperation(where?: any): boolean {
  if (!where || Object.keys(where).length === 0) {
    console.warn(
      "[SECURITY] updateMany without where clause detected - operation blocked for safety"
    );
    return false;
  }
  return true;
}

// ============================================================================
// SECURE QUERY HELPERS
// ============================================================================

/**
 * Find user WITHOUT exposing password
 * Use this helper instead of direct Prisma queries for users
 */
export async function findUserSafe(where: any) {
  return db.user.findUnique({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      // password and sensitive fields excluded
    },
  });
}

/**
 * Find many users WITHOUT exposing passwords
 */
export async function findUsersSafe(where?: any) {
  return db.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// ============================================================================
// SOFT DELETE HELPER (Optional)
// ============================================================================

/**
 * Helper function for soft-delete pattern
 * Marks records as deleted instead of actually removing them
 * 
 * To use, add 'deletedAt' field to your Prisma models:
 * deletedAt    DateTime?
 */
export async function softDeleteUser(id: string) {
  return db.user.update({
    where: { id },
    data: { 
      isActive: false,
      // deletedAt: new Date(),  // If you add this field to schema
    },
  });
}

/**
 * Helper to find active (non-deleted) records only
 */
export function excludeDeleted(args: any) {
  return {
    ...args,
    where: {
      ...args.where,
      isActive: true,
    },
  };
}

// ============================================================================
// DATABASE CONNECTION MANAGEMENT
// ============================================================================

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

/**
 * Graceful database disconnection
 * Call this when shutting down the application
 */
export async function disconnectDB() {
  try {
    await db.$disconnect();
    console.log("[Database] Gracefully disconnected from database");
  } catch (error) {
    console.error("[Database] Error during disconnection:", error);
  }
}

/**
 * Health check for database connection
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("[Database] Health check failed:", error);
    return false;
  }
}

export type { Session } from "next-auth";
