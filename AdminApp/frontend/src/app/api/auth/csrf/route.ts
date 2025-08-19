import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function randomToken(len: number) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

export async function GET() {
  const csrfName = process.env.CSRF_COOKIE_NAME || "csrf_token";
  const token = randomToken(24);
  const cookieStore = cookies();
  cookieStore.set(csrfName, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return NextResponse.json({ token });
}
