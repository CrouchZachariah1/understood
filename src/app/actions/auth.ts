"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie, clearSessionCookie, readSession } from "@/lib/auth/session";
import { hitRateLimit } from "@/lib/auth/rate-limit";
import { writeAudit } from "@/lib/audit";
import { isStaff } from "@/lib/auth/guards";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  next: z.string().optional(),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function loginAction(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });
  if (!parsed.success) return { error: "Please check your email and password." };
  const limit = await hitRateLimit(`login:${parsed.data.email.toLowerCase()}`, 8, 15 * 60 * 1000);
  if (!limit.ok) return { error: "Too many attempts. Try again in a few minutes." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !user.isActive) return { error: "Those details don’t match an account." };
  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return { error: "Those details don’t match an account." };

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  await setSessionCookie(token);
  await writeAudit({ userId: user.id, action: "login", entity: "user", entityId: user.id });
  const next = parsed.data.next || (isStaff(user.role) ? "/admin" : "/account");
  redirect(next.startsWith("/") ? next : "/account");
}

export async function registerAction(_: unknown, formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Please enter a name, valid email, and 8+ character password." };
  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (exists) return { error: "An account with that email already exists. Log in instead." };
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash: await hashPassword(parsed.data.password),
      role: "CUSTOMER",
    },
  });
  const token = await createSessionToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  await setSessionCookie(token);
  redirect("/account");
}

export async function logoutAction() {
  const session = await readSession();
  await clearSessionCookie();
  if (session) await writeAudit({ userId: session.id, action: "logout", entity: "user", entityId: session.id });
  redirect("/");
}
