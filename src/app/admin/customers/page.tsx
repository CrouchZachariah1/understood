import { prisma } from "@/lib/db";

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
  });
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-4xl">Customers</h1>
      <ul className="mt-6 space-y-2">
        {customers.map((c) => (
          <li key={c.id} className="rounded-2xl bg-white p-4">
            {c.name} · {c.email}
          </li>
        ))}
        {customers.length === 0 ? <p className="text-sm opacity-60">No customer accounts yet. Guest checkout still works.</p> : null}
      </ul>
      <h2 className="mt-10 font-display text-2xl">Newsletter</h2>
      <ul className="mt-3 space-y-1 text-sm">
        {subscribers.map((s) => (
          <li key={s.id}>{s.email}</li>
        ))}
      </ul>
    </div>
  );
}
