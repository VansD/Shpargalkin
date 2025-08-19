import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  const names = [
    process.env.JWT_COOKIE_NAME || "access_token",
    process.env.REFRESH_COOKIE_NAME || "refresh_token",
    process.env.CSRF_COOKIE_NAME || "csrf_token",
  ];
  const domain = process.env.COOKIE_DOMAIN || undefined;
  for (const n of names) {
    cookieStore.set(n, "", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      domain,
      maxAge: 0,
    });
  }
  return NextResponse.json({ ok: true });
}
