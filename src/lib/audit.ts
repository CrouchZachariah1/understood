import "server-only";
import { prisma } from "@/lib/db";

export async function writeAudit(input: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string;
  meta?: unknown;
}) {
  await prisma.auditLog.create({
    data: {
      userId: input.userId ?? null,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      meta: input.meta ? JSON.stringify(input.meta) : null,
    },
  });
}
