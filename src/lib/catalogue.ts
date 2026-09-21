import "server-only";
import { prisma } from "@/lib/db";
import type { AgeGroup, Prisma } from "@prisma/client";

export const AGE_PATHS = ["toddler", "kids", "youth"] as const;
export type AgePath = (typeof AGE_PATHS)[number];

export function ageFromPath(path: string): AgeGroup | null {
  if (path === "toddler") return "TODDLER";
  if (path === "kids") return "KIDS";
  if (path === "youth") return "YOUTH";
  return null;
}

export async function getFeaturedProducts(take = 8) {
  return prisma.product.findMany({
    where: { status: "ACTIVE", featured: true },
    include: productInclude,
    take,
    orderBy: { listedAt: "desc" },
  });
}

export const productInclude = {
  brand: true,
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: { include: { size: true } },
  collections: { include: { collection: true } },
} satisfies Prisma.ProductInclude;

export type ProductCard = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export function productPriceRange(product: ProductCard) {
  const prices = product.variants.map((v) => v.priceCents);
  const compares = product.variants.map((v) => v.compareAtCents).filter((n): n is number => n != null);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    compare: compares.length ? Math.min(...compares) : null,
  };
}

export function productAvailable(product: ProductCard) {
  return product.variants.some((v) => v.stock - v.reserved > 0);
}

export async function searchProducts(input: {
  q?: string;
  age?: AgeGroup;
  size?: string;
  color?: string;
  collection?: string;
  brand?: string;
  pattern?: string;
  sale?: boolean;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  take?: number;
}) {
  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
    AND: [
      input.q
        ? {
            OR: [
              { name: { contains: input.q } },
              { description: { contains: input.q } },
              { brand: { name: { contains: input.q } } },
            ],
          }
        : {},
      input.age ? { ageGroup: { in: [input.age, "ALL"] } } : {},
      input.collection ? { collections: { some: { collection: { slug: input.collection } } } } : {},
      input.brand ? { brand: { slug: input.brand } } : {},
      input.pattern ? { pattern: input.pattern as never } : {},
      input.size ? { variants: { some: { size: { name: input.size } } } } : {},
      input.color ? { variants: { some: { colorName: input.color } } } : {},
      input.sale ? { variants: { some: { compareAtCents: { not: null } } } } : {},
    ],
  };

  const products = await prisma.product.findMany({
    where,
    include: productInclude,
    take: input.take ?? 48,
  });

  let list = products;
  if (input.available) list = list.filter(productAvailable);
  if (input.minPrice) list = list.filter((p) => productPriceRange(p).min >= input.minPrice!);
  if (input.maxPrice) list = list.filter((p) => productPriceRange(p).min <= input.maxPrice!);

  switch (input.sort) {
    case "price-asc":
      list.sort((a, b) => productPriceRange(a).min - productPriceRange(b).min);
      break;
    case "price-desc":
      list.sort((a, b) => productPriceRange(b).min - productPriceRange(a).min);
      break;
    case "discount":
      list.sort((a, b) => {
        const da = (productPriceRange(a).compare ?? productPriceRange(a).min) - productPriceRange(a).min;
        const db = (productPriceRange(b).compare ?? productPriceRange(b).min) - productPriceRange(b).min;
        return db - da;
      });
      break;
    case "newest":
      list.sort((a, b) => b.listedAt.getTime() - a.listedAt.getTime());
      break;
    default:
      list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return list;
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      ...productInclude,
      reviews: { where: { published: true }, orderBy: { createdAt: "desc" }, take: 8 },
    },
  });
}
