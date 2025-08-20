import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { message: "Email и пароль обязательны" },
      { status: 400 }
    );
  }

  // CSRF check (double submit cookie)
  const csrfHeader = (await headers()).get("x-csrf-token");
  const csrfCookieName = process.env.CSRF_COOKIE_NAME || "csrf_token";
  const csrfCookie = (await cookies()).get(csrfCookieName)?.value;
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return NextResponse.json(
      { message: "CSRF проверка не пройдена" },
      { status: 403 }
    );
  }

  const backend = process.env.BACKEND_URL || "http://localhost:5000/api";
  const remember = !!body.remember;

  try {
    const res = await fetch(`${backend}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      return NextResponse.json(
        { message: payload?.message ?? "Неверные учетные данные" },
        { status: res.status }
      );
    }

    const payload = await res.json();
    // Expecting: { accessToken, refreshToken, expiresIn }
    const accessToken = payload.accessToken;
    const refreshToken = payload.refreshToken;
    const expiresIn =
      typeof payload.expiresIn === "number" ? payload.expiresIn : 60 * 60;

    const domain = process.env.COOKIE_DOMAIN || undefined;
    const common = {
      httpOnly: true,
      sameSite: "strict" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      domain,
    };

    const maxAgeAccess = remember ? 60 * 60 * 24 * 7 : expiresIn; // 7 days if remember
    const maxAgeRefresh = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 1 day

    // ✅ теперь сетим куки через NextResponse
    const response = NextResponse.json({ ok: true });

    response.cookies.set(
      process.env.JWT_COOKIE_NAME || "access_token",
      accessToken,
      { ...common, maxAge: maxAgeAccess }
    );

    if (refreshToken) {
      response.cookies.set(
        process.env.REFRESH_COOKIE_NAME || "refresh_token",
        refreshToken,
        { ...common, maxAge: maxAgeRefresh }
      );
    }

    // Optional: rotate CSRF on login
    response.cookies.delete(csrfCookieName);

    return response;
  } catch (e) {
    return NextResponse.json(
      { message: "Сервер авторизации недоступен" },
      { status: 502 }
    );
  }
}
