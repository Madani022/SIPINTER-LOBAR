"use server"

import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createHash } from "crypto"

export async function login(prevState: any, formData: FormData) {
  // 1. Ambil input
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  // --- CCTV 1: Cek Inputan ---
  console.log("====================================")
  console.log("🕵️ LOGIN ATTEMPT")
  console.log("Input Username:", `"${username}"`) // Pakai kutip biar tau ada spasi atau null
  console.log("Input Password:", `"${password}"`)
  // ---------------------------

  if (!username || !password) {
    console.log("❌ GAGAL: Input kosong")
    return { success: false, error: "Username dan password wajib diisi" }
  }

  try {
    // 2. Cek User di Database
    const user = await prisma.adminUser.findUnique({
      where: { username },
    })

    // --- CCTV 2: Cek Database ---
    console.log("Database User:", user ? "DITEMUKAN ✅" : "TIDAK DITEMUKAN ❌")
    if (user) {
        console.log("DB Password Hash:", user.passwordHash)
    }
    // ----------------------------

    // 3. Hitung Hash Inputan (Manual disini biar yakin)
    const inputHash = createHash("sha256").update(password).digest("hex")
    
    // --- CCTV 3: Cek Pencocokan ---
    console.log("Input Hash Calc :", inputHash)
    
    const isMatch = user && user.isActive && (inputHash === user.passwordHash)
    console.log("APAKAH COCOK?  :", isMatch ? "YA ✅" : "TIDAK ❌")
    console.log("====================================")
    // ------------------------------

    if (!isMatch) {
      return { success: false, error: "Username atau password salah!" }
    }

    // 4. Login Sukses -> Buat Cookie
    const oneDay = 24 * 60 * 60 * 1000
    const cookieStore = await cookies()
    
    cookieStore.delete("admin_session")
    cookieStore.set("admin_session", user.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: oneDay,
    })

    console.log("✅ LOGIN BERHASIL! Redirecting...")

  } catch (error) {
    console.error("Login Error:", error)
    return { success: false, error: "Terjadi kesalahan server" }
  }

  redirect("/admin/dashboard")
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  redirect("/admin/login")
}