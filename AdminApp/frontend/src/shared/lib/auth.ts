import { cookies } from "next/headers";
import * as jose from "jose";

export async function getAccessToken() {
  const name = process.env.JWT_COOKIE_NAME || "access_token";
  try {
    const cookieStore = cookies();
    return (await cookieStore).get(name)?.value ?? null;
  } catch {
    return null;
  }
}

export async function decodeJwt(token: string | null) {
  if (!token) return null;
  try {
    return jose.decodeJwt(token);
  } catch {
    return null;
  }
}
