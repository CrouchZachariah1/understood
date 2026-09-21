import "server-only";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { readSession, type SessionUser } from "@/lib/auth/session";

const STAFF_ROLES: UserRole[] = ["OWNER", "ADMIN", "STAFF"];

export async function requireSession(): Promise<SessionUser> {
  const session = await readSession();
  if (!session) redirect("/login?next=/account");
  return session;
}

export async function requireStaff(): Promise<SessionUser> {
  const session = await readSession();
  if (!session || !STAFF_ROLES.includes(session.role)) {
    redirect("/login?next=/admin");
  }
  return session;
}

export async function requireRole(roles: UserRole[]): Promise<SessionUser> {
  const session = await requireStaff();
  if (!roles.includes(session.role)) {
    redirect("/admin");
  }
  return session;
}

export function isStaff(role: UserRole | undefined): boolean {
  return !!role && STAFF_ROLES.includes(role);
}
