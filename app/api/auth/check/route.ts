import { NextResponse } from "next/server"
import { isAuthenticated, getSession, extendSession } from "@/lib/auth"

export async function GET() {
  try {
    const authenticated = await isAuthenticated()

    if (!authenticated) {
      return NextResponse.json({
        success: true,
        data: {
          isAuthenticated: false,
          expiresAt: null,
        },
      })
    }

    // Extend session on activity
    await extendSession()

    const session = await getSession()

    return NextResponse.json({
      success: true,
      data: {
        isAuthenticated: true,
        expiresAt: session?.expiresAt || null,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred checking authentication",
      },
      { status: 500 }
    )
  }
}
