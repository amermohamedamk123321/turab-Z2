import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * Admin Setup Endpoint
 * 
 * SECURITY NOTES:
 * - This endpoint should ONLY be available in development or during initial setup
 * - In production, use environment variables or a secure setup process
 * - This returns default credentials that MUST be changed immediately
 * - The endpoint checks if an admin already exists (prevents overwriting)
 */

export async function POST(request: NextRequest) {
  try {
    // Security: Check if this is being called from admin context
    // In production, you should add additional authentication checks
    const { action, email, oldPassword, newPassword } = await request.json();

    // Only allow setup if no admin user exists yet
    if (action === "init") {
      const existingAdmin = await db.user.findFirst({
        where: { role: "admin" },
      });

      if (existingAdmin) {
        return NextResponse.json(
          { error: "Admin user already exists. Use the change credentials endpoint instead." },
          { status: 403 }
        );
      }

      // Create default admin user
      const defaultEmail = "admin@turabroot.com";
      const defaultPassword = "AdminPassword123";

      const hashedPassword = await hash(defaultPassword, 12);

      const admin = await db.user.create({
        data: {
          email: defaultEmail,
          name: "Turab Root Admin",
          password: hashedPassword,
          role: "admin",
          isActive: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Admin user created successfully. Please log in and change your password immediately.",
          credentials: {
            email: defaultEmail,
            password: defaultPassword,
            note: "⚠️  THESE ARE DEFAULT CREDENTIALS. CHANGE THEM IMMEDIATELY AFTER FIRST LOGIN",
          },
          userId: admin.id,
        },
        { status: 201 }
      );
    }

    // Change admin password
    if (action === "change-password") {
      if (!email || !oldPassword || !newPassword) {
        return NextResponse.json(
          { error: "Email, old password, and new password are required" },
          { status: 400 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      // Find admin user
      const user = await db.user.findUnique({
        where: { email },
        select: { id: true, password: true, role: true },
      });

      if (!user || user.role !== "admin") {
        return NextResponse.json(
          { error: "Admin user not found" },
          { status: 404 }
        );
      }

      if (!user.password) {
        return NextResponse.json(
          { error: "Password not set for this account" },
          { status: 400 }
        );
      }

      // Verify old password
      const { compare } = await import("bcryptjs");
      const passwordMatch = await compare(oldPassword, user.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }

      // Validate new password strength
      if (newPassword.length < 12) {
        return NextResponse.json(
          { error: "Password must be at least 12 characters long" },
          { status: 400 }
        );
      }

      if (!/[A-Z]/.test(newPassword)) {
        return NextResponse.json(
          { error: "Password must contain at least one uppercase letter" },
          { status: 400 }
        );
      }

      if (!/[a-z]/.test(newPassword)) {
        return NextResponse.json(
          { error: "Password must contain at least one lowercase letter" },
          { status: 400 }
        );
      }

      if (!/\d/.test(newPassword)) {
        return NextResponse.json(
          { error: "Password must contain at least one number" },
          { status: 400 }
        );
      }

      // Hash and update password
      const hashedPassword = await hash(newPassword, 12);

      await db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return NextResponse.json(
        { success: true, message: "Password updated successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin setup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if any admin exists
    const adminExists = await db.user.findFirst({
      where: { role: "admin" },
      select: { id: true, email: true },
    });

    if (adminExists) {
      return NextResponse.json(
        { setupRequired: false, adminEmail: adminExists.email },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        setupRequired: true,
        message: "Admin setup is required. Call POST with action: 'init'",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
