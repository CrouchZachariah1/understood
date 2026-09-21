import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getConfig } from "@/lib/env";
import type { UserRole } from "@prisma/client";
import { SESSION_COOKIE } from "@/lib/auth/constants";

export { SESSION_COOKIE };
const MAX_AGE = 60 * 60 * 24 * 14;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

function secretKey(): Uint8Array {
  return new TextEncoder().encode(getConfig().authSecret);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
}

export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || !payload.email || !payload.role) return null;
    return {
      id: payload.sub,
      email: String(payload.email),
      name: String(payload.name ?? ""),
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: getConfig().appEnv === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
