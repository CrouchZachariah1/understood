import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { ageFromPath, searchProducts } from "@/lib/catalogue";

const COPY: Record<string, { title: string; body: string; image: string }> = {
  toddler: {
    title: "Toddler",
    body: "Playful, bright, and easy to pack. Colour for the smallest drawers.",
    image: "/products/niku-floral.png",
  },
  kids: {
    title: "Kids",
    body: "Energetic colour for everyday. Built for growing, washing, repeating.",
    image: "/products/niku-teal.png",
  },
  youth: {
    title: "Youth",
    body: "Cleaner, sportier, more grown. A shop that doesn’t feel like toddler world.",
    image: "/products/niku-navy.png",
  },
};

export default async function AgePage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  const age = ageFromPath(group);
  const copy = COPY[group];
  if (!age || !copy) notFound();
  const products = await searchProducts({ age });
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-10 overflow-hidden rounded-[2rem] bg-white px-6 py-8">
        <Image
          src={copy.image}
          alt={copy.title}
          width={1600}
          height={1000}
          priority
          quality={90}
          className="mx-auto h-auto w-full max-w-3xl"
        />
      </div>
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--season-secondary)]">Shop by age</p>
      <h1 className="mt-2 font-display text-5xl">{copy.title}</h1>
      <p className="mt-4 max-w-xl opacity-75">{copy.body}</p>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
