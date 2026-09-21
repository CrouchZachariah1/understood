import { createDiscountAction } from "@/app/actions/admin";

export function DiscountForm() {
  return (
    <form action={createDiscountAction} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-2">
      <input name="name" required placeholder="Name" className="h-11 rounded-xl border px-3" />
      <input name="code" placeholder="CODE" className="h-11 rounded-xl border px-3" />
      <select name="type" className="h-11 rounded-xl border px-3">
        <option value="PERCENT">Percent</option>
        <option value="FIXED">Fixed</option>
        <option value="FREE_DELIVERY">Free delivery</option>
        <option value="BUY_X_GET_Y">Buy X get Y</option>
      </select>
      <input name="percentOff" type="number" placeholder="% off" className="h-11 rounded-xl border px-3" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="automatic" /> Automatic
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="firstOrderOnly" /> First order only
      </label>
      <button className="rounded-full bg-black px-4 py-2 text-sm text-white sm:col-span-2">Create discount</button>
    </form>
  );
}
