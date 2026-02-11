// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const externalToken = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const loginUrl =
    process.env.CLIENT_LOGIN ||
    process.env.NEXT_PUBLIC_CLIENT_LOGIN ||
    'https://devreals2.simplex3d.com/authenticator/login'

  const basePath = request.nextUrl.basePath ?? ''
  const loginPath = `${basePath}/login`
  const isLoginPath = pathname === loginPath
  const tokenParam = request.nextUrl.searchParams.get('token')
  const hasExternalToken = Boolean(externalToken || tokenParam)

  if (!token) {
    if (hasExternalToken) {
      return NextResponse.next()
    }
    return NextResponse.redirect(loginUrl)
  }

  if (token && isLoginPath) {
    const appRoot = basePath || '/'
    return NextResponse.redirect(new URL(appRoot, request.url))
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
