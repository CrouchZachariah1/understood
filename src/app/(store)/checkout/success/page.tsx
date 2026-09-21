import { PaymentWatch } from "@/components/store/PaymentWatch";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-4xl">Thank you</h1>
      <p className="mt-3 opacity-75">
        We’re confirming payment on the server. This page never marks an order paid by itself.
      </p>
      {order ? <PaymentWatch orderNumber={order} /> : null}
    </div>
  );
}
