"use client";

import { useTransition } from "react";
import { updateVariantStockAction } from "@/app/actions/admin";

export function StockEditor({ id, stock }: { id: string; stock: number }) {
  const [pending, start] = useTransition();
  return (
    <input
      type="number"
      min={0}
      defaultValue={stock}
      disabled={pending}
      className="h-9 w-20 rounded-lg border px-2"
      onBlur={(e) => {
        const next = Number(e.target.value);
        if (next !== stock) start(() => updateVariantStockAction(id, next));
      }}
      aria-label="Stock"
    />
  );
}
