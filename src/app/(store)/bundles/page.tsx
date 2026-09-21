import { prisma } from "@/lib/db";
import { formatZar } from "@/lib/money";
import Link from "next/link";

export default async function BundlesPage() {
  const bundles = await prisma.bundle.findMany({
    where: { active: true },
    include: { products: { include: { product: true } } },
  });
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-5xl">Bundles</h1>
      <p className="mt-3 max-w-xl opacity-75">Mix colours and sizes. The cart calculates the deal when you qualify.</p>
      <div className="mt-10 grid gap-4">
        {bundles.map((b) => (
          <article key={b.id} className="rounded-[1.6rem] bg-white p-6 sm:p-8">
            <h2 className="font-display text-3xl">{b.name}</h2>
            <p className="mt-2 opacity-70">{b.description}</p>
            <p className="mt-4 text-2xl font-semibold">{formatZar(b.priceCents)} for {b.pickCount}</p>
            <Link href="/shop" className="mt-4 inline-flex rounded-full bg-[var(--season-primary)] px-5 py-3 font-semibold text-white">
              Mix & match
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
