import type { Discount, Bundle } from "@prisma/client";
import { clampCents } from "@/lib/money";

export type PricedLine = {
  variantId: string;
  productId: string;
  productName: string;
  colorName: string;
  sizeName: string;
  sku: string;
  quantity: number;
  unitCents: number;
  compareAtCents: number | null;
  collectionIds: string[];
  categoryId: string;
  image?: string;
};

export type PricingResult = {
  subtotalCents: number;
  discountCents: number;
  deliveryCents: number;
  totalCents: number;
  savingsCents: number;
  appliedDiscount?: { id: string; name: string; code?: string | null };
  appliedBundle?: { id: string; name: string };
  freeDelivery: boolean;
  remainingForFreeDelivery: number;
};

export function bestBundle(lines: PricedLine[], bundles: Bundle[]): { bundle: Bundle; discount: number } | null {
  const productIds = new Set(lines.map((l) => l.productId));
  let winner: { bundle: Bundle; discount: number } | null = null;
  for (const bundle of bundles) {
    const eligibleQty = lines
      .filter((l) => productIds.has(l.productId))
      .reduce((sum, l) => sum + l.quantity, 0);
    if (eligibleQty < bundle.pickCount) continue;
    const sorted = [...lines]
      .filter((l) => productIds.has(l.productId))
      .flatMap((l) => Array.from({ length: l.quantity }, () => l.unitCents))
      .sort((a, b) => b - a);
    const picked = sorted.slice(0, bundle.pickCount);
    const pickedSum = picked.reduce((s, n) => s + n, 0);
    const discount = Math.max(0, pickedSum - bundle.priceCents);
    if (!winner || discount > winner.discount) winner = { bundle, discount };
  }
  return winner;
}

export function applyDiscount(
  subtotalCents: number,
  lines: PricedLine[],
  discount: Discount | null,
  isFirstOrder: boolean,
): number {
  if (!discount || !discount.active) return 0;
  if (discount.firstOrderOnly && !isFirstOrder) return 0;
  if (discount.minSpendCents && subtotalCents < discount.minSpendCents) return 0;
  if (discount.type === "PERCENT" && discount.percentOff) {
    return clampCents(Math.round((subtotalCents * discount.percentOff) / 100));
  }
  if (discount.type === "FIXED" && discount.amountCents) {
    return Math.min(subtotalCents, discount.amountCents);
  }
  if (discount.type === "BUY_X_GET_Y" && discount.buyQuantity && discount.getQuantity) {
    const units = lines.flatMap((l) => Array.from({ length: l.quantity }, () => l.unitCents)).sort((a, b) => a - b);
    const group = discount.buyQuantity + discount.getQuantity;
    const freeCount = Math.floor(units.length / group) * discount.getQuantity;
    return units.slice(0, freeCount).reduce((s, n) => s + n, 0);
  }
  return 0;
}

export function quoteCart(input: {
  lines: PricedLine[];
  discount: Discount | null;
  bundles: Bundle[];
  isFirstOrder: boolean;
  freeDeliveryCents: number;
  flatDeliveryCents: number;
}): PricingResult {
  const subtotalCents = input.lines.reduce((s, l) => s + l.unitCents * l.quantity, 0);
  const compareSavings = input.lines.reduce((s, l) => {
    if (!l.compareAtCents || l.compareAtCents <= l.unitCents) return s;
    return s + (l.compareAtCents - l.unitCents) * l.quantity;
  }, 0);

  const bundle = bestBundle(input.lines, input.bundles);
  const promoOff = applyDiscount(subtotalCents, input.lines, input.discount, input.isFirstOrder);
  const bundleOff = bundle?.discount ?? 0;
  const discountCents = Math.max(promoOff, bundleOff);
  const afterDiscount = Math.max(0, subtotalCents - discountCents);
  const freeDelivery =
    !!input.discount?.freeDelivery ||
    input.discount?.type === "FREE_DELIVERY" ||
    afterDiscount >= input.freeDeliveryCents;
  const deliveryCents = freeDelivery ? 0 : input.flatDeliveryCents;
  const remainingForFreeDelivery = freeDelivery ? 0 : Math.max(0, input.freeDeliveryCents - afterDiscount);

  return {
    subtotalCents,
    discountCents,
    deliveryCents,
    totalCents: afterDiscount + deliveryCents,
    savingsCents: compareSavings + discountCents + (freeDelivery ? input.flatDeliveryCents : 0),
    appliedDiscount:
      promoOff >= bundleOff && input.discount
        ? { id: input.discount.id, name: input.discount.name, code: input.discount.code }
        : undefined,
    appliedBundle: bundleOff > promoOff && bundle ? { id: bundle.bundle.id, name: bundle.bundle.name } : undefined,
    freeDelivery,
    remainingForFreeDelivery,
  };
}
