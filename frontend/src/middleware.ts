import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    if (request.cookies.has("token")) {
        if (request.nextUrl.pathname.endsWith('/login') || request.nextUrl.pathname.endsWith('/register')) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next()
    }
    if (request.nextUrl.pathname.endsWith('/login') || request.nextUrl.pathname.endsWith('/register')) {
        return NextResponse.next();
    }
    const res = NextResponse.redirect(new URL('/login', request.url));
    return res;
}
export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
      '/',
    ],
  };