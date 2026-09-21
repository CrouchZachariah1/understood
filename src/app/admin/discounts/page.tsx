import { prisma } from "@/lib/db";
import { formatZar } from "@/lib/money";
import { DiscountForm } from "@/components/admin/DiscountForm";

export default async function DiscountsPage() {
  const discounts = await prisma.discount.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-4xl">Discounts</h1>
      <DiscountForm />
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-widest opacity-50">
              <th className="p-3">Name</th>
              <th className="p-3">Code</th>
              <th className="p-3">Uses</th>
              <th className="p-3">Revenue</th>
              <th className="p-3">Savings</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-3">{d.name}</td>
                <td className="p-3">{d.code ?? "auto"}</td>
                <td className="p-3">{d.usageCount}</td>
                <td className="p-3">{formatZar(d.revenueCents)}</td>
                <td className="p-3">{formatZar(d.savingsCents)}</td>
                <td className="p-3">{d.active ? "Active" : "Paused"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
