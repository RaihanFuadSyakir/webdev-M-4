import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    console.log("kena middleware");
    if (request.cookies.has("token")) {
        if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
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
// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/:path*'],
}