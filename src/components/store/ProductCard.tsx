import Image from "next/image";
import Link from "next/link";
import { formatZar } from "@/lib/money";
import { productAvailable, productPriceRange, type ProductCard as ProductCardType } from "@/lib/catalogue";

export function ProductCard({ product }: { product: ProductCardType }) {
  const image = product.images[0];
  const price = productPriceRange(product);
  const onSale = price.compare != null && price.compare > price.min;
  const inStock = productAvailable(product);
  const discount = onSale ? Math.round(((price.compare! - price.min) / price.compare!) * 100) : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <article className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_-24px_rgba(7,36,72,0.45)]">
        <div className="relative aspect-square overflow-hidden bg-white">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              quality={90}
              className="object-contain p-4 transition duration-500 group-hover:scale-[1.03]"
            />
          ) : null}
          {onSale ? (
            <span className="absolute left-3 top-3 rounded-full bg-[var(--season-primary)] px-2.5 py-1 text-xs font-semibold text-white">
              {discount}% off
            </span>
          ) : null}
          {!inStock ? (
            <span className="absolute right-3 top-3 rounded-full bg-[var(--season-fg)]/80 px-2.5 py-1 text-xs text-white">
              Sold out
            </span>
          ) : null}
        </div>
        <div className="space-y-1 p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--season-secondary)]">{product.brand.name}</p>
          <h3 className="font-display text-lg leading-tight">{product.name}</h3>
          <p className="text-sm">
            {onSale ? (
              <>
                <span className="font-semibold">{formatZar(price.min)}</span>{" "}
                <span className="text-[var(--season-fg)]/50 line-through">{formatZar(price.compare!)}</span>
              </>
            ) : (
              <span className="font-semibold">{formatZar(price.min)}</span>
            )}
          </p>
        </div>
      </article>
    </Link>
  );
}
