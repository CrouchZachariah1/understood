import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatZar } from "@/lib/money";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 80,
    include: { items: true },
  });
  return (
    <div>
      <h1 className="font-display text-4xl">Orders</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-widest opacity-50">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-semibold underline">
                    {o.number}
                  </Link>
                  <p className="text-xs opacity-50">{o.createdAt.toLocaleString("en-ZA")}</p>
                </td>
                <td className="p-3">
                  {o.firstName} {o.lastName}
                  <p className="text-xs opacity-50">{o.phone}</p>
                </td>
                <td className="p-3">{o.status.replaceAll("_", " ")}</td>
                <td className="p-3">{o.paymentStatus}</td>
                <td className="p-3">{formatZar(o.totalCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
