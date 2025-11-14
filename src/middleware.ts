import { NextResponse, type NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Proteger rotas que requerem autenticação
  const protectedPaths = ['/dashboard', '/admin', '/profile']
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath) {
    const hasAccess = Boolean(req.cookies.get("sb-access-token")?.value)
    if (!hasAccess) {
      const url = new URL("/login", req.url)
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*"],
}