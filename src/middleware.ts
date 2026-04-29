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
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  const resolvedLocale = pathnameLocale ?? getLocale(request);
  
  const isDashboard = pathname.includes('/dashboard');
  if (isDashboard) {
    const sessionCookie = request.cookies.get('session')?.value;
    const isLogin = pathname.includes('/dashboard/login');
    
    if (isLogin) {
      if (sessionCookie) {
        try {
          const valid = await hasValidSessionToken(sessionCookie);
          if (valid) {
            return NextResponse.redirect(new URL(`/${resolvedLocale}/dashboard`, request.url));
          }
        } catch {}
      }
    } else {
      if (!sessionCookie) {
        return NextResponse.redirect(new URL(`/${resolvedLocale}/dashboard/login`, request.url));
      }
      try {
        const valid = await hasValidSessionToken(sessionCookie);
        if (!valid) throw new Error('Invalid');
      } catch {
        return NextResponse.redirect(new URL(`/${resolvedLocale}/dashboard/login`, request.url));
      }
    }
  }

  // Locale routing
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-satt-locale", resolvedLocale);

  if (pathnameLocale) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Redirect if there is no locale
  request.nextUrl.pathname = `/${resolvedLocale}${pathname === '/' ? '' : pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|images|uploads).*)',
  ],
}
