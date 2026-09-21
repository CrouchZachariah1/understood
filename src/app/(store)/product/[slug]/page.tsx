import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, productInclude } from "@/lib/catalogue";
import { prisma } from "@/lib/db";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductCard } from "@/components/store/ProductCard";
import { AddToCart } from "@/components/store/AddToCart";
import { getSettings } from "@/lib/settings";
import { RecentlyViewed } from "@/components/store/RecentlyViewed";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "ACTIVE") notFound();
  const settings = await getSettings();
  const related = await prisma.product.findMany({
    where: { status: "ACTIVE", ageGroup: product.ageGroup, id: { not: product.id } },
    include: productInclude,
    take: 4,
  });
  const variants = product.variants.map((v) => ({
    id: v.id,
    colorName: v.colorName,
    colorHex: v.colorHex,
    sizeName: v.size.name,
    stock: v.stock,
    reserved: v.reserved,
    priceCents: v.priceCents,
    compareAtCents: v.compareAtCents,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <RecentlyViewed id={product.id} />
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} />
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--season-secondary)]">{product.brand.name}</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">{product.name}</h1>
          <p className="mt-4 max-w-lg opacity-75">{product.description}</p>
          <div className="mt-8">
            <AddToCart
              variants={variants}
              productName={product.name}
              whatsapp={settings.whatsapp}
              productUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/product/${product.slug}`}
            />
          </div>
          <dl className="mt-10 space-y-4 text-sm">
            <div>
              <dt className="font-semibold">Material</dt>
              <dd className="opacity-75">{product.material}</dd>
            </div>
            <div>
              <dt className="font-semibold">Care</dt>
              <dd className="opacity-75">{product.care}</dd>
            </div>
            <div>
              <dt className="font-semibold">Delivery & returns</dt>
              <dd className="opacity-75">
                <Link href="/delivery" className="underline">Delivery</Link> · <Link href="/returns" className="underline">Returns</Link> ·{" "}
                <Link href="/size-guide" className="underline">Size guide</Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Complete the bundle</h2>
        <p className="mt-2 opacity-70">Mix colours. The cart applies Pick any 3 / 5 automatically.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
