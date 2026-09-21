import Link from "next/link";
import { requireSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { formatZar } from "@/lib/money";
import { logoutAction } from "@/app/actions/auth";
import { isStaff } from "@/lib/auth/guards";

export default async function AccountPage() {
  const session = await requireSession();
  const orders = await prisma.order.findMany({
    where: { OR: [{ userId: session.id }, { email: session.email }] },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: session.id },
    include: { product: true },
  });
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Hello, {session.name}</h1>
          <p className="mt-1 text-sm opacity-70">{session.email}</p>
        </div>
        <form action={logoutAction}>
          <button className="text-sm underline">Log out</button>
        </form>
      </div>
      {isStaff(session.role) ? (
        <Link href="/admin" className="mt-4 inline-flex rounded-full bg-[var(--season-fg)] px-4 py-2 text-sm text-white">
          Open admin
        </Link>
      ) : null}
      <h2 className="mt-10 font-display text-2xl">Orders</h2>
      <ul className="mt-4 space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="rounded-2xl bg-white p-4">
            <p className="font-semibold">{o.number}</p>
            <p className="text-sm opacity-70">
              {o.status.replaceAll("_", " ")} · {formatZar(o.totalCents)}
            </p>
          </li>
        ))}
        {orders.length === 0 ? <p className="text-sm opacity-70">No orders yet.</p> : null}
      </ul>
      <h2 className="mt-10 font-display text-2xl">Wishlist</h2>
      <ul className="mt-4 space-y-2">
        {wishlist.map((w) => (
          <li key={w.id}>
            <Link href={`/product/${w.product.slug}`} className="underline">
              {w.product.name}
            </Link>
          </li>
        ))}
        {wishlist.length === 0 ? <p className="text-sm opacity-70">Nothing saved yet.</p> : null}
      </ul>
    </div>
  );
}
