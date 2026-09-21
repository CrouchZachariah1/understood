import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { SeasonDecor } from "@/components/store/SeasonDecor";
import { NewsletterForm } from "@/components/store/NewsletterForm";
import { getActiveTheme } from "@/lib/theme/engine";
import { prisma } from "@/lib/db";
import { productInclude } from "@/lib/catalogue";
import { formatZar } from "@/lib/money";
import { getSettings } from "@/lib/settings";

export default async function HomePage() {
  const theme = await getActiveTheme();
  const [featured, collections, bundles, reviews, sizes, settings] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE", featured: true },
      include: productInclude,
      take: 8,
    }),
    prisma.collection.findMany({ where: { homepage: true }, orderBy: { sortOrder: "asc" } }),
    prisma.bundle.findMany({ where: { homepage: true, active: true } }),
    prisma.review.findMany({ where: { published: true }, take: 3, orderBy: { createdAt: "desc" } }),
    prisma.sizeDefinition.findMany({ orderBy: { sortOrder: "asc" } }),
    getSettings(),
  ]);

  const ages = [
    { href: "/age/toddler", title: "Toddler", copy: "Playful. Bright. Fun.", image: "/products/niku-floral.png" },
    { href: "/age/kids", title: "Kids", copy: "Colourful. Energetic.", image: "/products/niku-teal.png" },
    { href: "/age/youth", title: "Youth", copy: "Cleaner. Sportier.", image: "/products/niku-navy.png" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div className="relative z-10">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[var(--season-secondary)]">{theme.label}</p>
            <h1 className="font-display text-5xl leading-[0.9] sm:text-7xl">{theme.heroHeading}</h1>
            <p className="mt-6 max-w-md text-lg text-[var(--season-fg)]/80">{theme.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center rounded-full bg-[var(--season-primary)] px-6 font-semibold text-white"
              >
                {theme.ctaPrimary}
              </Link>
              <Link
                href="/bundles"
                className="inline-flex min-h-12 items-center rounded-full border border-[var(--season-fg)]/20 bg-white px-6 font-semibold"
              >
                {theme.ctaSecondary}
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-4 -top-6 z-10">
              <SeasonDecor kind={theme.decorative} />
            </div>
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] shadow-2xl lg:max-w-none">
              <Image
                src={theme.heroImage}
                alt={`${theme.label} campaign for UNDERSTOOD.`}
                width={1200}
                height={1600}
                priority
                quality={90}
                className="h-auto w-full"
                sizes="(max-width: 1024px) 92vw, 540px"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl sm:text-4xl">Shop by age</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {ages.map((age) => (
            <Link key={age.href} href={age.href} className="group overflow-hidden rounded-[1.6rem] bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src={age.image}
                  alt={`${age.title} shop`}
                  fill
                  quality={90}
                  className="object-contain p-6 transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-3xl">{age.title}</h3>
                <p className="mt-1 opacity-70">{age.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] bg-[var(--season-fg)] text-[var(--season-bg)]">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-64 md:min-h-full">
              <Image
                src={theme.campaignImage}
                alt={`${theme.label} campaign`}
                fill
                quality={90}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-8 sm:p-12">
              <p className="text-xs uppercase tracking-[0.3em] opacity-70">Featured campaign</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">{theme.heroHeading}</h2>
              <p className="mt-4 max-w-sm opacity-80">{theme.heroSubtitle}</p>
              <Link href="/shop?sort=newest" className="mt-6 inline-flex rounded-full bg-[var(--season-accent)] px-5 py-3 font-semibold text-[var(--season-fg)]">
                Shop the campaign
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 font-display text-3xl sm:text-4xl">Shop by collection</h2>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.slug}`}
              className="relative min-h-40 min-w-52 overflow-hidden rounded-[1.4rem] bg-white"
            >
              {c.imageUrl ? (
                <Image src={c.imageUrl} alt={c.name} fill quality={90} className="object-contain p-3" sizes="208px" />
              ) : null}
              <span className="absolute inset-x-0 bottom-0 bg-[var(--season-fg)]/70 px-4 py-3 text-sm font-medium text-white">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl sm:text-4xl">Best sellers</h2>
          <Link href="/shop" className="text-sm underline">
            Shop all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 font-display text-3xl sm:text-4xl">Bundle deals</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {bundles.map((b) => (
            <Link key={b.id} href="/bundles" className="rounded-[1.6rem] bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--season-primary)]">{b.campaignName ?? "Mix & match"}</p>
              <h3 className="mt-2 font-display text-3xl">{b.name}</h3>
              <p className="mt-2 text-sm opacity-70">{b.description}</p>
              <p className="mt-4 text-xl font-semibold">{formatZar(b.priceCents)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h2 className="mb-6 font-display text-3xl">Shop by size</h2>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <Link
              key={s.id}
              href={`/shop?size=${encodeURIComponent(s.name)}`}
              className="min-h-12 min-w-12 rounded-2xl bg-white px-4 py-3 text-center font-semibold shadow-sm"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 rounded-[2rem] bg-white p-8 md:grid-cols-2 md:p-12">
          <div>
            <h2 className="font-display text-4xl">Why UNDERSTOOD.</h2>
            <p className="mt-4 max-w-md text-[var(--season-fg)]/75">
              Colour. Comfort. Confidence. A retail home for growing kids — and the people who buy for them.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              ["Everyday colour", "Pieces that work on a Tuesday, not just a holiday."],
              ["Growing, on purpose", "Sizes that keep up, without making youth feel small."],
              ["Value that stacks", "Bundles and honest prices so drawers stay full."],
              ["Chosen, not claimed", "We curate brands like NIKU. We don’t pretend to make them."],
            ].map(([title, copy]) => (
              <li key={title}>
                <p className="font-display text-xl">{title}</p>
                <p className="mt-1 text-sm opacity-70">{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h2 className="mb-6 font-display text-3xl">Reviews</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <blockquote key={r.id} className="rounded-3xl bg-white p-6">
              <p className="text-sm tracking-widest text-[var(--season-primary)]">{"★".repeat(r.rating)}</p>
              <p className="mt-3 text-lg leading-snug">“{r.body}”</p>
              <footer className="mt-4 text-sm opacity-60">{r.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-[2rem] bg-[var(--season-secondary)] px-6 py-12 text-white sm:px-12">
          <h2 className="font-display text-4xl">{settings.newsletterHeading}</h2>
          <p className="mt-3 max-w-md opacity-90">{settings.newsletterText}</p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
