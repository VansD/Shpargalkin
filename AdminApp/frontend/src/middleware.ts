// frontend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Разрешаем доступ без авторизации только на /login и /api/auth/*
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Проверяем наличие access_token
  const token = "access_token_test"; //TODO: вернуть req.cookies.get("access_token");

  if (!token) {
    // Редирект на страницу логина
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Указываем, где срабатывает middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // всё кроме статики
  ],
};
