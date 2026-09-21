"use client";

import { useActionState } from "react";
import { checkoutAction } from "@/app/actions/checkout";

const field = "mt-1 h-12 w-full rounded-2xl border border-[var(--season-fg)]/10 bg-white px-3";

export function CheckoutForm({ provinces }: { provinces: string[] }) {
  const [state, action, pending] = useActionState(checkoutAction, undefined);
  return (
    <form action={action} className="mt-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          Name
          <input name="firstName" required className={field} autoComplete="given-name" />
        </label>
        <label className="text-sm">
          Surname
          <input name="lastName" required className={field} autoComplete="family-name" />
        </label>
      </div>
      <label className="block text-sm">
        Email
        <input name="email" type="email" required className={field} autoComplete="email" />
      </label>
      <label className="block text-sm">
        Mobile
        <input name="phone" required className={field} autoComplete="tel" />
      </label>
      <label className="block text-sm">
        Address
        <input name="line1" required className={field} autoComplete="address-line1" />
      </label>
      <label className="block text-sm">
        Apartment / complex (optional)
        <input name="line2" className={field} autoComplete="address-line2" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          Suburb
          <input name="suburb" required className={field} />
        </label>
        <label className="text-sm">
          City
          <input name="city" required className={field} autoComplete="address-level2" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          Province
          <select name="province" required className={field}>
            <option value="">Select</option>
            {provinces.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Postal code
          <input name="postalCode" required className={field} autoComplete="postal-code" />
        </label>
      </div>
      <label className="block text-sm">
        Delivery notes
        <textarea name="notes" className="mt-1 min-h-24 w-full rounded-2xl border border-[var(--season-fg)]/10 bg-white p-3" />
      </label>
      <label className="block text-sm">
        Coupon code
        <input name="coupon" className={field} />
      </label>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-full bg-[var(--season-fg)] font-semibold text-white"
      >
        {pending ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
