import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma" // Pastikan path ini benar
import { hashPassword } from "@/lib/crypto" // Import helper hash tadi
import { cookies } from "next/headers"

// Schema Validasi
const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 1. Validasi Input
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Input tidak valid" },
        { status: 400 }
      )
    }

    const { username, password } = result.data

    // 2. Cari User di Database
    const user = await prisma.adminUser.findUnique({
      where: { username },
    })

    // 3. Cek apakah user ada & aktif
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "Username atau password salah" },
        { status: 401 }
      )
    }

    // 4. Cek Password (Hash input dan bandingkan dengan DB)
    const inputHash = hashPassword(password)
    
    if (inputHash !== user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Username atau password salah" },
        { status: 401 }
      )
    }

    // 5. Login Sukses: Set Cookie Session (Sederhana)
    // Di aplikasi real, gunakan JWT atau library auth (NextAuth/Lucia)
    // Untuk kiosk sederhana, kita set cookie manual.
    const cookieStore = await cookies()
    cookieStore.set("admin_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 Hari
      path: "/",
    })

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: { username: user.username, email: user.email }
    })

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}