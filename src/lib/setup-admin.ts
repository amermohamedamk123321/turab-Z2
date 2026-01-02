import { db } from "./db";
import { hash } from "bcryptjs";

/**
 * This utility is used ONLY during initial setup
 * Should be called from an admin CLI or setup page
 * 
 * SECURITY: Never expose this in production
 * Only use during initial VPS deployment
 */

export async function setupAdminUser({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}) {
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  // Validate password strength
  if (password.length < 12) {
    throw new Error("Password must be at least 12 characters long");
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    throw new Error(
      "Password must contain uppercase, lowercase, and numeric characters"
    );
  }

  // Check if admin already exists
  const existingAdmin = await db.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    throw new Error("User with this email already exists");
  }

  // Hash password (NEVER store plain-text passwords)
  const hashedPassword = await hash(password, 12);

  // Create admin user
  const adminUser = await db.user.create({
    data: {
      email,
      name: name || "Admin",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    },
  });

  return {
    success: true,
    userId: adminUser.id,
    email: adminUser.email,
    message: `Admin user created successfully. Login with: ${email}`,
  };
}

/**
 * Update admin password securely
 * Requires old password verification
 */
export async function updateAdminPassword({
  userId,
  oldPassword,
  newPassword,
}: {
  userId: string;
  oldPassword: string;
  newPassword: string;
}) {
  const { compare } = await import("bcryptjs");

  // Find user
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, password: true, role: true },
  });

  if (!user || user.role !== "admin") {
    throw new Error("User not found or not an admin");
  }

  if (!user.password) {
    throw new Error("User password not set");
  }

  // Verify old password
  const passwordMatch = await compare(oldPassword, user.password);
  if (!passwordMatch) {
    throw new Error("Current password is incorrect");
  }

  // Validate new password
  if (newPassword.length < 12) {
    throw new Error("Password must be at least 12 characters long");
  }

  if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) {
    throw new Error(
      "Password must contain uppercase, lowercase, and numeric characters"
    );
  }

  // Hash and update
  const hashedPassword = await hash(newPassword, 12);

  await db.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return {
    success: true,
    message: "Password updated successfully",
  };
}
