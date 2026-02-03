import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getSettings, updateSettings } from "@/actions/settings"
import { z } from "zod"

// GET /api/settings - Get all settings
export async function GET() {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const result = await getSettings()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in GET /api/settings:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// PATCH /api/settings - Update settings
const updateSettingsSchema = z.record(z.unknown())

export async function PATCH(request: Request) {
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
    const result = updateSettingsSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
        },
        { status: 400 }
      )
    }

    const updateResult = await updateSettings(result.data)
    return NextResponse.json(updateResult)
  } catch (error) {
    console.error("Error in PATCH /api/settings:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
