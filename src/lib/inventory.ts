import "server-only";
import { prisma } from "@/lib/db";

export function availableStock(stock: number, reserved: number) {
  return Math.max(0, stock - reserved);
}

export async function reserveStock(orderId: string, items: { variantId: string; quantity: number }[]) {
  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const variant = await tx.variant.findUnique({ where: { id: item.variantId } });
      if (!variant) throw new Error("Variant missing");
      if (variant.stock - variant.reserved < item.quantity) {
        throw new Error(`Not enough stock for ${variant.sku}`);
      }
      await tx.variant.update({
        where: { id: item.variantId },
        data: { reserved: { increment: item.quantity } },
      });
      await tx.stockMovement.create({
        data: {
          variantId: item.variantId,
          delta: -item.quantity,
          reason: "reserve",
          orderId,
        },
      });
    }
  });
}

export async function releaseReservation(orderId: string) {
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      await tx.variant.update({
        where: { id: item.variantId },
        data: { reserved: { decrement: item.quantity } },
      });
      await tx.stockMovement.create({
        data: {
          variantId: item.variantId,
          delta: item.quantity,
          reason: "release",
          orderId,
        },
      });
    }
  });
}

export async function captureReservation(orderId: string) {
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      await tx.variant.update({
        where: { id: item.variantId },
        data: {
          reserved: { decrement: item.quantity },
          stock: { decrement: item.quantity },
          unitsSold: { increment: item.quantity },
          lastSoldAt: new Date(),
        },
      });
      await tx.stockMovement.create({
        data: {
          variantId: item.variantId,
          delta: -item.quantity,
          reason: "sale",
          orderId,
        },
      });
    }
  });
}

export async function restoreSoldStock(orderId: string) {
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      await tx.variant.update({
        where: { id: item.variantId },
        data: {
          stock: { increment: item.quantity },
          unitsSold: { decrement: item.quantity },
        },
      });
      await tx.stockMovement.create({
        data: {
          variantId: item.variantId,
          delta: item.quantity,
          reason: "refund",
          orderId,
        },
      });
    }
  });
}
