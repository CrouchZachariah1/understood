import { getStockToMove } from "@/lib/stock-to-move";
import { StockMoveActions } from "@/components/admin/StockMoveActions";

export default async function StockToMovePage() {
  const rows = await getStockToMove(30);
  return (
    <div>
      <h1 className="font-display text-4xl">Stock to move</h1>
      <p className="mt-2 max-w-xl text-sm opacity-70">
        Sitting too long. Recommendations only — nothing is discounted until you approve.
      </p>
      <div className="mt-6 space-y-3">
        {rows.map(({ variant, daysWithoutSale, recommended }) => (
          <div key={variant.id} className="rounded-2xl bg-white p-4 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">
                {variant.product.name} · {variant.colorName} · {variant.size.name}
              </p>
              <p className="text-sm opacity-60">
                {variant.stock} on hand · {daysWithoutSale} days without a sale · {variant.unitsSold} sold
              </p>
              <p className="mt-1 text-sm text-[var(--season-primary)]">{recommended}</p>
            </div>
            <StockMoveActions productId={variant.productId} />
          </div>
        ))}
        {rows.length === 0 ? <p>Nothing flagged right now.</p> : null}
      </div>
    </div>
  );
}
