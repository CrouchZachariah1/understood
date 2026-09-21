import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/store/ProductCard";
import { productInclude } from "@/lib/catalogue";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: { products: { include: { product: { include: productInclude } } } },
  });
  if (!collection) notFound();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-5xl">{collection.name}</h1>
      {collection.description ? <p className="mt-3 max-w-xl opacity-75">{collection.description}</p> : null}
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {collection.products.map((row) => (
          <ProductCard key={row.productId} product={row.product} />
        ))}
      </div>
    </div>
  );
}
