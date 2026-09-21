import { getConfig } from "@/lib/env";
import { manualProvider } from "@/lib/payments/manual";
import { yocoProvider } from "@/lib/payments/yoco";
import type { PaymentProvider } from "@/lib/payments/types";

export function getPaymentProvider(): PaymentProvider {
  const id = getConfig().paymentProvider;
  if (id === "yoco") return yocoProvider;
  return manualProvider;
}

export { type PaymentProvider } from "@/lib/payments/types";
