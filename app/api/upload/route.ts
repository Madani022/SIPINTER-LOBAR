import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// Configuration
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "documents")
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_TYPES = ["application/pdf"]

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
  } catch {
    // Directory already exists
  }
}

// Generate unique filename
function generateFilename(originalName: string): string {
  const ext = path.extname(originalName)
  const baseName = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${baseName}-${timestamp}-${random}${ext}`
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only PDF files are allowed.",
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
        },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    await ensureUploadDir()

    // Generate unique filename
    const filename = generateFilename(file.name)
    const filePath = path.join(UPLOAD_DIR, filename)
    const publicPath = `/uploads/documents/${filename}`

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      data: {
        filename,
        originalName: file.name,
        filePath: publicPath,
        fileSize: file.size,
        mimeType: file.type,
      },
      message: "File uploaded successfully",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    )
  }
}

// Delete uploaded file
export async function DELETE(request: Request) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get("path")

    if (!filePath) {
      return NextResponse.json(
        { success: false, error: "No file path provided" },
        { status: 400 }
      )
    }

    // Security: Only allow deleting files in the uploads directory
    if (!filePath.startsWith("/uploads/documents/")) {
      return NextResponse.json(
        { success: false, error: "Invalid file path" },
        { status: 400 }
      )
    }

    const { unlink } = await import("fs/promises")
    const fullPath = path.join(process.cwd(), "public", filePath)

    try {
      await unlink(fullPath)
    } catch {
      // File doesn't exist, that's okay
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete file" },
      { status: 500 }
    )
  }
}
