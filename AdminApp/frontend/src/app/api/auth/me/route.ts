// frontend/app/api/auth/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const accessToken = (await cookies()).get(
    process.env.JWT_COOKIE_NAME || "access_token"
  )?.value;

  if (!accessToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // ⚡ здесь можно сходить на backend и получить инфу о пользователе
  // const res = await fetch(`${process.env.BACKEND_URL}/auth/me`, { headers: { Authorization: `Bearer ${accessToken}` } });

  // Для прототипа вернем просто фейковые данные
  return NextResponse.json({
    authenticated: true,
    user: {
      id: 1,
      email: "admin@example.com",
      role: "admin",
    },
  });
}
