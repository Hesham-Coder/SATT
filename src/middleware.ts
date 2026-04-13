import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { hasValidSessionToken } from '@/lib/session-edge'

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value
  const pathname = request.nextUrl.pathname
  
  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Exclude login page from protection, including trailing slash variant
    if (pathname === '/dashboard/login' || pathname === '/dashboard/login/') {
      if (sessionCookie) {
        try {
          const valid = await hasValidSessionToken(sessionCookie)

          if (!valid) {
            throw new Error('Invalid session')
          }

          return NextResponse.redirect(new URL('/dashboard', request.url))
        } catch {}
      }
      return NextResponse.next()
    }

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url))
    }

    try {
      const valid = await hasValidSessionToken(sessionCookie)

      if (!valid) {
        throw new Error('Invalid session')
      }

      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/dashboard/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
