export type CreateCheckoutInput = {
  orderId: string;
  orderNumber: string;
  amountCents: number;
  email: string;
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
};

export type CreateCheckoutResult = {
  redirectUrl: string;
  providerRef: string;
};

export type VerifiedPayment = {
  provider: string;
  providerRef: string;
  webhookId: string;
  amountCents: number;
  orderNumber?: string;
  orderId?: string;
  status: "paid" | "failed" | "cancelled";
};

export interface PaymentProvider {
  id: "manual" | "yoco" | "stripe";
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;
  parseWebhook(request: Request, rawBody: string): Promise<VerifiedPayment>;
}
