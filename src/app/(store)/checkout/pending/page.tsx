import Link from "next/link";

export default async function PendingPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-4xl">Order received</h1>
      <p className="mt-3 opacity-75">
        {order ? `Order ${order} is waiting for payment confirmation.` : "Your order is waiting for payment."}
      </p>
      <p className="mt-4 text-sm opacity-70">
        For EFT / manual payments, the owner will confirm once funds reflect. Card payments update automatically after the provider webhook.
      </p>
      <Link href="/shop" className="mt-8 inline-flex rounded-full bg-[var(--season-fg)] px-6 py-3 text-white">
        Continue shopping
      </Link>
    </div>
  );
}
