# 🔐 SECURITY GUIDELINES FOR DEVELOPERS

This document outlines security best practices for developing and maintaining the Turab Root application.

---

## TABLE OF CONTENTS

1. [Core Security Principles](#core-security-principles)
2. [Authentication & Authorization](#authentication--authorization)
3. [Input Validation](#input-validation)
4. [Database Security](#database-security)
5. [API Security](#api-security)
6. [File Upload Security](#file-upload-security)
7. [Error Handling](#error-handling)
8. [Logging & Monitoring](#logging--monitoring)
9. [Dependency Management](#dependency-management)
10. [Code Review Checklist](#code-review-checklist)

---

## CORE SECURITY PRINCIPLES

### The Three Lines of Defense

```
Frontend Validation → Server-Side Validation → Database Constraints
     (UX)               (Security)           (Data Integrity)
```

**NEVER** trust data from the frontend. Always validate on the server.

### Principle of Least Privilege

- Users should only have permissions for what they need
- Services should run as non-root users
- Database users should have minimal required permissions
- API keys should have limited scopes

### Defense in Depth

Don't rely on a single security measure. Layer security controls:

```
User Input
    ↓
Rate Limiting (API level)
    ↓
Authentication (Session validation)
    ↓
Authorization (Role/permission check)
    ↓
Input Validation (Zod schema)
    ↓
Business Logic
    ↓
Database Query
    ↓
Data Access Control
```

### Never Expose Secrets

- 🚫 Never log API keys or passwords
- 🚫 Never put secrets in error messages
- 🚫 Never commit .env.local to Git
- 🚫 Never hardcode credentials
- ✅ Use environment variables
- ✅ Rotate secrets regularly
- ✅ Use strong, random secrets

---

## AUTHENTICATION & AUTHORIZATION

### Login Implementation (CORRECT)

```typescript
// ✅ CORRECT: Server-side authentication with NextAuth
import { signIn } from "next-auth/react";

async function handleLogin(email: string, password: string) {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    // Credentials provider returns specific errors (server-side validated)
    setError(result.error);
  }
}
```

### Login Implementation (WRONG)

```typescript
// ❌ WRONG: Client-side credentials check
const users = {
  "admin@example.com": "password123",
};

if (email in users && users[email] === password) {
  localStorage.setItem("loggedIn", "true");  // Trivial to bypass!
}
```

### Protecting Routes

```typescript
// ✅ CORRECT: NextAuth middleware protects routes
// In middleware.ts:
if (pathname.startsWith("/admin")) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}
```

### Password Requirements

Enforce strong password policies:

```typescript
// ✅ CORRECT: Zod schema with strong password requirements
const passwordSchema = z
  .string("Password is required")
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/\d/, "Must contain digit")
  .regex(/[@$!%*?&#^]/, "Must contain special character");
```

### Password Storage

```typescript
// ✅ CORRECT: Hash with bcrypt
import { hash, compare } from "bcryptjs";

// Create user
const hashedPassword = await hash(password, 12);
await db.user.create({
  data: { email, password: hashedPassword },
});

// Verify login
const passwordMatch = await compare(inputPassword, user.password);
```

### Session Management

```typescript
// ✅ CORRECT: Use NextAuth sessions (server-side)
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Use session.user.id for database operations
  const userId = session.user.id;
}
```

```typescript
// ❌ WRONG: Storing auth state in localStorage
const isLoggedIn = localStorage.getItem("isLoggedIn");  // Easily spoofed!
```

### Authorization Checks

```typescript
// ✅ CORRECT: Check user role server-side
async function updateProject(projectId: string, userId: string, data: any) {
  // Verify user owns this project
  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (project.authorId !== userId) {
    throw new Error("Unauthorized: You don't own this project");
  }

  return db.project.update({
    where: { id: projectId },
    data,
  });
}
```

---

## INPUT VALIDATION

### Using Zod Schemas

```typescript
// ✅ CORRECT: Validate all inputs with Zod
import { z } from "zod";

const contactSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  message: z.string().min(10).max(5000),
});

export async function POST(request: NextRequest) {
  const data = await request.json();
  
  // This throws if validation fails
  const validated = contactSchema.parse(data);
  
  // Safe to use validated data
  return sendEmail(validated.email, validated.message);
}
```

### Safe Parsing with Error Handling

```typescript
// ✅ CORRECT: Use safeParse for better error handling
const result = contactSchema.safeParse(data);

if (!result.success) {
  return NextResponse.json(
    { errors: result.error.errors },
    { status: 400 }
  );
}

const validated = result.data;
```

### Prevent XSS

```typescript
// ❌ WRONG: Directly rendering user input
function Comment({ text }: { text: string }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
}

// ✅ CORRECT: React auto-escapes by default
function Comment({ text }: { text: string }) {
  return <div>{text}</div>;  // Safe!
}

// ✅ CORRECT: Sanitize if using HTML
import DOMPurify from "dompurify";
function RichComment({ html }: { html: string }) {
  return <div>{DOMPurify.sanitize(html)}</div>;
}
```

### Prevent Path Traversal

```typescript
// ❌ WRONG: User can access any file
app.get("/file/:path", (req, res) => {
  const filePath = `/uploads/${req.params.path}`;  // User provides path!
  res.sendFile(filePath);  // User could request ../../../../etc/passwd
});

// ✅ CORRECT: Validate file path
import { resolve, normalize } from "path";

app.get("/file/:fileId", (req, res) => {
  const file = db.getFile(req.params.fileId);
  if (!file) return res.status(404);
  
  // Ensure path is within allowed directory
  const filePath = resolve(normalize("/uploads/" + file.path));
  if (!filePath.startsWith("/uploads")) {
    throw new Error("Path traversal attempt!");
  }
  
  res.sendFile(filePath);
});
```

### Prevent NoSQL/SQL Injection

```typescript
// ❌ WRONG: Direct string interpolation
const user = await db.$queryRaw(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ CORRECT: Use Prisma ORM (parameterized queries)
const user = await db.user.findUnique({
  where: { email },
});

// ✅ CORRECT: If using raw SQL, use parameters
const user = await db.$queryRaw`SELECT * FROM users WHERE email = ${email}`;
```

---

## DATABASE SECURITY

### Use Prisma ORM (Never Raw SQL)

```typescript
// ✅ CORRECT: Use Prisma
const user = await db.user.findUnique({
  where: { email },
  select: { id: true, email: true, role: true },  // Exclude password
});

// ❌ WRONG: Raw SQL
const user = db.execute(`SELECT * FROM users WHERE email = '${email}'`);
```

### Limit Select Columns

```typescript
// ✅ CORRECT: Only select needed fields, exclude passwords
const user = await db.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    name: true,
    role: true,
    // password field not included
  },
});

// ❌ WRONG: Select all fields including sensitive data
const user = await db.user.findUnique({
  where: { id: userId },
  // Returns password, hashedToken, etc.
});
```

### Prevent Bulk Delete Attacks

```typescript
// ❌ WRONG: Could delete entire table
await db.post.deleteMany();  // No where clause!

// ✅ CORRECT: Require where clause (enforced in Prisma middleware)
await db.post.deleteMany({
  where: { authorId: userId },  // Only delete user's posts
});
```

### Use Transactions for Critical Operations

```typescript
// ✅ CORRECT: Transaction ensures atomicity
const user = await db.$transaction(async (tx) => {
  // Create user
  const newUser = await tx.user.create({
    data: { email, name },
  });

  // Log creation
  await tx.auditLog.create({
    data: {
      userId: newUser.id,
      action: "USER_CREATED",
    },
  });

  return newUser;
});
```

---

## API SECURITY

### Rate Limiting

```typescript
// ✅ CORRECT: Apply rate limiting
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  if (checkRateLimit(request)) {
    return rateLimitResponse(request);
  }

  // Process request
}
```

### CORS Configuration

```typescript
// ❌ WRONG: Allow all origins
cors: { origin: "*" }

// ✅ CORRECT: Restrict to known origins
cors: {
  origin: [
    "https://yourdomain.com",
    "https://app.yourdomain.com",
  ],
  credentials: true,
}
```

### Validate Content-Type

```typescript
// ✅ CORRECT: Verify content type
export async function POST(request: NextRequest) {
  if (request.headers.get("content-type") !== "application/json") {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  const data = await request.json();
}
```

### Error Messages Don't Leak Information

```typescript
// ❌ WRONG: Reveals system information
try {
  const user = await db.user.findUnique({ where: { email } });
} catch (error) {
  return NextResponse.json({
    error: `Database error: ${error.message}`,  // Leaks DB schema!
  });
}

// ✅ CORRECT: Generic error messages
try {
  const user = await db.user.findUnique({ where: { email } });
} catch (error) {
  console.error("Database error:", error);  // Log internally
  return NextResponse.json(
    { error: "An error occurred. Please try again." },
    { status: 500 }
  );
}
```

### Use HTTPS Only in Production

```typescript
// ✅ CORRECT: Enforce HTTPS
if (process.env.NODE_ENV === "production") {
  if (!request.url.startsWith("https://")) {
    return NextResponse.redirect(request.url.replace("http://", "https://"));
  }
}
```

---

## FILE UPLOAD SECURITY

### Validate File Type Server-Side

```typescript
// ✅ CORRECT: Validate MIME type server-side
const ALLOWED_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "image/jpeg",
  "image/png",
]);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "File type not allowed" },
      { status: 415 }
    );
  }
}
```

### Check File Size

```typescript
// ✅ CORRECT: Limit file size
const MAX_FILE_SIZE = 50 * 1024 * 1024;  // 50MB

if (file.size > MAX_FILE_SIZE) {
  return NextResponse.json(
    { error: "File too large" },
    { status: 413 }
  );
}
```

### Use Random Filenames

```typescript
// ❌ WRONG: Use user-provided filename
const path = `/uploads/${file.name}`;

// ✅ CORRECT: Generate random filename
import { v4 as uuid } from "uuid";
const randomName = `${Date.now()}-${uuid()}.${ext}`;
const path = `/uploads/${randomName}`;
```

### Store Outside Web Root

```typescript
// ❌ WRONG: Store in public directory
const path = `public/uploads/${filename}`;

// ✅ CORRECT: Store outside web root
const path = `/var/data/uploads/${filename}`;
// Configure Nginx to serve with proper headers
```

### Never Make Uploads Executable

```bash
# ✅ CORRECT: Set restrictive permissions
chmod 644 /var/data/uploads/*
chmod 755 /var/data/uploads/

# Prevent PHP execution in upload directory
# Add to Nginx config:
# location /uploads {
#   disable_symlinks on;
#   expires 30d;
# }
```

---

## ERROR HANDLING

### Don't Log Sensitive Data

```typescript
// ❌ WRONG: Logs expose secrets
console.log("User password:", password);
console.log("API key:", process.env.STRIPE_KEY);

// ✅ CORRECT: Only log necessary info
console.log("Password validation failed");
console.log("Payment processed");
```

### Custom Error Messages for Users

```typescript
// ❌ WRONG: Technical error to user
return NextResponse.json({
  error: "TypeError: Cannot read property 'id' of undefined",
});

// ✅ CORRECT: User-friendly message
return NextResponse.json({
  error: "An error occurred. Please try again.",
  requestId: "abc123",  // For support
});
```

### Log Errors for Debugging

```typescript
// ✅ CORRECT: Log detailed errors internally
export async function POST(request: NextRequest) {
  try {
    // Code here
  } catch (error) {
    // Log with context
    console.error("[POST /api/upload] Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      requestId: request.headers.get("x-request-id"),
      timestamp: new Date().toISOString(),
    });

    // Return generic response to user
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
```

---

## LOGGING & MONITORING

### Log Authentication Events

```typescript
// ✅ CORRECT: Log all auth attempts
await db.auditLog.create({
  data: {
    userId: user?.id,
    action: "LOGIN_ATTEMPT",
    success: passwordMatch,
    details: passwordMatch ? undefined : "Invalid password",
  },
});
```

### Log Sensitive Operations

```typescript
// ✅ CORRECT: Log file uploads
await db.auditLog.create({
  data: {
    userId,
    action: "FILE_UPLOAD",
    resource: "file",
    details: JSON.stringify({
      originalName: file.name,
      size: file.size,
      type: file.type,
    }),
    success: true,
  },
});
```

### Monitor Suspicious Activity

```typescript
// ✅ CORRECT: Alert on suspicious patterns
async function checkSuspiciousActivity(userId: string) {
  const failedLogins = await db.auditLog.count({
    where: {
      userId,
      action: "LOGIN_ATTEMPT",
      success: false,
      createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
    },
  });

  if (failedLogins > 5) {
    console.error(`[SECURITY] Suspicious login activity for user ${userId}`);
    // Could lock account or send alert
  }
}
```

---

## DEPENDENCY MANAGEMENT

### Keep Dependencies Updated

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check for outdated packages
npm outdated

# Update safely
npm update  # Only updates minor/patch versions
npm install package@latest  # Update specific package
```

### Avoid Dangerous Packages

Watch for:
- Packages with known vulnerabilities
- Abandoned packages (no updates in 2+ years)
- Packages with excessive permissions
- Packages from untrusted authors

```bash
# Check package info before installing
npm info package-name
npm view package-name repository
```

### Lock Dependency Versions

```bash
# package-lock.json should be committed
# This ensures everyone uses exact same versions
git add package-lock.json
```

---

## CODE REVIEW CHECKLIST

Before merging any code, verify:

### Authentication & Authorization
- [ ] No hardcoded credentials
- [ ] User identity verified server-side
- [ ] Authorization checks present
- [ ] Passwords hashed (never plain-text)
- [ ] Sessions properly managed

### Input Validation
- [ ] All user inputs validated with Zod
- [ ] File types validated server-side
- [ ] File sizes limited
- [ ] Special characters escaped
- [ ] No SQL/NoSQL injection possible

### Database
- [ ] Using Prisma ORM
- [ ] Only selecting necessary columns
- [ ] Bulk operations have where clause
- [ ] Transactions used for critical ops
- [ ] No raw SQL queries

### API Security
- [ ] Rate limiting configured
- [ ] CORS origins restricted
- [ ] Content-Type validated
- [ ] Error messages generic
- [ ] HTTPS enforced

### Error Handling
- [ ] No secrets in error messages
- [ ] Errors logged with context
- [ ] Stack traces not exposed to users
- [ ] User-friendly error messages

### File Uploads
- [ ] MIME type validated server-side
- [ ] File size limited
- [ ] Random filename generated
- [ ] Outside web root stored
- [ ] Not executable

### Logging
- [ ] Sensitive operations logged
- [ ] Auth attempts logged
- [ ] No passwords in logs
- [ ] Audit trail maintained
- [ ] Errors logged with context

### Dependencies
- [ ] No new vulnerabilities (`npm audit`)
- [ ] Version pinned in package-lock.json
- [ ] Package reputable and maintained

---

## SECURITY INCIDENT RESPONSE

### If a Vulnerability is Discovered

1. **Do NOT** publicly disclose
2. **DO** notify: security@yourdomain.com
3. **Create** a private issue/discussion
4. **Document** the vulnerability
5. **Develop** a fix
6. **Test** thoroughly
7. **Deploy** fix to production
8. **Disclose** responsibly after patch

### If a Compromise is Suspected

1. **IMMEDIATELY** revoke all credentials
2. **Check** logs for unauthorized access
3. **Isolate** affected systems
4. **Restore** from backups
5. **Patch** the vulnerability
6. **Verify** no backdoors remain
7. **Notify** affected users
8. **Post-mortem** to prevent recurrence

---

## RESOURCES

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/nodejs-security/)
- [Prisma Security](https://www.prisma.io/docs/reference/api-reference/prisma-client-js/prisma-client-data-exposure)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Last Updated**: 2025  
**Status**: Active  
**Contact**: security@yourdomain.com
