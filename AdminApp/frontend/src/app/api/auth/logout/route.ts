// frontend/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  // Названия cookie берем из env или ставим дефолтные
  const accessCookie = process.env.JWT_COOKIE_NAME || "access_token";
  const refreshCookie = process.env.REFRESH_COOKIE_NAME || "refresh_token";

  response.cookies.delete(accessCookie);
  response.cookies.delete(refreshCookie);

  return response;
}
