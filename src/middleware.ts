import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  if (process.env.PLAYWRIGHT_TEST === "1") {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session')?.value
  const pathname = request.nextUrl.pathname
  
  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Exclude login page from protection, including trailing slash variant
    if (pathname === '/dashboard/login' || pathname === '/dashboard/login/') {
      if (sessionCookie) {
        try {
          await decrypt(sessionCookie)
          return NextResponse.redirect(new URL('/dashboard', request.url))
        } catch {}
      }
      return NextResponse.next()
    }

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url))
    }

    try {
      await decrypt(sessionCookie)
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
