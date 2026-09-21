import { PrismaClient, AgeGroup, PatternType, SeasonKey } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SEASON_THEMES } from "../src/lib/theme/defaults";

const prisma = new PrismaClient();

const SIZES = [
  { name: "2–3", ageLabel: "2–3 years", waistMin: 48, waistMax: 51, sortOrder: 1 },
  { name: "4–5", ageLabel: "4–5 years", waistMin: 52, waistMax: 55, sortOrder: 2 },
  { name: "6", ageLabel: "6 years", waistMin: 56, waistMax: 58, sortOrder: 3 },
  { name: "8", ageLabel: "8 years", waistMin: 59, waistMax: 62, sortOrder: 4 },
  { name: "10", ageLabel: "10 years", waistMin: 63, waistMax: 66, sortOrder: 5 },
  { name: "12", ageLabel: "12 years", waistMin: 67, waistMax: 70, sortOrder: 6 },
  { name: "14", ageLabel: "14 years", waistMin: 71, waistMax: 74, sortOrder: 7 },
];

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  ageGroup: AgeGroup;
  pattern: PatternType;
  colorName: string;
  colorHex: string;
  images: { url: string; alt: string }[];
  price: number;
  compare?: number;
  featured?: boolean;
  clearance?: boolean;
  collections: string[];
  listedDaysAgo?: number;
  stock: Record<string, number>;
};

