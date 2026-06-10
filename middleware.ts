import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session


  const isAdminRoute = nextUrl.pathname.startsWith("/dashboard")
  const isCheckoutRoute = nextUrl.pathname.startsWith("/checkout")
  const isAuthRoute =
    nextUrl.pathname === "/login" ||
    nextUrl.pathname === "/register"

  // If trying to access an admin route
  if (isAdminRoute) {
    // Not logged in → redirect to login
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    // Logged in but not admin → redirect to homepage
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  // If trying to access checkout without being logged in
  if (isCheckoutRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login?callbackUrl=/checkout", nextUrl))
  }

  // If already logged in and trying to visit login/register redirect to homepage
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],           //except these
}