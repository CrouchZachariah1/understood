import "server-only";
import { prisma } from "@/lib/db";

export async function getStockToMove(minDays = 30) {
  const cutoff = new Date(Date.now() - minDays * 24 * 60 * 60 * 1000);
  const variants = await prisma.variant.findMany({
    where: {
      stock: { gt: 0 },
      product: { status: "ACTIVE" },
      OR: [{ lastSoldAt: null }, { lastSoldAt: { lt: cutoff } }],
    },
    include: {
      product: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } },
      size: true,
    },
    orderBy: [{ lastSoldAt: "asc" }, { stock: "desc" }],
  });

  return variants.map((variant) => {
    const last = variant.lastSoldAt ?? variant.product.listedAt;
    const days = Math.floor((Date.now() - last.getTime()) / 86400000);
    const action =
      variant.stock >= 20 && days >= 60
        ? "Create a bundle"
        : variant.unitsSold === 0
          ? "Add to clearance"
          : days >= 45
            ? "Create a discount"
            : "Feature on homepage";
    return {
      variant,
      daysWithoutSale: days,
      recommended: action,
    };
  });
}
