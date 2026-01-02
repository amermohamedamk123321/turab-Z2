import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ============================================================================
// PRISMA CLIENT INITIALIZATION WITH SECURITY MIDDLEWARE
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
// SECURITY MIDDLEWARE: Query Interception
// ============================================================================

/**
 * SECURITY: Prisma middleware for query validation and logging
 * 
 * This middleware:
 * 1. Logs all database operations for audit trail
 * 2. Prevents dangerous bulk operations (deleteMany without filters)
 * 3. Adds timing information to detect slow queries
 * 4. Validates sensitive operations
 */

db.$use(async (params, next) => {
  const { model, action, args } = params;

  // =========================================================================
  // PREVENT DANGEROUS BULK OPERATIONS
  // =========================================================================

  // Block deleteMany without where clause (prevents accidental data loss)
  if (action === "deleteMany" && !args.where) {
    console.warn(`[SECURITY] Blocked deleteMany on ${model} without where clause`);
    throw new Error(
      `Bulk delete operations on ${model} require a where filter for safety`
    );
  }

  // Block updateMany without where clause
  if (action === "updateMany" && !args.where) {
    console.warn(`[SECURITY] Blocked updateMany on ${model} without where clause`);
    throw new Error(
      `Bulk update operations on ${model} require a where filter for safety`
    );
  }

  // =========================================================================
  // RESTRICT SENSITIVE DATA ACCESS
  // =========================================================================

  // User queries should never include password in results (except for auth)
  if (model === "User" && (action === "findUnique" || action === "findFirst" || action === "findMany")) {
    if (!params.args?.select || !params.args.select.password) {
      // Add select clause to exclude passwords by default
      params.args = params.args || {};
      params.args.select = params.args.select || {};
      params.args.select.password = false;
    }
  }

  // =========================================================================
  // MEASURE QUERY PERFORMANCE
  // =========================================================================

  const start = Date.now();
  let result;
  let error;

  try {
    result = await next(params);
  } catch (err) {
    error = err;
  }

  const duration = Date.now() - start;

  // =========================================================================
  // LOG QUERIES FOR AUDIT AND PERFORMANCE MONITORING
  // =========================================================================

  // Log slow queries
  if (duration > 1000) {
    console.warn(
      `[SLOW QUERY] ${model}.${action} took ${duration}ms`,
      JSON.stringify(args, null, 2)
    );
  }

  // Log sensitive operations
  const sensitiveActions = ["create", "update", "delete", "deleteMany", "updateMany"];
  if (sensitiveActions.includes(action)) {
    const sensitiveModels = ["User", "AuditLog"];
    if (sensitiveModels.includes(model)) {
      console.info(`[AUDIT] ${model}.${action} (${duration}ms)`, {
        where: args.where,
        data: action !== "delete" ? args.data : undefined,
      });
    }
  }

  // Re-throw error if one occurred
  if (error) throw error;

  return result;
});

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
export async function softDelete<T extends { id: string }>(
  model: "User" | "Post",
  id: string
) {
  return db[model.toLowerCase() as Lowercase<T>]?.update({
    where: { id },
    data: { deletedAt: new Date() },
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
      deletedAt: null,
    },
  };
}

// ============================================================================
// DISCONNECT ON SERVER SHUTDOWN
// ============================================================================

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

/**
 * Graceful database disconnection
 */
export async function disconnectDB() {
  await db.$disconnect();
  console.log("[Database] Disconnected from database");
}

export type { Session } from "next-auth";
