import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const refreshToken = (await cookies()).get(
    process.env.REFRESH_COOKIE_NAME!
  )?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const res = await fetch(`/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Invalid refresh" }, { status: 401 });
    }

    const data = await res.json();

    (await cookies()).set(process.env.JWT_COOKIE_NAME!, data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: data.expiresIn,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 });
  }
}
