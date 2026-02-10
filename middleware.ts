import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Ambil cookie session
  const session = request.cookies.get("admin_session")?.value
  const pathname = request.nextUrl.pathname

  // KASUS 1: User mengakses root admin (/admin)
  // KITA BIARKAN LEWAT. 
  // Biarkan page.tsx yang menentukan mau menampilkan Form Login atau Dashboard 
  // berdasarkan ada/tidaknya cookie atau state.
  if (pathname === "/admin") {
    return NextResponse.next()
  }

  // KASUS 2: PROTEKSI SUB-PATH (Jaga-jaga masa depan)
  // Jika user mencoba akses /admin/apapun TAPI belum login
  // Redirect paksa ke halaman utama /admin agar login dulu
  if (pathname.startsWith("/admin/") && !session) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // Sisanya ijinkan lewat
  return NextResponse.next()
}

// Config matcher
export const config = {
  matcher: ["/admin/:path*"],
}