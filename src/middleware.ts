import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { hasValidSessionToken } from '@/lib/session-edge'

const locales = ['ar', 'en'];
const defaultLocale = 'ar';

function getLocale(request: NextRequest) {
  const cookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookie && locales.includes(cookie)) return cookie;
  
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang && acceptLang.toLowerCase().includes('en')) return 'en';
  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  const isDashboard = pathname.includes('/dashboard');
  if (isDashboard) {
    const sessionCookie = request.cookies.get('session')?.value;
    const isLogin = pathname.includes('/dashboard/login');
    
    if (isLogin) {
      if (sessionCookie) {
        try {
          const valid = await hasValidSessionToken(sessionCookie);
          if (valid) {
            return NextResponse.redirect(new URL(`/${getLocale(request)}/dashboard`, request.url));
          }
        } catch {}
      }
    } else {
      if (!sessionCookie) {
        return NextResponse.redirect(new URL(`/${getLocale(request)}/dashboard/login`, request.url));
      }
      try {
        const valid = await hasValidSessionToken(sessionCookie);
        if (!valid) throw new Error('Invalid');
      } catch {
        return NextResponse.redirect(new URL(`/${getLocale(request)}/dashboard/login`, request.url));
      }
    }
  }

  // Locale routing
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|images|uploads).*)',
  ],
}
