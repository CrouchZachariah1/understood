import { Webhook } from "standardwebhooks";
import { getConfig } from "@/lib/env";
import type { CreateCheckoutInput, PaymentProvider, VerifiedPayment } from "@/lib/payments/types";

export const yocoProvider: PaymentProvider = {
  id: "yoco",
  async createCheckout(input: CreateCheckoutInput) {
    const config = getConfig();
    if (!config.yocoSecretKey) {
      throw new Error("YOCO_SECRET_KEY is not configured");
    }
    const response = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.yocoSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: input.amountCents,
        currency: "ZAR",
        externalId: input.orderNumber,
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
        failureUrl: input.failureUrl,
        metadata: { orderId: input.orderId, email: input.email },
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Yoco checkout failed: ${response.status} ${text}`);
    }
    const data = (await response.json()) as { id: string; redirectUrl: string };
    return { redirectUrl: data.redirectUrl, providerRef: data.id };
  },
  async parseWebhook(request: Request, rawBody: string): Promise<VerifiedPayment> {
    const config = getConfig();
    if (!config.yocoWebhookSecret) {
      throw new Error("YOCO_WEBHOOK_SECRET is not configured");
    }
    const webhook = new Webhook(config.yocoWebhookSecret);
    const headers = {
      "webhook-id": request.headers.get("webhook-id") ?? "",
      "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": request.headers.get("webhook-signature") ?? "",
    };
    const payload = webhook.verify(rawBody, headers) as {
      type?: string;
      id?: string;
      payload?: {
        amount?: number;
        metadata?: { orderId?: string };
        externalId?: string;
        id?: string;
      };
    };
    const type = payload.type ?? "";
    const status = type.includes("succeeded") || type.includes("success") ? "paid" : type.includes("cancel") ? "cancelled" : "failed";
    return {
      provider: "yoco",
      providerRef: payload.payload?.id ?? payload.id ?? "",
      webhookId: headers["webhook-id"] || payload.id || crypto.randomUUID(),
      amountCents: payload.payload?.amount ?? 0,
      orderNumber: payload.payload?.externalId,
      orderId: payload.payload?.metadata?.orderId,
      status,
    };
  },
};
