"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";

export async function newsletterAction(_: unknown, formData: FormData) {
  const email = z.string().email().safeParse(String(formData.get("email") ?? ""));
  if (!email.success) return { error: "Please enter a valid email." };
  await prisma.newsletterSubscriber.upsert({
    where: { email: email.data.toLowerCase() },
    update: {},
    create: { email: email.data.toLowerCase() },
  });
  return { ok: true };
}

export async function toggleWishlist(productId: string) {
  const { readSession } = await import("@/lib/auth/session");
  const session = await readSession();
  if (!session) return { error: "Sign in to save a wishlist." };
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.id, productId } },
  });
  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return { on: false };
  }
  await prisma.wishlistItem.create({ data: { userId: session.id, productId } });
  return { on: true };
}
