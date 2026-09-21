import { dashboardStats } from "@/lib/analytics";
import { formatZar } from "@/lib/money";

export default async function AnalyticsPage() {
  const stats = await dashboardStats();
  return (
    <div>
      <h1 className="font-display text-4xl">Analytics</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5">
          <p className="text-xs uppercase tracking-widest opacity-50">Revenue</p>
          <p className="font-display text-3xl">{formatZar(stats.revenue)}</p>
        </div>
        <div className="rounded-2xl bg-white p-5">
          <p className="text-xs uppercase tracking-widest opacity-50">Orders</p>
          <p className="font-display text-3xl">{stats.orders}</p>
        </div>
        <div className="rounded-2xl bg-white p-5">
          <p className="text-xs uppercase tracking-widest opacity-50">AOV</p>
          <p className="font-display text-3xl">{formatZar(stats.aov)}</p>
        </div>
      </div>
      <h2 className="mt-8 font-display text-2xl">Best sellers</h2>
      <ul className="mt-3 space-y-2">
        {stats.best.map((v) => (
          <li key={v.id} className="rounded-2xl bg-white p-3 text-sm">
            {v.product.name} · {v.colorName} · {v.size.name} — {v.unitsSold} sold
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-display text-2xl">Slow movers</h2>
      <ul className="mt-3 space-y-2">
        {stats.slow.map((v) => (
          <li key={v.id} className="rounded-2xl bg-white p-3 text-sm">
            {v.product.name} · {v.colorName} · {v.size.name} — {v.unitsSold} sold · {v.stock} left
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-display text-2xl">Popular sizes</h2>
      <p className="mt-2 text-sm">{stats.popularSizes.map(([n, c]) => `${n} (${c})`).join(" · ")}</p>
    </div>
  );
}
