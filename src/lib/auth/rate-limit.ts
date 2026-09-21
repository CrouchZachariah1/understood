import "server-only";
import { prisma } from "@/lib/db";

export async function hitRateLimit(key: string, limit: number, windowMs: number) {
  const now = new Date();
  const existing = await prisma.rateLimit.findUnique({ where: { key } });
  if (!existing || existing.resetAt < now) {
    await prisma.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, resetAt: new Date(now.getTime() + windowMs) },
      update: { count: 1, resetAt: new Date(now.getTime() + windowMs) },
    });
    return { ok: true, remaining: limit - 1 };
  }
  if (existing.count >= limit) {
    return { ok: false, remaining: 0, retryAt: existing.resetAt };
  }
  await prisma.rateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });
  return { ok: true, remaining: limit - existing.count - 1 };
}
