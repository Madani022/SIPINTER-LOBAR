import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_NAME = "kiosk_admin_session"

// Routes that require authentication
const protectedRoutes = ["/admin/dashboard", "/admin/documents", "/admin/settings", "/admin/sync"]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/admin/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(SESSION_NAME)

  // Check if session exists and is valid
  let isAuthenticated = false
  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value)
      isAuthenticated = session.expiresAt > Date.now()
    } catch {
      isAuthenticated = false
    }
  }

  // Redirect authenticated users away from auth routes
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
    return NextResponse.next()
  }

  // Protect admin routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
