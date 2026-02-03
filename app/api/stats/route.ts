import { NextResponse } from "next/server"
import { getDashboardStats, trackDocumentStat, trackSession } from "@/actions/stats"
import { isAuthenticated } from "@/lib/auth"
import { z } from "zod"

// GET /api/stats - Get dashboard stats (requires auth)
export async function GET() {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const result = await getDashboardStats()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in GET /api/stats:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}

// POST /api/stats - Track a stat (public)
const trackStatSchema = z.object({
  documentId: z.string().min(1, "Document ID is required"),
  action: z.enum(["view", "download", "qr_scan"]),
  sessionId: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const result = trackStatSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      )
    }

    const trackResult = await trackDocumentStat(result.data)
    return NextResponse.json(trackResult)
  } catch (error) {
    console.error("Error in POST /api/stats:", error)
    return NextResponse.json(
      { success: false, error: "Failed to track stat" },
      { status: 500 }
    )
  }
}

// PUT /api/stats - Track session (public)
const trackSessionSchema = z.object({
  sessionToken: z.string().min(1, "Session token is required"),
})

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const result = trackSessionSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      )
    }

    const trackResult = await trackSession(result.data.sessionToken)
    return NextResponse.json(trackResult)
  } catch (error) {
    console.error("Error in PUT /api/stats:", error)
    return NextResponse.json(
      { success: false, error: "Failed to track session" },
      { status: 500 }
    )
  }
}
