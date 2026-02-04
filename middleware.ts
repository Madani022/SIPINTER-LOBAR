import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Ambil cookie "admin_session"
  const session = request.cookies.get("admin_session")?.value
  const pathname = request.nextUrl.pathname

  // Cek apakah user sedang di halaman login
  const isLoginPage = pathname === "/admin/login"
  
  // Cek apakah user mencoba masuk area admin (selain login)
  const isProtectedPath = pathname.startsWith("/admin") && !isLoginPage

  // 1. BELUM LOGIN, TAPI MAKSA MASUK DASHBOARD -> TENDANG KE LOGIN
  if (isProtectedPath && !session) {
    // Redirect ke login
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // 2. SUDAH LOGIN, TAPI BUKA HALAMAN LOGIN LAGI -> LEMPAR KE DASHBOARD
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }
  
  // 3. ISENG BUKA "/admin" SAJA -> ARAHKAN SESUAI STATUS
  if (pathname === "/admin") {
    if (session) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    } else {
        return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

// Terapkan hanya pada route yang diawali /admin
export const config = {
  matcher: ["/admin/:path*"],
}