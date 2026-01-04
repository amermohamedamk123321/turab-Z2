import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================

// Maximum file size: 50MB (52428800 bytes)
const MAX_FILE_SIZE = 52428800;

// Allowed MIME types for video uploads
const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov files
  "video/x-msvideo", // .avi files
]);

// Allowed MIME types for image uploads
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

// Allowed MIME types for documents
const ALLOWED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

// Combine all allowed types
const ALLOWED_TYPES = new Set([
  ...ALLOWED_VIDEO_TYPES,
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
]);

// Dangerous file extensions that should never be uploaded
const BLOCKED_EXTENSIONS = new Set([
  "exe", "bat", "cmd", "com", "pif", "scr", // Windows executables
  "sh", "bash", "zsh", "ksh", "csh", // Shell scripts
  "php", "php3", "php4", "php5", "phtml", // PHP (RCE risk)
  "asp", "aspx", "jsp", "jspx", // Server-side scripts
  "jar", "py", "rb", "pl", // Code execution
  "zip", "rar", "7z", "gz", // Archives that could extract to dangerous files
]);

// ============================================================================
// FILE UPLOAD HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Verify session before allowing upload
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    // Verify user is admin
    const userRole = (session.user as any)?.role;
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Get logged-in user details
    const userId = (session.user as any)?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileType = formData.get("fileType") as string | null; // "video", "image", or "document"

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type parameter
    if (!fileType || !["video", "image", "document"].includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid fileType. Must be 'video', 'image', or 'document'" },
        { status: 400 }
      );
    }

    // ========================================================================
    // FILE VALIDATION
    // ========================================================================

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 413 }
      );
    }

    // Check MIME type
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: `File type not allowed. MIME type: ${file.type}`,
        },
        { status: 415 }
      );
    }

    // Get file extension
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

    // Check for dangerous file extensions
    if (BLOCKED_EXTENSIONS.has(fileExtension)) {
      return NextResponse.json(
        {
          error: `File extension not allowed: .${fileExtension}`,
        },
        { status: 415 }
      );
    }

    // Validate file type matches MIME type
    const isValidVideoType = ALLOWED_VIDEO_TYPES.has(file.type);
    const isValidImageType = ALLOWED_IMAGE_TYPES.has(file.type);
    const isValidDocumentType = ALLOWED_DOCUMENT_TYPES.has(file.type);

    if (
      (fileType === "video" && !isValidVideoType) ||
      (fileType === "image" && !isValidImageType) ||
      (fileType === "document" && !isValidDocumentType)
    ) {
      return NextResponse.json(
        {
          error: `File MIME type does not match fileType parameter`,
        },
        { status: 400 }
      );
    }

    // ========================================================================
    // GENERATE SECURE FILENAME
    // ========================================================================

    // Use UUID + timestamp to prevent directory traversal and naming conflicts
    import("uuid").then(async (uuidModule) => {
      const { v4: uuidv4 } = uuidModule;
      const uniqueId = uuidv4();
      const timestamp = Date.now();
      const safeFileName = `${timestamp}-${uniqueId}.${fileExtension}`;

      // Create upload directory if it doesn't exist
      const uploadDir = join(process.cwd(), "public", "uploads", fileType);

      // Ensure directory is within public folder (prevent directory traversal)
      const resolvedPath = join(uploadDir);
      if (!resolvedPath.startsWith(join(process.cwd(), "public"))) {
        throw new Error("Invalid upload directory path");
      }

      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Write file to disk
      const filePath = join(uploadDir, safeFileName);
      const buffer = await file.arrayBuffer();
      await writeFile(filePath, Buffer.from(buffer));

      // ====================================================================
      // LOG TO DATABASE
      // ====================================================================

      try {
        await db.auditLog.create({
          data: {
            userId,
            action: "FILE_UPLOAD",
            resource: fileType,
            details: JSON.stringify({
              originalFileName: fileName,
              safeFileName,
              fileSize: file.size,
              mimeType: file.type,
              fileType,
            }),
            success: true,
          },
        });
      } catch (logError) {
        console.error("Failed to log file upload:", logError);
        // Don't fail the upload if logging fails
      }

      // ====================================================================
      // RETURN SUCCESS RESPONSE
      // ====================================================================

      return NextResponse.json(
        {
          success: true,
          message: "File uploaded successfully",
          file: {
            name: fileName,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            // Return relative path for frontend to use
            path: `/uploads/${fileType}/${safeFileName}`,
            // Unique identifier for reference
            id: uniqueId,
          },
        },
        { status: 201 }
      );
    });

  } catch (error) {
    console.error("File upload error:", error);

    // Log failed upload attempt
    try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        await db.auditLog.create({
          data: {
            userId: (session.user as any)?.id,
            action: "FILE_UPLOAD_FAILED",
            resource: "upload",
            details: error instanceof Error ? error.message : "Unknown error",
            success: false,
          },
        });
      }
    } catch (logError) {
      console.error("Failed to log upload error:", logError);
    }

    return NextResponse.json(
      { error: "File upload failed. Please try again." },
      { status: 500 }
    );
  }
}

// ============================================================================
// OPTIONS ENDPOINT (for CORS preflight)
// ============================================================================

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
