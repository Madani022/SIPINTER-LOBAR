import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma" // Opsional, jika mau cek user exist

export async function isAuthenticated() {
  const cookieStore = await cookies()
  
  // 1. Ambil cookie yang kita set saat Login
  const session = cookieStore.get("admin_session")

  // 2. Jika tidak ada cookie, berarti belum login
  if (!session || !session.value) {
    return false
  }

  // 3. (Opsional & Lebih Aman) Cek apakah ID user di cookie benar-benar ada di DB
  // Kalau mau simpel (tanpa cek DB tiap request), cukup return true di sini.
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: session.value, isActive: true }
    })
    
    return !!user // True jika user ketemu, False jika tidak
  } catch (error) {
    console.error("Auth check error:", error)
    return false
  }
}

// Biarkan fungsi login ini kosong atau hapus saja, 
// karena kita sekarang pakai API Route (/api/auth/login) untuk login.
export async function login() {
  return { success: false, error: "Please use API route for login" }
}