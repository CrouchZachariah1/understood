"use client";

import { useTransition } from "react";
import { addProductToClearanceAction, featureProductAction } from "@/app/actions/admin";
import Link from "next/link";

export function StockMoveActions({ productId }: { productId: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="mt-3 flex flex-wrap gap-2 sm:mt-0">
      <Link href="/admin/discounts" className="rounded-full bg-[#f6f3ee] px-3 py-2 text-xs">
        Create discount
      </Link>
      <Link href="/admin/bundles" className="rounded-full bg-[#f6f3ee] px-3 py-2 text-xs">
        Create bundle
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => addProductToClearanceAction(productId))}
        className="rounded-full bg-[#f6f3ee] px-3 py-2 text-xs"
      >
        Add to clearance
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => featureProductAction(productId))}
        className="rounded-full bg-black px-3 py-2 text-xs text-white"
      >
        Feature on homepage
      </button>
      <Link href="/admin/campaigns" className="rounded-full bg-[#f6f3ee] px-3 py-2 text-xs">
        Add to campaign
      </Link>
    </div>
  );
}
