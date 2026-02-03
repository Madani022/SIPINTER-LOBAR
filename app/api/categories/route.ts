import { NextResponse } from "next/server"
import { getCategories, createCategory } from "@/actions/categories"
import { isAuthenticated } from "@/lib/auth"
import { z } from "zod"

// GET /api/categories - List categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("includeInactive") === "true"

    const result = await getCategories(includeInactive)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in GET /api/categories:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create category
const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
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
    const result = createCategorySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      )
    }

    const createResult = await createCategory(result.data)

    if (!createResult.success) {
      return NextResponse.json(createResult, { status: 400 })
    }

    return NextResponse.json(createResult, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/categories:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    )
  }
}
