import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    console.log("kena middleware")
    if (request.nextUrl.pathname.endsWith('/login') || request.nextUrl.pathname.endsWith('/register')) {
        return NextResponse.next()
    }
    if (request.cookies.has("token")) {
        return NextResponse.next()
    }
    const res = NextResponse.redirect(new URL('/login', request.url));
    return res;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/:path',
}