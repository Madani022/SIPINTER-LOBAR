import { NextResponse } from "next/server"
import { trackDocumentStat, trackSession, endSession } from "@/actions/stats"
import { z } from "zod"

// POST /api/track - Track document interaction (public endpoint for kiosk)
const trackSchema = z.object({
  type: z.enum(["view", "download", "qr_scan", "session_start", "session_end"]),
  documentId: z.string().optional(),
  sessionToken: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const result = trackSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      )
    }

    const { type, documentId, sessionToken } = result.data

    // Handle different tracking types
    switch (type) {
      case "view":
      case "download":
      case "qr_scan":
        if (!documentId) {
          return NextResponse.json(
            { success: false, error: "Document ID is required for this action" },
            { status: 400 }
          )
        }
        const statResult = await trackDocumentStat({
          documentId,
          action: type,
          sessionId: sessionToken,
        })
        return NextResponse.json(statResult)

      case "session_start":
        if (!sessionToken) {
          return NextResponse.json(
            { success: false, error: "Session token is required" },
            { status: 400 }
          )
        }
        const sessionResult = await trackSession(sessionToken)
        return NextResponse.json(sessionResult)

      case "session_end":
        if (!sessionToken) {
          return NextResponse.json(
            { success: false, error: "Session token is required" },
            { status: 400 }
          )
        }
        const endResult = await endSession(sessionToken)
        return NextResponse.json(endResult)

      default:
        return NextResponse.json(
          { success: false, error: "Invalid tracking type" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Error in POST /api/track:", error)
    return NextResponse.json(
      { success: false, error: "Failed to track" },
      { status: 500 }
    )
  }
}
