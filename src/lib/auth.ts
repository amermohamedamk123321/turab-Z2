import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare, hash } from "bcryptjs";
import { type Session } from "next-auth";
import { type JWT } from "next-auth/jwt";

/**
 * SECURITY: Never expose hardcoded credentials
 * Admin credentials should be:
 * 1. Set during initial setup via environment variables
 * 2. Hashed using bcrypt before storing in database
 * 3. Verified server-side using secure comparison
 */

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      /**
       * CRITICAL SECURITY FUNCTION
       * This runs ONLY on the server
       * Never trust client-side validation
       */
      async authorize(credentials) {
        // Validate input exists
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Verify email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
          throw new Error("Invalid email format");
        }

        // Find admin user in database
        const user = await db.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            isActive: true,
          },
        });

        // User not found
        if (!user) {
          // Log failed login attempt (security audit)
          await logAuditEvent({
            action: "LOGIN_FAILED_USER_NOT_FOUND",
            resource: "admin_login",
            email: credentials.email,
            success: false,
          });
          throw new Error("Invalid email or password");
        }

        // User is inactive
        if (!user.isActive) {
          await logAuditEvent({
            action: "LOGIN_FAILED_INACTIVE_USER",
            resource: "admin_login",
            userId: user.id,
            success: false,
          });
          throw new Error("Account is disabled");
        }

        // Check if user is admin
        if (user.role !== "admin") {
          await logAuditEvent({
            action: "LOGIN_FAILED_NOT_ADMIN",
            resource: "admin_login",
            userId: user.id,
            success: false,
          });
          throw new Error("Insufficient permissions");
        }

        // Verify password using bcrypt (never plain-text comparison)
        if (!user.password) {
          throw new Error("Password not set for this account");
        }

        const passwordMatch = await compare(credentials.password, user.password);

        if (!passwordMatch) {
          await logAuditEvent({
            action: "LOGIN_FAILED_INVALID_PASSWORD",
            resource: "admin_login",
            userId: user.id,
            success: false,
          });
          throw new Error("Invalid email or password");
        }

        // Successful login
        await logAuditEvent({
          action: "LOGIN_SUCCESS",
          resource: "admin_login",
          userId: user.id,
          success: true,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    /**
     * JWT Callback
     * Runs when JWT is created or updated
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },

    /**
     * Session Callback
     * Runs when session is checked
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },

    /**
     * Authorized Callback
     * Controls who can access protected routes
     */
    async authorized({ request, auth }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute) {
        // Admin routes require authentication and admin role
        if (!auth?.user) {
          return false;
        }
        if ((auth.user as any).role !== "admin") {
          return false;
        }
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

/**
 * Audit Logging Function
 * Records all authentication attempts for security monitoring
 */
async function logAuditEvent({
  action,
  resource,
  userId,
  email,
  success,
  details,
  ipAddress,
}: {
  action: string;
  resource: string;
  userId?: string;
  email?: string;
  success: boolean;
  details?: string;
  ipAddress?: string;
}) {
  try {
    await db.auditLog.create({
      data: {
        action,
        resource,
        userId,
        success,
        details: details || (email ? `email: ${email}` : undefined),
        ipAddress,
      },
    });
  } catch (error) {
    console.error("Failed to log audit event:", error);
    // Don't throw - logging failure shouldn't break authentication
  }
}

export type { Session } from "next-auth";
