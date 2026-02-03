import { NextResponse } from "next/server"
import { getDocuments, createDocument } from "@/actions/documents"
import { isAuthenticated } from "@/lib/auth"
import { z } from "zod"

// GET /api/documents - List documents
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const options = {
      categoryId: searchParams.get("categoryId") || undefined,
      isActive: searchParams.get("isActive") === "true" ? true : searchParams.get("isActive") === "false" ? false : undefined,
      isFeatured: searchParams.get("isFeatured") === "true" ? true : undefined,
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
      offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined,
    }

    const result = await getDocuments(options)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in GET /api/documents:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch documents" },
      { status: 500 }
    )
  }
}

// POST /api/documents - Create document
const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  filePath: z.string().min(1, "File path is required"),
  fileSize: z.number().min(0),
  qrCode: z.string().optional(),
  downloadUrl: z.string().url().optional().or(z.literal("")),
  version: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const result = createDocumentSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      )
    }

    const createResult = await createDocument(result.data)

    if (!createResult.success) {
      return NextResponse.json(createResult, { status: 400 })
    }

    return NextResponse.json(createResult, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/documents:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create document" },
      { status: 500 }
    )
  }
}
