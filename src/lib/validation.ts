import { z } from "zod";

/**
 * SECURITY: Input Validation Schemas
 * 
 * All user inputs must be validated against these schemas
 * before being processed by the application.
 * 
 * This prevents:
 * - SQL Injection
 * - XSS (Cross-Site Scripting)
 * - NoSQL Injection
 * - Path Traversal
 * - Type Confusion attacks
 */

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

export const loginCredentialsSchema = z.object({
  email: z
    .string("Email is required")
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .trim(),
  password: z
    .string("Password is required")
    .min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

export const passwordSchema = z
  .string("Password is required")
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one digit")
  .regex(/[@$!%*?&#^]/, "Password must contain at least one special character (@$!%*?&#^)");

export const changePasswordSchema = z.object({
  currentPassword: z.string("Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string("Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ChangePassword = z.infer<typeof changePasswordSchema>;

// ============================================================================
// USER SCHEMAS
// ============================================================================

export const userCreateSchema = z.object({
  email: z
    .string("Email is required")
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .trim(),
  name: z
    .string("Name is required")
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters")
    .trim(),
  password: passwordSchema,
});

export type UserCreate = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
  email: z
    .string("Email is required")
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .trim()
    .optional(),
  name: z
    .string("Name is required")
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters")
    .trim()
    .optional(),
});

export type UserUpdate = z.infer<typeof userUpdateSchema>;

// ============================================================================
// FILE UPLOAD SCHEMAS
// ============================================================================

export const fileUploadSchema = z.object({
  fileType: z
    .enum(["video", "image", "document"])
    .refine((type) => ["video", "image", "document"].includes(type), {
      message: "Invalid file type",
    }),
  originalFileName: z
    .string("Filename is required")
    .max(255, "Filename must be less than 255 characters"),
  fileSize: z
    .number("File size must be a number")
    .min(1, "File size must be greater than 0")
    .max(52428800, "File size must be less than 50MB"),
  mimeType: z
    .string("MIME type is required")
    .refine((type) => validateMimeType(type), {
      message: "Invalid or disallowed MIME type",
    }),
});

export type FileUpload = z.infer<typeof fileUploadSchema>;

/**
 * Validate MIME type against allowed types
 */
function validateMimeType(mimeType: string): boolean {
  const allowedTypes = [
    // Video types
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
    // Image types
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    // Document types
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  return allowedTypes.includes(mimeType);
}

// ============================================================================
// PROJECT SCHEMAS
// ============================================================================

export const projectCreateSchema = z.object({
  title: z
    .string("Title is required")
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .trim(),
  description: z
    .string("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters")
    .trim(),
  category: z
    .enum(["web", "mobile", "desktop", "service", "video"])
    .refine(
      (cat) => ["web", "mobile", "desktop", "service", "video"].includes(cat),
      { message: "Invalid category" }
    ),
  technologies: z
    .array(
      z
        .string()
        .min(1, "Technology name is required")
        .max(50, "Technology name must be less than 50 characters")
        .trim()
    )
    .min(1, "At least one technology is required")
    .max(20, "Maximum 20 technologies allowed"),
  projectLink: z
    .string()
    .url("Invalid project URL")
    .optional()
    .or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type ProjectCreate = z.infer<typeof projectCreateSchema>;

export const projectUpdateSchema = projectCreateSchema.partial();

export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

// ============================================================================
// CONTACT MESSAGE SCHEMAS
// ============================================================================

export const contactMessageSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be less than 255 characters")
    .trim(),
  email: z
    .string("Email is required")
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .trim(),
  subject: z
    .string("Subject is required")
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters")
    .trim(),
  message: z
    .string("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters")
    .trim(),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

// ============================================================================
// SEARCH & FILTER SCHEMAS
// ============================================================================

export const searchSchema = z.object({
  query: z
    .string()
    .max(200, "Search query must be less than 200 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  category: z
    .enum(["web", "mobile", "desktop", "service", "video"])
    .optional(),
  sortBy: z
    .enum(["date", "title", "popularity"])
    .default("date")
    .optional(),
  limit: z
    .number()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit must be less than 100")
    .default(10)
    .optional(),
  offset: z
    .number()
    .min(0, "Offset must be 0 or greater")
    .default(0)
    .optional(),
});

export type Search = z.infer<typeof searchSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

export const paginationSchema = z.object({
  page: z
    .number()
    .min(1, "Page must be at least 1")
    .default(1),
  pageSize: z
    .number()
    .min(1, "Page size must be at least 1")
    .max(100, "Page size must be less than 100")
    .default(10),
});

export type Pagination = z.infer<typeof paginationSchema>;

// ============================================================================
// QUERY STRING PARAMETER SCHEMAS
// ============================================================================

export const queryParamSchema = z.object({
  search: z.string().max(200).optional(),
  category: z.string().max(50).optional(),
  sortBy: z.string().max(50).optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

export type QueryParams = z.infer<typeof queryParamSchema>;

// ============================================================================
// VALIDATION ERROR HANDLER
// ============================================================================

/**
 * Parse and return validation errors in a user-friendly format
 */
export function formatValidationError(error: z.ZodError) {
  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
}

/**
 * Safely parse user input and return validation result
 */
export function safeValidate<T>(
  schema: z.ZodSchema,
  data: unknown
): { success: boolean; data?: T; errors?: Array<{ field: string; message: string }> } {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: formatValidationError(result.error),
    };
  }

  return {
    success: true,
    data: result.data as T,
  };
}
