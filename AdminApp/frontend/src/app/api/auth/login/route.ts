import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

// Constants for better maintainability
const CSRF_COOKIE_NAME = process.env.CSRF_COOKIE_NAME || "csrf_token";
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "access_token";
const REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || "refresh_token";
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;
const DEFAULT_EXPIRES_IN = 60 * 60; // 1 hour
const REMEMBER_ME_ACCESS_DURATION = 60 * 60 * 24 * 7; // 7 days
const REMEMBER_ME_REFRESH_DURATION = 60 * 60 * 24 * 30; // 30 days
const DEFAULT_REFRESH_DURATION = 60 * 60 * 24; // 1 day

// Common cookie options
const COMMON_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  domain: COOKIE_DOMAIN,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { message: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    // CSRF check (double submit cookie)
    const csrfHeader = (await headers()).get("x-csrf-token");
    const csrfCookie = (await cookies()).get(CSRF_COOKIE_NAME)?.value;

    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      return NextResponse.json(
        { message: "CSRF проверка не пройдена" },
        { status: 403 }
      );
    }

    const rememberMe = !!body.remember;

    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Consider adding CSRF header here if backend needs it
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorPayload.message ?? "Неверные учетные данные" },
        { status: response.status }
      );
    }

    const payload = await response.json();

    // Destructure with defaults for better safety
    const {
      accessToken,
      refreshToken,
      expiresIn = DEFAULT_EXPIRES_IN,
    } = payload;

    if (!accessToken) {
      throw new Error("Missing access token in response");
    }

    // Calculate cookie durations
    const accessTokenMaxAge = rememberMe
      ? REMEMBER_ME_ACCESS_DURATION
      : expiresIn;
    const refreshTokenMaxAge = rememberMe
      ? REMEMBER_ME_REFRESH_DURATION
      : DEFAULT_REFRESH_DURATION;

    // Create response and set cookies
    const nextResponse = NextResponse.json({ ok: true });

    nextResponse.cookies.set(JWT_COOKIE_NAME, accessToken, {
      ...COMMON_COOKIE_OPTIONS,
      maxAge: accessTokenMaxAge,
    });

    if (refreshToken) {
      nextResponse.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
        ...COMMON_COOKIE_OPTIONS,
        maxAge: refreshTokenMaxAge,
      });
    }

    // Rotate CSRF token on successful login as security best practice
    nextResponse.cookies.delete(CSRF_COOKIE_NAME);

    return nextResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Сервер авторизации недоступен",
      },
      { status: 502 }
    );
  }
}
