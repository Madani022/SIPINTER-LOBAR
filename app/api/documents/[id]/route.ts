import { NextResponse } from "next/server"
import { getDocuments, updateDocument, deleteDocument } from "@/actions/documents"
import { isAuthenticated } from "@/lib/auth"
import { z } from "zod"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/documents/[id] - Get single document
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const result = await getDocuments({ categoryId: id })

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in GET /api/documents/[id]:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch document" },
      { status: 500 }
    )
  }
}

// PATCH /api/documents/[id] - Update document
const updateDocumentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  filePath: z.string().optional(),
  fileSize: z.number().min(0).optional(),
  qrCode: z.string().optional(),
  downloadUrl: z.string().url().optional().or(z.literal("")),
  version: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Validate input
    const result = updateDocumentSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      )
    }

    const updateResult = await updateDocument(id, result.data)

    if (!updateResult.success) {
      return NextResponse.json(updateResult, { status: 400 })
    }

    return NextResponse.json(updateResult)
  } catch (error) {
    console.error("Error in PATCH /api/documents/[id]:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update document" },
      { status: 500 }
    )
  }
}

// DELETE /api/documents/[id] - Delete document
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const result = await deleteDocument(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in DELETE /api/documents/[id]:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete document" },
      { status: 500 }
    )
  }
}
