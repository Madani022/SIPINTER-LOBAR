import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Karena 'logout' tidak ada di @/lib/auth, kita hapus cookie secara manual
    const cookieStore = await cookies()
    cookieStore.delete("session") // Pastikan nama cookie ini sesuai (misal: "token" atau "session")

    return NextResponse.json({
      success: true,
      message: "Logout successful",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during logout",
      },
      { status: 500 }
    )
  }
}