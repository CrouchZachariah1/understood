import { prisma } from "@/lib/db";
import { createCollectionAction } from "@/app/actions/admin";

export default async function CollectionsAdmin() {
  const collections = await prisma.collection.findMany({ include: { _count: { select: { products: true } } } });
  return (
    <div>
      <h1 className="font-display text-4xl">Collections</h1>
      <form action={createCollectionAction} className="mt-6 flex flex-wrap gap-3 rounded-2xl bg-white p-5">
        <input name="name" required placeholder="Collection name" className="h-11 rounded-xl border px-3" />
        <input name="description" placeholder="Description" className="h-11 flex-1 rounded-xl border px-3" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="homepage" /> Homepage
        </label>
        <button className="rounded-full bg-black px-4 py-2 text-sm text-white">Create</button>
      </form>
      <ul className="mt-6 space-y-2">
        {collections.map((c) => (
          <li key={c.id} className="rounded-2xl bg-white p-4">
            {c.name} · {c._count.products} products
          </li>
        ))}
      </ul>
    </div>
  );
}
