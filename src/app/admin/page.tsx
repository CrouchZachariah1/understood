import Link from "next/link";
import { dashboardStats } from "@/lib/analytics";
import { formatZar } from "@/lib/money";

export default async function AdminHome() {
  const stats = await dashboardStats();
  const cards = [
    ["Revenue", formatZar(stats.revenue)],
    ["Orders", String(stats.orders)],
    ["AOV", formatZar(stats.aov)],
    ["Units on hand", String(stats.unitsOnHand)],
    ["Low stock", String(stats.lowStock)],
    ["Out of stock", String(stats.outOfStock)],
  ];
  return (
    <div>
      <h1 className="font-display text-4xl">Dashboard</h1>
      <p className="mt-1 text-sm opacity-60">UNDERSTOOD. at a glance.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-5">
            <p className="text-xs uppercase tracking-widest opacity-50">{label}</p>
            <p className="mt-2 font-display text-3xl">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl bg-white p-5">
        <h2 className="font-display text-2xl">Last 14 days</h2>
        <div className="mt-4 flex h-32 items-end gap-1">
          {stats.daily.map(([day, cents]) => {
            const max = Math.max(...stats.daily.map((d) => d[1]), 1);
            return (
              <div key={day} className="flex-1 rounded-t bg-[var(--season-primary)]" style={{ height: `${(cents / max) * 100}%` }} title={`${day} ${formatZar(cents)}`} />
            );
          })}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/stock" className="rounded-full bg-[#1b1b1b] px-4 py-2 text-sm text-white">
          Stock to move
        </Link>
        <Link href="/admin/orders" className="rounded-full bg-white px-4 py-2 text-sm">
          Orders
        </Link>
        <Link href="/admin/themes" className="rounded-full bg-white px-4 py-2 text-sm">
          Themes
        </Link>
      </div>
    </div>
  );
}
