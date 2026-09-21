import "server-only";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { getConfig } from "@/lib/env";
import { formatZar } from "@/lib/money";

export type EmailKind = "paid" | "shipped" | "delivered" | "confirmation";

function wrap(title: string, body: string) {
  return `<!doctype html>
<html><body style="margin:0;background:#fff8ee;font-family:Georgia,serif;color:#072448">
  <div style="max-width:560px;margin:24px auto;background:#fff;border:1px solid #f3e4c8;padding:32px">
    <p style="letter-spacing:.28em;font-size:12px;margin:0 0 16px">UNDERSTOOD.</p>
    <h1 style="font-size:28px;margin:0 0 16px">${title}</h1>
    ${body}
    <p style="margin-top:32px;font-size:13px;color:#5b6478">Comfort. Understood.</p>
  </div>
</body></html>`;
}

export async function sendOrderEmails(orderId: string, kind: EmailKind) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return;
  const config = getConfig();
  const lines = order.items
    .map(
      (item) =>
        `<tr><td>${item.productName} · ${item.colorName} · ${item.sizeName} × ${item.quantity}</td><td style="text-align:right">${formatZar(item.lineCents)}</td></tr>`,
    )
    .join("");
  const table = `<table style="width:100%;border-collapse:collapse">${lines}<tr><td><strong>Total</strong></td><td style="text-align:right"><strong>${formatZar(order.totalCents)}</strong></td></tr></table>`;
  const address = `${order.firstName} ${order.lastName}<br/>${order.addressLine1}<br/>${order.suburb}, ${order.city}<br/>${order.province} ${order.postalCode}<br/>${order.phone}`;

  const customer =
    kind === "paid"
      ? { subject: `Payment confirmed · ${order.number}`, title: "Payment confirmed", extra: `<p>We’ve received your payment. Your order is on its way into packing.</p>${table}` }
      : kind === "shipped"
        ? { subject: `Shipped · ${order.number}`, title: "On its way", extra: `<p>Your order has been shipped.</p>${table}` }
        : kind === "delivered"
          ? { subject: `Delivered · ${order.number}`, title: "Delivered", extra: `<p>Your order has been delivered. We hope it feels just right.</p>` }
          : { subject: `Order received · ${order.number}`, title: "We have your order", extra: `<p>Thanks for shopping with UNDERSTOOD. We’ll confirm payment next.</p>${table}` };

  const ownerHtml = wrap(
    `New paid order ${order.number}`,
    `<p>${address}</p><p>${order.email}</p>${table}`,
  );
  const customerHtml = wrap(customer.title, customer.extra);

  await deliver(order.email, customer.subject, customerHtml, order.id, kind);
  if (kind === "paid") {
    await deliver(config.ownerEmail, `Paid order ${order.number}`, ownerHtml, order.id, "owner");
  }
}

async function deliver(to: string, subject: string, html: string, orderId: string, template: string) {
  const config = getConfig();
  try {
    if (config.resendApiKey) {
      const resend = new Resend(config.resendApiKey);
      await resend.emails.send({ from: config.emailFrom, to, subject, html });
      await prisma.emailLog.create({ data: { to, subject, template, orderId, status: "sent" } });
    } else {
      await prisma.emailLog.create({ data: { to, subject, template, orderId, status: "logged" } });
      console.info(`[email:${template}] ${to} · ${subject}`);
    }
  } catch (error) {
    await prisma.emailLog.create({
      data: {
        to,
        subject,
        template,
        orderId,
        status: "error",
        error: error instanceof Error ? error.message : "email failed",
      },
    });
  }
}
