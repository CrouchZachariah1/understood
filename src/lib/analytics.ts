import "server-only";
import { prisma } from "@/lib/db";

export async function dashboardStats() {
  const since30 = new Date(Date.now() - 30 * 86400000);
  const paid = await prisma.order.findMany({
    where: { paymentStatus: "PAID" },
    include: { items: true },
  });
  const recent = paid.filter((o) => o.paidAt && o.paidAt >= since30);
  const revenue = paid.reduce((s, o) => s + o.totalCents, 0);
  const revenue30 = recent.reduce((s, o) => s + o.totalCents, 0);
  const units = paid.reduce((s, o) => s + o.items.reduce((n, i) => n + i.quantity, 0), 0);
  const aov = paid.length ? Math.round(revenue / paid.length) : 0;

  const variants = await prisma.variant.findMany({
    include: { product: true, size: true },
  });
  const lowStock = variants.filter((v) => v.stock > 0 && v.stock - v.reserved <= 4);
  const outOfStock = variants.filter((v) => v.stock - v.reserved <= 0);
  const best = [...variants].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 8);
  const slow = [...variants].filter((v) => v.stock > 0).sort((a, b) => a.unitsSold - b.unitsSold).slice(0, 8);

  const sizeSales = new Map<string, number>();
  for (const v of variants) {
    sizeSales.set(v.size.name, (sizeSales.get(v.size.name) ?? 0) + v.unitsSold);
  }
  const sizes = [...sizeSales.entries()].sort((a, b) => b[1] - a[1]);

  const customers = await prisma.user.count({ where: { role: "CUSTOMER" } });
  const products = await prisma.product.count();
  const unitsOnHand = variants.reduce((s, v) => s + v.stock, 0);
  const discounts = await prisma.discount.findMany();
  const bundles = await prisma.bundle.findMany();
  const campaigns = await prisma.campaign.findMany();

  const dayMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const o of paid) {
    if (!o.paidAt) continue;
    const key = o.paidAt.toISOString().slice(0, 10);
    if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) ?? 0) + o.totalCents);
  }

  return {
    revenue,
    revenue30,
    orders: paid.length,
    orders30: recent.length,
    units,
    aov,
    customers,
    products,
    unitsOnHand,
    lowStock: lowStock.length,
    outOfStock: outOfStock.length,
    best,
    slow,
    popularSizes: sizes.slice(0, 5),
    leastSizes: [...sizes].reverse().slice(0, 5),
    discounts,
    bundles,
    campaigns,
    daily: [...dayMap.entries()],
  };
}