const PRODUCTS: SeedProduct[] = [
  {
    name: "NIKU Brief — Ocean",
    slug: "niku-brief-ocean",
    description:
      "A bright ocean-blue brief with a wide NIKU waistband. Soft stretch cotton for everyday wear, from busy mornings to the long way home.",
    ageGroup: "KIDS",
    pattern: "SOLID",
    colorName: "Ocean",
    colorHex: "#1EA7E1",
    images: [
      { url: "/products/niku-ocean.jpg", alt: "NIKU ocean blue brief, flat lay" },
      { url: "/products/niku-waistband.jpg", alt: "NIKU waistband detail" },
    ],
    price: 7900,
    compare: 9900,
    featured: true,
    collections: ["fresh-colours", "everyday-basics", "seasonal-picks", "little-ones"],
    stock: { "2–3": 18, "4–5": 22, "6": 14, "8": 9, "10": 2, "12": 11, "14": 7 },
  },
  {
    name: "NIKU Brief — Sunset",
    slug: "niku-brief-sunset",
    description:
      "Sunset orange for kids who like colour with their comfort. Brief cut, breathable cotton, NIKU elastic waist.",
    ageGroup: "ALL",
    pattern: "SOLID",
    colorName: "Sunset",
    colorHex: "#FF6B2C",
    images: [{ url: "/products/niku-sunset.jpg", alt: "NIKU sunset orange brief, flat lay" }],
    price: 7900,
    featured: true,
    collections: ["fresh-colours", "everyday-basics", "seasonal-picks"],
    stock: { "2–3": 12, "4–5": 16, "6": 20, "8": 18, "10": 15, "12": 10, "14": 8 },
  },
  {
    name: "NIKU Brief — Lime",
    slug: "niku-brief-lime",
    description: "Electric lime, everyday brief. Made for growing — wash after wash, still bright.",
    ageGroup: "TODDLER",
    pattern: "SOLID",
    colorName: "Lime",
    colorHex: "#B5E11E",
    images: [{ url: "/products/niku-lime-2.jpg", alt: "NIKU lime brief, flat lay" }],
    price: 6900,
    featured: true,
    collections: ["fresh-colours", "little-ones", "new-arrivals"],
    stock: { "2–3": 24, "4–5": 20, "6": 8, "8": 4, "10": 0, "12": 0, "14": 0 },
  },
  {
    name: "NIKU Brief — Coral",
    slug: "niku-brief-coral",
    description: "Coral pink brief with a branded NIKU waistband. Soft, colourful, easy to pack.",
    ageGroup: "TODDLER",
    pattern: "SOLID",
    colorName: "Coral",
    colorHex: "#FF6F91",
    images: [{ url: "/products/niku-coral-2.jpg", alt: "NIKU coral brief, flat lay" }],
    price: 6900,
    collections: ["fresh-colours", "little-ones", "seasonal-picks"],
    stock: { "2–3": 16, "4–5": 14, "6": 10, "8": 6, "10": 3, "12": 0, "14": 0 },
  },
  {
    name: "NIKU Brief — Black",
    slug: "niku-brief-black",
    description: "Clean black brief with a white NIKU wordmark on the waistband. A quieter option for youth.",
    ageGroup: "YOUTH",
    pattern: "SOLID",
    colorName: "Black",
    colorHex: "#111111",
    images: [{ url: "/products/niku-black.jpg", alt: "NIKU black brief, flat lay" }],
    price: 8900,
    featured: true,
    collections: ["everyday-basics", "youth", "new-arrivals"],
    stock: { "2–3": 0, "4–5": 0, "6": 6, "8": 12, "10": 18, "12": 16, "14": 14 },
  },
  {
    name: "NIKU Brief — Tropical Print",
    slug: "niku-brief-tropical",
    description: "A bold tropical print on a classic brief cut. Colour for everyday, not just holidays.",
    ageGroup: "KIDS",
    pattern: "PRINT",
    colorName: "Tropical",
    colorHex: "#14B8A6",
    images: [{ url: "/products/niku-tropical-2.jpg", alt: "NIKU tropical print brief, flat lay" }],
    price: 8900,
    compare: 10900,
    featured: true,
    collections: ["bold-prints", "seasonal-picks", "fresh-colours"],
    stock: { "2–3": 8, "4–5": 10, "6": 12, "8": 14, "10": 9, "12": 7, "14": 5 },
  },
  {
    name: "NIKU Brief — Sky Stripe",
    slug: "niku-brief-sky-stripe",
    description: "Sky stripe brief with a navy NIKU waistband. Sportier, cleaner, built for growing into.",
    ageGroup: "YOUTH",
    pattern: "STRIPE",
    colorName: "Sky Stripe",
    colorHex: "#7DD3FC",
    images: [{ url: "/products/niku-stripe-2.jpg", alt: "NIKU sky stripe brief, flat lay" }],
    price: 8900,
    collections: ["youth", "everyday-basics", "new-arrivals"],
    listedDaysAgo: 95,
    stock: { "2–3": 0, "4–5": 0, "6": 20, "8": 22, "10": 24, "12": 18, "14": 16 },
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "owner@understood.co.za";
  const password = process.env.ADMIN_PASSWORD ?? "UnderstoodLaunch1!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: "Store Owner",
      role: "OWNER",
    },
  });

  const brand = await prisma.brand.upsert({
    where: { slug: "niku" },
    update: {},
    create: {
      name: "NIKU",
      slug: "niku",
      description: "An established South African brand. Curated at UNDERSTOOD. for growing kids.",
    },
  });

  const underwear = await prisma.category.upsert({
    where: { slug: "underwear" },
    update: {},
    create: { name: "Underwear", slug: "underwear", description: "Everyday briefs and basics." },
  });
  await prisma.category.upsert({
    where: { slug: "basics" },
    update: {},
    create: { name: "Basics", slug: "basics" },
  });

  const collectionMeta = [
    { name: "Everyday Basics", slug: "everyday-basics", featured: true, homepage: true },
    { name: "Fresh Colours", slug: "fresh-colours", featured: true, homepage: true },
    { name: "Bold Prints", slug: "bold-prints", featured: true, homepage: true },
    { name: "Little Ones", slug: "little-ones", featured: true, homepage: true, ageGroup: "TODDLER" as AgeGroup },
    { name: "Youth", slug: "youth", featured: true, homepage: true, ageGroup: "YOUTH" as AgeGroup },
    { name: "New Arrivals", slug: "new-arrivals", featured: true, homepage: true },
    { name: "Seasonal Picks", slug: "seasonal-picks", featured: true, homepage: true },
    { name: "Clearance", slug: "clearance", featured: false, homepage: false },
    { name: "Multipacks", slug: "multipacks", featured: true, homepage: true },
  ];
  const collections = [];
  for (const c of collectionMeta) {
    collections.push(
      await prisma.collection.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      }),
    );
  }
  const col = Object.fromEntries(collections.map((c) => [c.slug, c]));

  const sizes = [];
  for (const s of SIZES) {
    const existing = await prisma.sizeDefinition.findFirst({ where: { name: s.name } });
    sizes.push(existing ?? (await prisma.sizeDefinition.create({ data: s })));
  }
  const sizeByName = Object.fromEntries(sizes.map((s) => [s.name, s]));

  const productIds: string[] = [];
  for (const p of PRODUCTS) {
    const listedAt = p.listedDaysAgo
      ? new Date(Date.now() - p.listedDaysAgo * 86400000)
      : new Date();
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        material: "95% cotton, 5% elastane. Soft stretch for growing.",
        care: "Machine wash cold. Do not bleach. Line dry. Do not iron the waistband.",
        brandId: brand.id,
        categoryId: underwear.id,
        ageGroup: p.ageGroup,
        pattern: p.pattern,
        featured: p.featured ?? false,
        clearance: p.clearance ?? false,
        listedAt,
        images: { create: p.images.map((img, i) => ({ ...img, sortOrder: i })) },
      },
    });
    productIds.push(product.id);
    for (const [sizeName, stock] of Object.entries(p.stock)) {
      const size = sizeByName[sizeName];
      if (!size) continue;
      const sku = `NIKU-${p.colorName.replace(/\s+/g, "").toUpperCase()}-${sizeName.replace("–", "")}`;
      await prisma.variant.upsert({
        where: { sku },
        update: { stock },
        create: {
          productId: product.id,
          sku,
          colorName: p.colorName,
          colorHex: p.colorHex,
          sizeId: size.id,
          priceCents: p.price,
          compareAtCents: p.compare ?? null,
          stock,
          lastSoldAt: p.listedDaysAgo ? null : new Date(Date.now() - 4 * 86400000),
          unitsSold: p.listedDaysAgo ? 0 : Math.max(0, 12 - Math.floor(stock / 4)),
        },
      });
    }
    for (const slug of p.collections) {
      if (!col[slug]) continue;
      await prisma.collectionProduct.upsert({
        where: { collectionId_productId: { collectionId: col[slug].id, productId: product.id } },
        update: {},
        create: { collectionId: col[slug].id, productId: product.id },
      });
    }
  }

  await prisma.bundle.upsert({
    where: { slug: "pick-any-3" },
    update: {},
    create: {
      name: "Pick any 3",
      slug: "pick-any-3",
      description: "Mix colours and sizes. Any 3 qualifying briefs.",
      pickCount: 3,
      priceCents: 19900,
      homepage: true,
      campaignName: "Summer Pack",
      products: { create: productIds.map((productId) => ({ productId })) },
    },
  });
  await prisma.bundle.upsert({
    where: { slug: "pick-any-5" },
    update: {},
    create: {
      name: "Pick any 5",
      slug: "pick-any-5",
      description: "The week pack. Any 5 briefs for R299.",
      pickCount: 5,
      priceCents: 29900,
      homepage: true,
      campaignName: "School Week Pack",
      products: { create: productIds.map((productId) => ({ productId })) },
    },
  });
  await prisma.bundle.upsert({
    where: { slug: "sibling-pack" },
    update: {},
    create: {
      name: "Sibling pack",
      slug: "sibling-pack",
      description: "Four pairs, mixed sizes welcome.",
      pickCount: 4,
      priceCents: 24900,
      homepage: true,
      products: { create: productIds.map((productId) => ({ productId })) },
    },
  });

  await prisma.discount.upsert({
    where: { code: "SUMMER10" },
    update: {},
    create: {
      name: "Summer 10%",
      code: "SUMMER10",
      type: "PERCENT",
      percentOff: 10,
      active: true,
    },
  });
  await prisma.discount.create({
    data: {
      name: "First order 10%",
      type: "PERCENT",
      percentOff: 10,
      firstOrderOnly: true,
      automatic: true,
      active: true,
    },
  }).catch(() => undefined);

  for (const [season, tokens] of Object.entries(SEASON_THEMES) as [SeasonKey, (typeof SEASON_THEMES)[SeasonKey]][]) {
    const existing = await prisma.theme.findFirst({ where: { season, published: season === "SUMMER" } });
    if (existing) continue;
    await prisma.theme.create({
      data: {
        ...tokens,
        published: season === "SUMMER",
      },
    });
  }

  await prisma.campaign.upsert({
    where: { slug: "summer-understood" },
    update: {},
    create: {
      title: "Summer Understood",
      slug: "summer-understood",
      description: "Bright colours for everyday comfort.",
      heroUrl: "/themes/summer.jpg",
      bannerText: "SUMMER. UNDERSTOOD.",
      season: "SUMMER",
      homepage: true,
      status: "ACTIVE",
      products: { create: productIds.slice(0, 5).map((productId) => ({ productId })) },
    },
  });

  const pages: { key: string; title: string; body: string }[] = [
    {
      key: "about",
      title: "About UNDERSTOOD.",
      body: `UNDERSTOOD. is a South African retail brand for growing families.

We curate everyday pieces — starting with colourful NIKU briefs — for toddlers, children and young teens, chosen by the people who buy for them.

We do not manufacture NIKU. We choose it because the colour is honest, the fit is familiar, and the price lets a drawer stay full.

Comfort looks good. Growing up, understood.`,
    },
    {
      key: "faq",
      title: "FAQ",
      body: `**Do I need an account?** No. Guest checkout is first.

**How do sizes work?** Use age as a starting point, then the waist guide. When in between, size up.

**Can I mix colours in a bundle?** Yes. Bundles are mix and match on qualifying products.

**What is your returns policy?** Unworn items with tags can be returned within 14 days. See Returns.`,
    },
    {
      key: "delivery",
      title: "Delivery",
      body: `We deliver across South Africa.

Standard courier is a flat rate, with free delivery from R650.

Once an order is paid, we pack from real inventory. You’ll get an email when it ships.`,
    },
    {
      key: "returns",
      title: "Returns",
      body: `Unworn items in original condition may be returned within 14 days of delivery.

Underwear must be unused and in original packaging. Contact us with your order number and we’ll help from there.`,
    },
    {
      key: "size-guide",
      title: "Size guide",
      body: `Start with age, then check waist.

If your child is between sizes, choose the larger size — growing is the point.

2–3 · 4–5 · 6 · 8 · 10 · 12 · 14

Waist measurements are a guide, not a rule. Brands sit slightly differently; NIKU briefs are a classic brief cut with a wide elastic waist.`,
    },
  ];
  for (const page of pages) {
    await prisma.contentPage.upsert({
      where: { key: page.key },
      update: { body: page.body, title: page.title },
      create: page,
    });
  }

  const settings: Record<string, string> = {
    storeName: "UNDERSTOOD.",
    tagline: "Comfort. Understood.",
    freeDeliveryCents: "65000",
    flatDeliveryCents: "7500",
    contactEmail: "hello@understood.co.za",
    newsletterHeading: "Colour, comfort, and the next drop.",
    newsletterText: "Season notes and bundle deals. No noise.",
    whatsapp: process.env.WHATSAPP_NUMBER ?? "",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  await prisma.review.createMany({
    data: [
      {
        author: "Lebo M.",
        rating: 5,
        body: "Bright, soft, and the sizes actually matched the guide. Packed a drawer in one order.",
      },
      {
        author: "Daniel P.",
        rating: 5,
        body: "The pick-any-5 bundle made sense. Mixed colours for two kids without fuss.",
      },
      {
        author: "Ayesha K.",
        rating: 4,
        body: "Youth black brief is a cleaner look — my 13-year-old would not have worn the prints.",
      },
    ],
  });

  console.info("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
