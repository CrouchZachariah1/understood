"use client";

import { useTransition } from "react";
import { removeCartAction, updateCartAction } from "@/app/actions/cart";

export function CartControls({ id, quantity }: { id: string; quantity: number }) {
  const [pending, start] = useTransition();
  return (
    <div className="mt-2 flex items-center gap-2">
      <button
        type="button"
        className="h-9 w-9 rounded-full bg-[var(--season-muted)]"
        disabled={pending}
        onClick={() => start(() => updateCartAction(id, quantity - 1))}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-6 text-center text-sm">{quantity}</span>
      <button
        type="button"
        className="h-9 w-9 rounded-full bg-[var(--season-muted)]"
        disabled={pending}
        onClick={() => start(() => updateCartAction(id, quantity + 1))}
        aria-label="Increase quantity"
      >
        +
      </button>
      <button
        type="button"
        className="ml-2 text-xs underline"
        onClick={() => start(() => removeCartAction(id))}
      >
        Remove
      </button>
    </div>
  );
}
