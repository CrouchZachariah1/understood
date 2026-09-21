import "server-only";
import { prisma } from "@/lib/db";
import { captureReservation, releaseReservation, reserveStock, restoreSoldStock } from "@/lib/inventory";
import { sendOrderEmails } from "@/lib/email";
import type { OrderStatus } from "@prisma/client";

export function nextOrderNumber(seq: number) {
  const year = new Date().getFullYear();
  return `UND-${year}-${String(seq).padStart(5, "0")}`;
}

export async function allocateOrderNumber() {
  const count = await prisma.order.count();
  return nextOrderNumber(count + 1);
}

export async function applyVerifiedPayment(input: {
  orderId?: string;
  orderNumber?: string;
  amountCents: number;
  provider: string;
  providerRef: string;
  webhookId: string;
  rawPayload?: string;
}) {
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        input.orderId ? { id: input.orderId } : undefined,
        input.orderNumber ? { number: input.orderNumber } : undefined,
      ].filter(Boolean) as { id?: string; number?: string }[],
    },
    include: { items: true },
  });
  if (!order) throw new Error("Order not found for payment");
  if (order.paymentStatus === "PAID") return order;
  if (order.totalCents !== input.amountCents) {
    throw new Error("Payment amount does not match order total");
  }

  const existing = await prisma.payment.findUnique({ where: { webhookId: input.webhookId } });
  if (existing) return order;

  await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        orderId: order.id,
        provider: input.provider,
        providerRef: input.providerRef,
        webhookId: input.webhookId,
        amountCents: input.amountCents,
        status: "PAID",
        rawPayload: input.rawPayload ?? null,
      },
    });
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        paymentStatus: "PAID",
        paidAt: new Date(),
      },
    });
    await tx.orderEvent.create({
      data: { orderId: order.id, status: "PAID", note: "Payment verified server-side", actor: input.provider },
    });
  });

  await captureReservation(order.id);
  await sendOrderEmails(order.id, "paid");
  return prisma.order.findUniqueOrThrow({ where: { id: order.id } });
}

export async function cancelUnpaidOrder(orderId: string, reason: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.paymentStatus === "PAID") return;
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });
  await prisma.orderEvent.create({
    data: { orderId, status: "CANCELLED", note: reason, actor: "system" },
  });
  await releaseReservation(orderId);
}

export async function setOrderStatus(orderId: string, status: OrderStatus, actor?: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  if (status === "CANCELLED" && order.paymentStatus !== "PAID") {
    await cancelUnpaidOrder(orderId, "Cancelled by admin");
    return;
  }
  if (status === "REFUNDED" && order.paymentStatus === "PAID") {
    await restoreSoldStock(orderId);
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "REFUNDED", paymentStatus: "REFUNDED" },
    });
    await prisma.orderEvent.create({
      data: { orderId, status: "REFUNDED", actor: actor ?? "admin" },
    });
    return;
  }
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      shippedAt: status === "SHIPPED" ? new Date() : order.shippedAt,
      deliveredAt: status === "DELIVERED" ? new Date() : order.deliveredAt,
    },
  });
  await prisma.orderEvent.create({
    data: { orderId, status, actor: actor ?? "admin" },
  });
  if (status === "SHIPPED") await sendOrderEmails(orderId, "shipped");
  if (status === "DELIVERED") await sendOrderEmails(orderId, "delivered");
}

export { reserveStock };
