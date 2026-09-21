import { CheckoutForm } from "@/components/store/CheckoutForm";
import { getCart } from "@/lib/cart";
import { redirect } from "next/navigation";
import { SA_PROVINCES } from "@/lib/provinces";

export default async function CheckoutPage() {
  const cart = await getCart();
  if (!cart.items.length) redirect("/cart");
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl">Checkout</h1>
      <p className="mt-2 text-sm opacity-70">Guest checkout. You can create an account later.</p>
      <CheckoutForm provinces={[...SA_PROVINCES]} />
    </div>
  );
}
