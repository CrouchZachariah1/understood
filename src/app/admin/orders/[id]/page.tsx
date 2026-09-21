import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatZar } from "@/lib/money";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payments: true, events: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) notFound();
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl">{order.number}</h1>
      <p className="mt-1 text-sm opacity-60">
        {order.status.replaceAll("_", " ")} · {order.paymentStatus}
      </p>
      <div className="mt-6 rounded-2xl bg-white p-5 text-sm">
        <p>
          {order.firstName} {order.lastName} · {order.email} · {order.phone}
        </p>
        <p className="mt-2">
          {order.addressLine1}, {order.suburb}, {order.city}, {order.province} {order.postalCode}
        </p>
        {order.deliveryNotes ? <p className="mt-2">Notes: {order.deliveryNotes}</p> : null}
      </div>
      <ul className="mt-4 rounded-2xl bg-white p-5 text-sm">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between border-b py-2 last:border-0">
            <span>
              {i.productName} · {i.colorName} · {i.sizeName} × {i.quantity}
            </span>
            <span>{formatZar(i.lineCents)}</span>
          </li>
        ))}
        <li className="flex justify-between pt-3 font-semibold">
          <span>Total</span>
          <span>{formatZar(order.totalCents)}</span>
        </li>
      </ul>
      <OrderStatusForm id={order.id} status={order.status} paymentStatus={order.paymentStatus} />
      <ol className="mt-6 space-y-2 text-xs opacity-70">
        {order.events.map((e) => (
          <li key={e.id}>
            {e.createdAt.toLocaleString("en-ZA")} · {e.status} {e.note ? `· ${e.note}` : ""}
          </li>
        ))}
      </ol>
    </div>
  );
}
