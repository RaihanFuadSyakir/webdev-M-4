
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { base64url, jwtDecrypt} from 'jose';
export async function middleware(request: NextRequest) {
  console.log("middleware run");
  const secret = base64url.decode(process.env.PRIVATE_CODE!);
  let res;
  if (request.cookies.has("token")) {
    const token = request.cookies.get("token");
    try {
      await jwtDecrypt(token!.value, secret);
      // No error occurred during decryption, so the token is valid
      if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
        console.log("Token valid");
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // Handle token decryption error, e.g., invalid or expired token
      console.error("Error decrypting JWT:", error);
      console.log("Token deleted due to decryption error");
      res =  NextResponse.redirect(new URL('/login',request.url));
      res.cookies.delete("username");
      res.cookies.delete("token");
    }
  } else {
    if (!request.nextUrl.pathname.startsWith('/login')) {
      // Redirect to login if not already on the login page and there's no token
      return NextResponse.redirect(new URL('/login',request.url));
    }
  }
  return res;
}


export const config = {
  matcher: ['/:path'],
};
