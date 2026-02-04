import { cookies } from "next/headers"

/**
 * Fungsi SATPAM: Cek apakah user punya tiket masuk
 * Dipakai di: Halaman Admin, Upload Dokumen, Server Actions
 */
export async function isAuthenticated() {
  // --- PERBAIKAN: Tambahkan 'await' di sini ---
  const cookieStore = await cookies()
  
  // Ambil cookie
  const session = cookieStore.get("admin_session")

  // Kalau ada cookie, return true
  return !!session
}

/**
 * Fungsi TAMBAHAN: Ambil data user dari session (Opsional)
 */
export async function getSession() {
  // --- PERBAIKAN: Tambahkan 'await' di sini juga ---
  const cookieStore = await cookies()
  
  const session = cookieStore.get("admin_session")
  return session?.value // Mengembalikan User ID
}