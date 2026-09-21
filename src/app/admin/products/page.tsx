import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatZar } from "@/lib/money";

export default async function ProductsAdmin() {
  const products = await prisma.product.findMany({
    include: { brand: true, variants: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <h1 className="font-display text-4xl">Products</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-widest opacity-50">
              <th className="p-3">Product</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Age</th>
              <th className="p-3">Units</th>
              <th className="p-3">From</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <Link href={`/product/${p.slug}`} className="font-semibold underline">
                    {p.name}
                  </Link>
                </td>
                <td className="p-3">{p.brand.name}</td>
                <td className="p-3">{p.ageGroup}</td>
                <td className="p-3">{p.variants.reduce((s, v) => s + v.stock, 0)}</td>
                <td className="p-3">{formatZar(Math.min(...p.variants.map((v) => v.priceCents)))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
