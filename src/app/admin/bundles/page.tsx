import { prisma } from "@/lib/db";
import { formatZar } from "@/lib/money";
import { createBundleAction } from "@/app/actions/admin";

export default async function BundlesAdmin() {
  const bundles = await prisma.bundle.findMany({ include: { products: true } });
  return (
    <div>
      <h1 className="font-display text-4xl">Bundles</h1>
      <form action={createBundleAction} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-2">
        <input name="name" required placeholder="Pick any 5" className="h-11 rounded-xl border px-3" />
        <input name="pickCount" type="number" defaultValue={5} className="h-11 rounded-xl border px-3" />
        <input name="priceCents" type="number" placeholder="Price in cents e.g. 29900" className="h-11 rounded-xl border px-3" />
        <input name="description" placeholder="Description" className="h-11 rounded-xl border px-3" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="homepage" defaultChecked /> Homepage
        </label>
        <button className="rounded-full bg-black px-4 py-2 text-sm text-white">Create bundle</button>
      </form>
      <ul className="mt-6 space-y-3">
        {bundles.map((b) => (
          <li key={b.id} className="rounded-2xl bg-white p-4">
            <p className="font-semibold">{b.name}</p>
            <p className="text-sm opacity-60">
              {b.pickCount} for {formatZar(b.priceCents)} · {b.products.length} products · {b.active ? "Active" : "Off"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
