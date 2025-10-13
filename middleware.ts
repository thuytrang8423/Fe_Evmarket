import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // Protect checkout route
  if (pathname.startsWith('/checkout')) {
    const hasRefresh =
      req.cookies.get('refreshToken') ||
      req.cookies.get('refresh_token') ||
      req.cookies.get('rt') ||
      req.cookies.get('refresh')

    // If no refresh token cookie, redirect to login with redirect back to original URL
    if (!hasRefresh) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.search = ''
      url.searchParams.set('redirect', `${pathname}${search || ''}`)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/checkout/:path*'],
}
