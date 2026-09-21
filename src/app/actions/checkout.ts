"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isSaProvince } from "@/lib/provinces";
import { getCart, clearCart } from "@/lib/cart";
import { quoteCart, type PricedLine } from "@/lib/pricing";
import { getSettings } from "@/lib/settings";
import { allocateOrderNumber, reserveStock } from "@/lib/orders";
import { getPaymentProvider } from "@/lib/payments";
import { getConfig } from "@/lib/env";
import { readSession } from "@/lib/auth/session";
import { sendOrderEmails } from "@/lib/email";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(9),
  line1: z.string().min(3),
  line2: z.string().optional(),
  suburb: z.string().min(2),
  city: z.string().min(2),
  province: z.string().refine(isSaProvince, "Choose a South African province"),
  postalCode: z.string().min(4).max(6),
  notes: z.string().optional(),
  coupon: z.string().optional(),
});

export async function checkoutAction(_: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    suburb: formData.get("suburb"),
    city: formData.get("city"),
    province: formData.get("province"),
    postalCode: formData.get("postalCode"),
    notes: formData.get("notes") || undefined,
    coupon: formData.get("coupon") || undefined,
  });
  if (!parsed.success) return { error: "Please complete your delivery details." };

  const cart = await getCart();
  if (!cart.items.length) return { error: "Your cart is empty." };

  const lines: PricedLine[] = cart.items.map((item) => ({
    variantId: item.variantId,
    productId: item.variant.productId,
    productName: item.variant.product.name,
    colorName: item.variant.colorName,
    sizeName: item.variant.size.name,
    sku: item.variant.sku,
    quantity: item.quantity,
    unitCents: item.variant.priceCents,
    compareAtCents: item.variant.compareAtCents,
    collectionIds: [],
    categoryId: item.variant.product.categoryId,
    image: item.variant.product.images[0]?.url,
  }));

  const session = await readSession();
  const prior = session
    ? await prisma.order.count({ where: { userId: session.id, paymentStatus: "PAID" } })
    : 0;
  const settings = await getSettings();
  const now = new Date();
  const discount = parsed.data.coupon
    ? await prisma.discount.findFirst({
        where: { code: parsed.data.coupon.toUpperCase(), active: true },
      })
    : await prisma.discount.findFirst({
        where: { automatic: true, active: true },
      });
  const bundles = await prisma.bundle.findMany({
    where: { active: true, products: { some: { productId: { in: lines.map((l) => l.productId) } } } },
  });
  const quote = quoteCart({
    lines,
    discount,
    bundles,
    isFirstOrder: prior === 0,
    freeDeliveryCents: settings.freeDeliveryCents,
    flatDeliveryCents: settings.flatDeliveryCents,
  });

  const number = await allocateOrderNumber();
  const order = await prisma.order.create({
    data: {
      number,
      userId: session?.id,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      addressLine1: parsed.data.line1,
      addressLine2: parsed.data.line2,
      suburb: parsed.data.suburb,
      city: parsed.data.city,
      province: parsed.data.province,
      postalCode: parsed.data.postalCode,
      deliveryNotes: parsed.data.notes,
      subtotalCents: quote.subtotalCents,
      discountCents: quote.discountCents,
      deliveryCents: quote.deliveryCents,
      totalCents: quote.totalCents,
      couponCode: quote.appliedDiscount?.code,
      discountId: quote.appliedDiscount?.id,
      bundleId: quote.appliedBundle?.id,
      reservedUntil: new Date(now.getTime() + 30 * 60 * 1000),
      items: {
        create: lines.map((line) => ({
          variantId: line.variantId,
          productName: line.productName,
          colorName: line.colorName,
          sizeName: line.sizeName,
          sku: line.sku,
          quantity: line.quantity,
          unitCents: line.unitCents,
          lineCents: line.unitCents * line.quantity,
        })),
      },
      events: { create: { status: "PENDING_PAYMENT", note: "Order placed", actor: "customer" } },
    },
  });

  try {
    await reserveStock(
      order.id,
      lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
    );
  } catch {
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    return { error: "Some items just sold out. Please review your cart." };
  }

  if (discount?.code) {
    await prisma.discount.update({
      where: { id: discount.id },
      data: { usageCount: { increment: 1 } },
    });
  }

  await sendOrderEmails(order.id, "confirmation");
  await clearCart(cart.id);

  const config = getConfig();
  const provider = getPaymentProvider();
  const checkout = await provider.createCheckout({
    orderId: order.id,
    orderNumber: order.number,
    amountCents: order.totalCents,
    email: order.email,
    successUrl: `${config.appUrl}/checkout/success?order=${order.number}`,
    cancelUrl: `${config.appUrl}/checkout/pending?order=${order.number}`,
    failureUrl: `${config.appUrl}/checkout/pending?order=${order.number}`,
  });
  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: provider.id,
      providerRef: checkout.providerRef,
      amountCents: order.totalCents,
      status: "PENDING",
    },
  });
  redirect(checkout.redirectUrl);
}
