// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  // Public paths that do not require authentication
  const publicPaths = ['/login']

  const isPublic = publicPaths.some(path => pathname === path)

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Apply middleware to all routes except:
     * - API routes (/api)
     * - Static files (/favicon.ico, .png, etc.)
     * - Next.js internal files (/_next)
     */
    '/((?!api|_next|favicon.ico|.*\\..*).*)',
  ],
}
