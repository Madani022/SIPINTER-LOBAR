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

export async function logout() {
  const { cookies } = await import("next/headers");
  (await cookies()).delete("session_token"); // Sesuaikan dengan nama cookie kamu
}

// Contoh fungsi extendSession (memperbarui masa berlaku session)
export async function extendSession() {
  // Logika untuk memperpanjang session di sini
  // Biasanya mengupdate expiration date di database atau cookie
  console.log("Session extended");
}