import type { CreateCheckoutInput, PaymentProvider, VerifiedPayment } from "@/lib/payments/types";
import { getConfig } from "@/lib/env";

/** EFT / mark-as-paid. Orders stay PENDING until an admin or a verified webhook confirms. */
export const manualProvider: PaymentProvider = {
  id: "manual",
  async createCheckout(input: CreateCheckoutInput) {
    const base = getConfig().appUrl;
    return {
      redirectUrl: `${base}/checkout/pending?order=${encodeURIComponent(input.orderNumber)}`,
      providerRef: `manual_${input.orderId}`,
    };
  },
  async parseWebhook(): Promise<VerifiedPayment> {
    throw new Error("Manual payments are confirmed in admin, not via public webhook");
  },
};
