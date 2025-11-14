import { NextResponse, type NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const hasAccess = Boolean(req.cookies.get("sb-access-token")?.value)
    if (!hasAccess) {
      const url = new URL("/login", req.url)
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}