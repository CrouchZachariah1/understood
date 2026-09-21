import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { applyVerifiedPayment } from "@/lib/orders";

export async function POST(request: Request) {
  const raw = await request.text();
  try {
    const provider = getPaymentProvider();
    const event = await provider.parseWebhook(request, raw);
    if (event.status !== "paid") {
      return NextResponse.json({ ok: true, ignored: event.status });
    }
    await applyVerifiedPayment({
      orderId: event.orderId,
      orderNumber: event.orderNumber,
      amountCents: event.amountCents,
      provider: event.provider,
      providerRef: event.providerRef,
      webhookId: event.webhookId,
      rawPayload: raw,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "webhook failed" },
      { status: 400 },
    );
  }
}
