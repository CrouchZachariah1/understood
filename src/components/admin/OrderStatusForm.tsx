"use client";

import { useTransition } from "react";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import { markOrderPaidAction, updateOrderStatusAction } from "@/app/actions/admin";

const STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "PACKED",
  "READY",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export function OrderStatusForm({
  id,
  status,
  paymentStatus,
}: {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}) {
  const [pending, start] = useTransition();
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          disabled={pending}
          onClick={() => start(() => updateOrderStatusAction(id, s))}
          className={`rounded-full px-3 py-2 text-xs ${s === status ? "bg-black text-white" : "bg-white"}`}
        >
          {s.replaceAll("_", " ")}
        </button>
      ))}
      {paymentStatus !== "PAID" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => start(() => markOrderPaidAction(id))}
          className="rounded-full bg-emerald-700 px-3 py-2 text-xs text-white"
        >
          Mark paid (verified)
        </button>
      ) : null}
    </div>
  );
}
