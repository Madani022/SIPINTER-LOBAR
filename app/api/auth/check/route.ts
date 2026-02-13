import { NextResponse } from "next/server"
import { isAuthenticated, getSession } from "@/lib/auth"

// Definisikan interface agar property expiresAt dikenali
interface SessionData {
  expiresAt?: string | Date | null;
  [key: string]: any;
}

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

    // Perbaikan Error 2352: Gunakan 'as unknown' sebelum 'as SessionData'
    const session = (await getSession()) as unknown as SessionData | null

    return NextResponse.json({
      success: true,
      data: {
        isAuthenticated: true,
        // Sekarang session?.expiresAt aman
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