import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getSyncStatus, getSyncHistory, fullSync, syncDocuments, syncStats } from "@/lib/sync"
import { z } from "zod"

// GET /api/sync - Get sync status and history
export async function GET(request: Request) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const includeHistory = searchParams.get("history") === "true"
    const historyLimit = parseInt(searchParams.get("limit") || "10")

    const status = await getSyncStatus()

    if (includeHistory) {
      const history = await getSyncHistory(historyLimit)
      return NextResponse.json({
        success: true,
        data: {
          status,
          history: history.data || [],
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: { status },
    })
  } catch (error) {
    console.error("Error in GET /api/sync:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get sync status" },
      { status: 500 }
    )
  }
}

// POST /api/sync - Trigger sync
const syncSchema = z.object({
  type: z.enum(["full", "documents", "stats"]).default("full"),
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

    const body = await request.json().catch(() => ({}))

    // Validate input
    const result = syncSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      )
    }

    const { type } = result.data

    let syncResult
    switch (type) {
      case "documents":
        syncResult = await syncDocuments()
        break
      case "stats":
        syncResult = await syncStats()
        break
      case "full":
      default:
        syncResult = await fullSync()
        break
    }

    return NextResponse.json({
      success: syncResult.success,
      data: syncResult,
      message: syncResult.success
        ? `Sync completed: ${syncResult.syncedRecords} records synced`
        : `Sync failed: ${syncResult.errors.join(", ")}`,
    })
  } catch (error) {
    console.error("Error in POST /api/sync:", error)
    return NextResponse.json(
      { success: false, error: "Failed to perform sync" },
      { status: 500 }
    )
  }
}
