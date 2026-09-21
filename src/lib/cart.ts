import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { clampCents } from "@/lib/money";
import { CART_COOKIE } from "@/lib/auth/constants";

export { CART_COOKIE };

const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: { include: { images: { orderBy: { sortOrder: "asc" as const } } } },
          size: true,
        },
      },
    },
  },
};

export async function readCartId(): Promise<string | null> {
  const jar = await cookies();
  const existing = jar.get(CART_COOKIE)?.value;
  if (!existing) return null;
  const found = await prisma.cart.findUnique({ where: { id: existing } });
  return found?.id ?? null;
}

export async function ensureCartId(): Promise<string> {
  const existing = await readCartId();
  if (existing) return existing;
  const cart = await prisma.cart.create({ data: {} });
  const jar = await cookies();
  jar.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return cart.id;
}

export async function getCart() {
  const id = await readCartId();
  if (!id) {
    return { id: "", userId: null, createdAt: new Date(), updatedAt: new Date(), items: [] };
  }
  return prisma.cart.findUniqueOrThrow({
    where: { id },
    include: cartInclude,
  });
}

export async function addToCart(variantId: string, quantity: number) {
  const qty = Math.max(1, Math.min(20, Math.round(quantity)));
  const variant = await prisma.variant.findUnique({ where: { id: variantId } });
  if (!variant) throw new Error("Variant not found");
  const available = variant.stock - variant.reserved;
  if (available < qty) throw new Error("Not enough stock");
  const cartId = await ensureCartId();
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId, variantId } },
  });
  const nextQty = (existing?.quantity ?? 0) + qty;
  if (nextQty > available) throw new Error("Not enough stock");
  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId, variantId } },
    create: { cartId, variantId, quantity: qty },
    update: { quantity: nextQty },
  });
  await prisma.cart.update({ where: { id: cartId }, data: { updatedAt: new Date() } });
}

export async function updateCartItem(itemId: string, quantity: number) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { variant: true },
  });
  if (!item) return;
  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return;
  }
  const available = item.variant.stock - item.variant.reserved;
  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: Math.min(quantity, Math.max(1, available)) },
  });
}

export async function removeCartItem(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } }).catch(() => undefined);
}

export async function clearCart(cartId: string) {
  if (!cartId) return;
  await prisma.cartItem.deleteMany({ where: { cartId } });
}

export function linePrice(priceCents: number, qty: number) {
  return clampCents(priceCents * qty);
}
