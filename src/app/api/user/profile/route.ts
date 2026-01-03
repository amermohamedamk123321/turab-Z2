import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, findUserSafe } from "@/lib/db";
import { userUpdateSchema } from "@/lib/validation";

/**
 * GET /api/user/profile
 * Retrieve authenticated user's profile
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

    const userId = (session.user as any).id;

    // Fetch user without password
    const user = await findUserSafe({
      id: userId,
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Log profile access
    await db.auditLog.create({
      data: {
        userId,
        action: "PROFILE_VIEW",
        resource: "user_profile",
        success: true,
      },
    });

    return NextResponse.json(
      {
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/user/profile] Error:", error);

    return NextResponse.json(
      { error: "Failed to retrieve profile" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile
 * Update authenticated user's profile
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const data = await request.json();

    // Validate update data
    const result = userUpdateSchema.safeParse(data);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.errors,
        },
        { status: 400 }
      );
    }

    // Check if email is being changed to an existing email
    if (result.data.email) {
      const existingUser = await db.user.findUnique({
        where: { email: result.data.email },
      });

      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 }
        );
      }
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: result.data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log profile update
    await db.auditLog.create({
      data: {
        userId,
        action: "PROFILE_UPDATE",
        resource: "user_profile",
        details: JSON.stringify({
          updated_fields: Object.keys(result.data),
        }),
        success: true,
      },
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PUT /api/user/profile] Error:", error);

    // Log failed update
    try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        await db.auditLog.create({
          data: {
            userId: (session.user as any).id,
            action: "PROFILE_UPDATE_FAILED",
            resource: "user_profile",
            success: false,
          },
        });
      }
    } catch (logError) {
      console.error("Failed to log update error:", logError);
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
