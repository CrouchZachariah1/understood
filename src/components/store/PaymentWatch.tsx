"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function PaymentWatch({ orderNumber }: { orderNumber: string }) {
  const [status, setStatus] = useState("PENDING");
  useEffect(() => {
    let n = 0;
    const tick = async () => {
      const res = await fetch(`/api/orders/status?order=${encodeURIComponent(orderNumber)}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data.paymentStatus);
        if (data.paymentStatus === "PAID") return;
      }
      n += 1;
      if (n < 20) setTimeout(tick, 2500);
    };
    tick();
  }, [orderNumber]);

  return (
    <div className="mt-8">
      <p className="font-display text-2xl">{orderNumber}</p>
      <p className="mt-2 text-sm">{status === "PAID" ? "Payment confirmed." : "Waiting for verified payment…"}</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-[var(--season-fg)] px-6 py-3 text-white">
        Back home
      </Link>
    </div>
  );
}
