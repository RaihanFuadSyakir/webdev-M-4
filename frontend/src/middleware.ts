import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { base64url, EncryptJWT, jwtDecrypt, JWTDecryptResult } from 'jose';
import {cookies} from 'next/headers'
export async function middleware(request: NextRequest) {
  const secret = base64url.decode(process.env.PRIVATE_CODE!);
  const res = NextResponse.next();

  if (request.cookies.has("token")) {
    const token = request.cookies.get("token");
    try {
      const decryptedToken = await jwtDecrypt(token!.value, secret);
      if (isTokenExpired(decryptedToken)) {
        cookies().delete("username");
        cookies().delete("token");
        return NextResponse.redirect('/login');
      } else if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
        return NextResponse.redirect(new URL('/dashboard',request.url));
      }
    } catch (error) {
      // Handle token decryption error, e.g., invalid token
      console.error("Error decrypting JWT:", error);
      if (request.nextUrl.pathname.startsWith('/login')) {
        res.cookies.delete("token");
        console.log("Token deleted due to decryption error");
        return NextResponse.redirect(new URL('/login',request.url));
      }
      return NextResponse.redirect(new URL('/login',request.url));
    }
  } else {
    if (!request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return res;
}

function isTokenExpired(token: JWTDecryptResult): boolean {
  return token.payload.exp !== undefined && token.payload.exp - Math.floor(Date.now() / 1000) < 0;
}

export const config = {
  matcher: ['/:path'],
};
