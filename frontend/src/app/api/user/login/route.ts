import { NextResponse } from "next/server";
import { base64url, EncryptJWT } from "jose";
import { BACKEND_URL } from "@/constants";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL('/dashboard', request.url));
  try {
    const body = await request.json();
    const { identifier, password } = body;

    // Send login request to the backend
    const response = await fetch(`http://${BACKEND_URL}/api/user/find?identifier=${identifier}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const userData = await response.json();

      // Compare hashed password from the client with the hashed password from the server
      const hashedPasswordFromServer = userData.password;
      const passwordMatch = await bcrypt.compare(password, hashedPasswordFromServer);

      if (passwordMatch) {
        // Passwords match
        const { username } = userData;

        // Decrypt the JWT token using your secret
        const secret = base64url.decode(process.env.PRIVATE_CODE!);
        const newJWT = await newEncrypt(secret);

        // Set user and token cookies
        res.cookies.set("username", username);
        res.cookies.set("token", newJWT);
        return res;
      } else {
        // Passwords do not match
        console.log('Passwords do not match');
        return NextResponse.json({ status: "error" });
      }
    } else {
      // Handle invalid identifier or other errors
      console.error('Invalid identifier or other server error');
      return NextResponse.json({ status: "error" });
    }
  } catch (error) {
    console.error("An error occurred during login:", error);
    return NextResponse.json({ status: "error" });
  }
}


async function newEncrypt(secret: Uint8Array) {
  const jwt = await new EncryptJWT({ 'urn:example:claim': true })
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('1m')
    .encrypt(secret);
  return jwt;
}
