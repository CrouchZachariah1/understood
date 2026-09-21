import { Suspense } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { FilterBar } from "@/components/store/FilterBar";
import { searchProducts } from "@/lib/catalogue";
import { prisma } from "@/lib/db";
import type { AgeGroup } from "@prisma/client";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const products = await searchProducts({
    q: get("q"),
    age: get("age") as AgeGroup | undefined,
    size: get("size"),
    color: get("color"),
    collection: get("collection"),
    brand: get("brand"),
    pattern: get("pattern"),
    sale: get("sale") === "1",
    available: get("available") === "1",
    sort: get("sort"),
  });
  const [sizes, brands, collections] = await Promise.all([
    prisma.sizeDefinition.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.brand.findMany(),
    prisma.collection.findMany(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-4xl sm:text-5xl">Shop</h1>
      <p className="mt-2 opacity-70">Everyday colour, sized for growing.</p>
      <Suspense>
        <FilterBar sizes={sizes} brands={brands} collections={collections} />
      </Suspense>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 ? <p className="mt-10 text-center opacity-60">Nothing matches those filters yet.</p> : null}
    </div>
  );
}
