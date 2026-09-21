import "server-only";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getConfig() {
  const appEnv = process.env.NODE_ENV === "production" ? "production" : "development";
  const authSecret =
    appEnv === "production"
      ? required("AUTH_SECRET")
      : required("AUTH_SECRET", "dev-only-change-me-in-production-32chars");
  return {
    appEnv,
    appUrl: process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    databaseUrl: required("DATABASE_URL", "file:./dev.db"),
    authSecret,
    paymentProvider: (process.env.PAYMENT_PROVIDER ?? "manual") as
      | "manual"
      | "yoco"
      | "stripe",
    yocoSecretKey: process.env.YOCO_SECRET_KEY ?? "",
    yocoPublicKey: process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY ?? "",
    yocoWebhookSecret: process.env.YOCO_WEBHOOK_SECRET ?? "",
    yocoMode: process.env.YOCO_MODE === "live" ? "live" : "test",
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    emailFrom: process.env.EMAIL_FROM ?? "UNDERSTOOD. <orders@localhost>",
    ownerEmail: process.env.OWNER_EMAIL ?? "owner@understood.co.za",
    whatsappNumber: process.env.WHATSAPP_NUMBER ?? "",
  };
}

export function isProduction() {
  return getConfig().appEnv === "production";
}
