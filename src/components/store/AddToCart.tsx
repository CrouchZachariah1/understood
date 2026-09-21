"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCartAction } from "@/app/actions/cart";
import { formatZar } from "@/lib/money";

type Variant = {
  id: string;
  colorName: string;
  colorHex: string;
  sizeName: string;
  stock: number;
  reserved: number;
  priceCents: number;
  compareAtCents: number | null;
};

export function AddToCart({
  variants,
  productName,
  whatsapp,
  productUrl,
}: {
  variants: Variant[];
  productName: string;
  whatsapp?: string;
  productUrl?: string;
}) {
  const router = useRouter();
  const colors = [...new Map(variants.map((v) => [v.colorName, v])).values()];
  const [color, setColor] = useState(colors[0]?.colorName ?? "");
  const sizes = variants.filter((v) => v.colorName === color);
  const [size, setSize] = useState(sizes[0]?.sizeName ?? "");
  const [qty, setQty] = useState(1);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => variants.find((v) => v.colorName === color && v.sizeName === size),
    [variants, color, size],
  );
  const available = selected ? selected.stock - selected.reserved : 0;
  const low = available > 0 && available <= 4;

  function add(thenBuy = false) {
    if (!selected) return;
    setError(null);
    start(async () => {
      try {
        await addToCartAction(selected.id, qty);
        if (thenBuy) router.push("/checkout");
        else router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not add to cart");
      }
    });
  }

  const wa = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
        `Hello!\nI'm interested in:\n${productName}\nSize: ${size}\nColour: ${color}\n${productUrl ?? ""}`,
      )}`
    : null;

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.2em]">Colour</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c.colorName}
              type="button"
              onClick={() => {
                setColor(c.colorName);
                const next = variants.find((v) => v.colorName === c.colorName);
                if (next) setSize(next.sizeName);
              }}
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${
                color === c.colorName ? "border-[var(--season-fg)]" : "border-transparent bg-white"
              }`}
            >
              <span className="h-4 w-4 rounded-full border" style={{ background: c.colorHex }} />
              {c.colorName}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.2em]">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const avail = s.stock - s.reserved;
            return (
              <button
                key={s.id}
                type="button"
                disabled={avail <= 0}
                onClick={() => setSize(s.sizeName)}
                className={`min-h-11 min-w-11 rounded-2xl px-3 text-sm font-semibold ${
                  size === s.sizeName ? "bg-[var(--season-fg)] text-white" : "bg-white"
                } disabled:opacity-30`}
              >
                {s.sizeName}
              </button>
            );
          })}
        </div>
        {low ? <p className="mt-2 text-sm text-[var(--season-primary)]">Only {available} left in Size {size}.</p> : null}
      </div>
      {selected ? (
        <p className="font-display text-3xl">
          {formatZar(selected.priceCents)}{" "}
          {selected.compareAtCents && selected.compareAtCents > selected.priceCents ? (
            <span className="text-lg text-[var(--season-fg)]/40 line-through">{formatZar(selected.compareAtCents)}</span>
          ) : null}
        </p>
      ) : null}
      <div className="flex items-center gap-3">
        <label className="sr-only" htmlFor="qty">
          Quantity
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          max={Math.max(1, available)}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="h-12 w-20 rounded-2xl bg-white px-3"
        />
        <button
          type="button"
          onClick={() => add(false)}
          disabled={!selected || available <= 0 || pending}
          className="h-12 flex-1 rounded-full bg-[var(--season-primary)] font-semibold text-white disabled:opacity-40"
        >
          Add to cart
        </button>
      </div>
      <button
        type="button"
        onClick={() => add(true)}
        disabled={!selected || available <= 0 || pending}
        className="h-12 w-full rounded-full bg-[var(--season-fg)] font-semibold text-white disabled:opacity-40"
      >
        Buy now
      </button>
      {wa ? (
        <a href={wa} className="block text-center text-sm underline" target="_blank" rel="noreferrer">
          Ask on WhatsApp
        </a>
      ) : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="sticky bottom-3 md:hidden">
        <button
          type="button"
          onClick={() => add(false)}
          disabled={!selected || available <= 0 || pending}
          className="h-14 w-full rounded-full bg-[var(--season-primary)] text-lg font-semibold text-white shadow-xl disabled:opacity-40"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
