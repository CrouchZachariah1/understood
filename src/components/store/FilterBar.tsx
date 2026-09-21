"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Item = { slug?: string; name: string };

export function FilterBar({
  sizes,
  brands,
  collections,
}: {
  sizes: { name: string }[];
  brands: Item[];
  collections: Item[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`/shop?${next.toString()}`);
  }

  const selectClass = "min-h-11 rounded-full border border-[var(--season-fg)]/10 bg-white px-3 text-sm";

  return (
    <form className="mt-6 flex flex-wrap gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        defaultValue={params.get("q") ?? ""}
        placeholder="Search"
        className="min-h-11 min-w-40 flex-1 rounded-full border border-[var(--season-fg)]/10 bg-white px-4"
        onKeyDown={(e) => {
          if (e.key === "Enter") set("q", (e.target as HTMLInputElement).value);
        }}
        aria-label="Search products"
      />
      <select className={selectClass} defaultValue={params.get("age") ?? ""} onChange={(e) => set("age", e.target.value)} aria-label="Age">
        <option value="">Age</option>
        <option value="TODDLER">Toddler</option>
        <option value="KIDS">Kids</option>
        <option value="YOUTH">Youth</option>
      </select>
      <select className={selectClass} defaultValue={params.get("size") ?? ""} onChange={(e) => set("size", e.target.value)} aria-label="Size">
        <option value="">Size</option>
        {sizes.map((s) => (
          <option key={s.name}>{s.name}</option>
        ))}
      </select>
      <select className={selectClass} defaultValue={params.get("collection") ?? ""} onChange={(e) => set("collection", e.target.value)} aria-label="Collection">
        <option value="">Collection</option>
        {collections.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <select className={selectClass} defaultValue={params.get("brand") ?? ""} onChange={(e) => set("brand", e.target.value)} aria-label="Brand">
        <option value="">Brand</option>
        {brands.map((b) => (
          <option key={b.slug} value={b.slug}>
            {b.name}
          </option>
        ))}
      </select>
      <select className={selectClass} defaultValue={params.get("sort") ?? "popular"} onChange={(e) => set("sort", e.target.value)} aria-label="Sort">
        <option value="popular">Popular</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price low</option>
        <option value="price-desc">Price high</option>
        <option value="discount">Biggest discount</option>
      </select>
    </form>
  );
}
