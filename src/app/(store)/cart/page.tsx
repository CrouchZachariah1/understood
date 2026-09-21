import Image from "next/image";
import Link from "next/link";
import { getCart } from "@/lib/cart";
import { quoteCart, type PricedLine } from "@/lib/pricing";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatZar } from "@/lib/money";
import { CartControls } from "@/components/store/CartControls";
import { readSession } from "@/lib/auth/session";

export default async function CartPage() {
  const cart = await getCart();
  const settings = await getSettings();
  const session = await readSession();
  const lines: PricedLine[] = cart.items.map((item) => ({
    variantId: item.variantId,
    productId: item.variant.productId,
    productName: item.variant.product.name,
    colorName: item.variant.colorName,
    sizeName: item.variant.size.name,
    sku: item.variant.sku,
    quantity: item.quantity,
    unitCents: item.variant.priceCents,
    compareAtCents: item.variant.compareAtCents,
    collectionIds: [],
    categoryId: item.variant.product.categoryId,
    image: item.variant.product.images[0]?.url,
  }));
  const prior = session
    ? await prisma.order.count({ where: { userId: session.id, paymentStatus: "PAID" } })
    : 0;
  const discount = await prisma.discount.findFirst({ where: { automatic: true, active: true } });
  const bundles = await prisma.bundle.findMany({ where: { active: true } });
  const quote = quoteCart({
    lines,
    discount,
    bundles,
    isFirstOrder: prior === 0,
    freeDeliveryCents: settings.freeDeliveryCents,
    flatDeliveryCents: settings.flatDeliveryCents,
  });
  const progress = settings.freeDeliveryCents
    ? Math.min(100, Math.round(((quote.subtotalCents - quote.discountCents) / settings.freeDeliveryCents) * 100))
    : 100;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl">Cart</h1>
      {cart.items.length === 0 ? (
        <p className="mt-6">
          Your cart is empty. <Link href="/shop" className="underline">Start shopping</Link>
        </p>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li key={item.id} className="flex gap-4 rounded-3xl bg-white p-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-[var(--season-muted)]">
                  {item.variant.product.images[0] ? (
                    <Image src={item.variant.product.images[0].url} alt="" fill quality={90} className="object-contain p-1" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <p className="font-display text-lg">{item.variant.product.name}</p>
                  <p className="text-sm opacity-70">
                    {item.variant.colorName} · Size {item.variant.size.name}
                  </p>
                  <p className="mt-1 font-semibold">{formatZar(item.variant.priceCents)}</p>
                  <CartControls id={item.id} quantity={item.quantity} />
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-3xl bg-white p-6">
            <p className="text-sm">
              {quote.freeDelivery
                ? "Free delivery unlocked."
                : `Spend ${formatZar(quote.remainingForFreeDelivery)} more for free delivery.`}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--season-muted)]">
              <div className="h-full bg-[var(--season-primary)]" style={{ width: `${progress}%` }} />
            </div>
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatZar(quote.subtotalCents)}</dd></div>
              <div className="flex justify-between"><dt>Discount</dt><dd>-{formatZar(quote.discountCents)}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd>{formatZar(quote.deliveryCents)}</dd></div>
              <div className="flex justify-between text-lg font-semibold"><dt>Total</dt><dd>{formatZar(quote.totalCents)}</dd></div>
            </dl>
            {quote.savingsCents > 0 ? (
              <p className="mt-3 text-sm text-[var(--season-primary)]">You saved {formatZar(quote.savingsCents)}.</p>
            ) : null}
            {quote.appliedBundle ? <p className="mt-2 text-sm">Bundle: {quote.appliedBundle.name}</p> : null}
            <Link href="/checkout" className="mt-6 flex h-12 items-center justify-center rounded-full bg-[var(--season-fg)] font-semibold text-white">
              Checkout
            </Link>
            <p className="mt-3 text-center text-xs opacity-60">Guest checkout. Account optional.</p>
          </aside>
        </div>
      )}
    </div>
  );
}
