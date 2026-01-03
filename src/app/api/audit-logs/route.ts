import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { paginationSchema } from "@/lib/validation";

/**
 * GET /api/audit-logs
 * Retrieve audit logs (admin only)
 * 
 * Query parameters:
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 10, max: 100)
 * - action: Filter by action type (optional)
 * - userId: Filter by user ID (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check admin role
    const userRole = (session.user as any)?.role;
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = Math.min(
      parseInt(searchParams.get("pageSize") || "10", 10),
      100 // Max 100 per page
    );
    const action = searchParams.get("action") || undefined;
    const userId = searchParams.get("userId") || undefined;

    // Validate pagination
    const paginationResult = paginationSchema.safeParse({
      page,
      pageSize,
    });

    if (!paginationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid pagination parameters",
          details: paginationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // Build filter
    const where: any = {};
    if (action) where.action = action;
    if (userId) where.userId = userId;

    // Get total count
    const total = await db.auditLog.count({ where });

    // Fetch logs with pagination
    const logs = await db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Log audit log access
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "AUDIT_LOG_VIEW",
        resource: "audit_logs",
        details: JSON.stringify({ page, pageSize, action, userId }),
        success: true,
      },
    });

    return NextResponse.json(
      {
        logs,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/audit-logs] Error:", error);

    return NextResponse.json(
      { error: "Failed to retrieve audit logs" },
      { status: 500 }
    );
  }
}
