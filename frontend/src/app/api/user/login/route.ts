import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { base64url, EncryptJWT } from "jose";
export async function POST(request : Request){
    const body = await request.json()
    const {username,password} = body
    const secret = base64url.decode(process.env.PRIVATE_CODE!);
    const newJWT = await newEncrypt(secret);
    console.log(username,password);
    cookies().set('user','hehe');
    cookies().set('token',newJWT);
    return NextResponse.json({status : "success"});
}

async function newEncrypt(secret : Uint8Array){
    const jwt = await new EncryptJWT({ 'urn:example:claim': true })
  .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .encrypt(secret)
  return jwt;
}