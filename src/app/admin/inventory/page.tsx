import { prisma } from "@/lib/db";
import { StockEditor } from "@/components/admin/StockEditor";

export default async function InventoryPage() {
  const variants = await prisma.variant.findMany({
    include: { product: true, size: true },
    orderBy: [{ product: { name: "asc" } }, { size: { sortOrder: "asc" } }],
  });
  return (
    <div>
      <h1 className="font-display text-4xl">Inventory</h1>
      <p className="mt-1 text-sm opacity-60">Real stock. Low stock only shows when it is actually low.</p>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-widest opacity-50">
              <th className="p-3">SKU</th>
              <th className="p-3">Product</th>
              <th className="p-3">Colour</th>
              <th className="p-3">Size</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Reserved</th>
              <th className="p-3">Sold</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3 font-mono text-xs">{v.sku}</td>
                <td className="p-3">{v.product.name}</td>
                <td className="p-3">{v.colorName}</td>
                <td className="p-3">{v.size.name}</td>
                <td className="p-3">
                  <StockEditor id={v.id} stock={v.stock} />
                </td>
                <td className="p-3">{v.reserved}</td>
                <td className="p-3">{v.unitsSold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
