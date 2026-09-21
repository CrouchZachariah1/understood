import { PrismaClient } from "@prisma/client";
import { SEASON_THEMES } from "../src/lib/theme/defaults";

const prisma = new PrismaClient();

const products: { slug: string; name: string; colorName: string; colorHex: string; url: string; alt: string }[] = [
  {
    slug: "niku-brief-ocean",
    name: "NIKU Brief — Navy",
    colorName: "Navy",
    colorHex: "#1E3A8A",
    url: "/products/niku-navy.png",
    alt: "NIKU navy brief with branded waistband",
  },
  {
    slug: "niku-brief-sunset",
    name: "NIKU Brief — Crimson",
    colorName: "Crimson",
    colorHex: "#C81E1E",
    url: "/products/niku-crimson.png",
    alt: "NIKU crimson brief with white pouch",
  },
  {
    slug: "niku-brief-lime",
    name: "NIKU Brief — Cyan",
    colorName: "Cyan",
    colorHex: "#22D3EE",
    url: "/products/niku-cyan.png",
    alt: "NIKU cyan brief with white pouch",
  },
  {
    slug: "niku-brief-coral",
    name: "NIKU Brief — Floral",
    colorName: "Floral Grey",
    colorHex: "#D6D3D1",
    url: "/products/niku-floral.png",
    alt: "NIKU floral print brief",
  },
  {
    slug: "niku-brief-black",
    name: "NIKU Brief — Royal",
    colorName: "Royal",
    colorHex: "#2563EB",
    url: "/products/niku-royal.png",
    alt: "NIKU royal blue mesh brief",
  },
  {
    slug: "niku-brief-tropical",
    name: "NIKU Brief — Teal",
    colorName: "Teal",
    colorHex: "#0F766E",
    url: "/products/niku-teal.png",
    alt: "NIKU teal brief with grey trim",
  },
  {
    slug: "niku-brief-stripe",
    name: "NIKU Brief — Navy Classic",
    colorName: "Navy",
    colorHex: "#1E3A8A",
    url: "/products/niku-navy.png",
    alt: "NIKU navy brief with branded waistband",
  },
];

async function main() {
  for (const item of products) {
    const product = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (!product) continue;
    await prisma.product.update({
      where: { id: product.id },
      data: { name: item.name },
    });
    await prisma.variant.updateMany({
      where: { productId: product.id },
      data: { colorName: item.colorName, colorHex: item.colorHex },
    });
    const images = await prisma.productImage.findMany({
      where: { productId: product.id },
      orderBy: { sortOrder: "asc" },
    });
    if (images[0]) {
      await prisma.productImage.update({
        where: { id: images[0].id },
        data: { url: item.url, alt: item.alt },
      });
    } else {
      await prisma.productImage.create({
        data: { productId: product.id, url: item.url, alt: item.alt, sortOrder: 0 },
      });
    }
  }

  for (const [season, pack] of Object.entries(SEASON_THEMES)) {
    await prisma.theme.updateMany({
      where: { season: season as keyof typeof SEASON_THEMES },
      data: { heroImage: pack.heroImage, campaignImage: pack.campaignImage },
    });
  }

  await prisma.collection.updateMany({ where: { slug: "everyday-basics" }, data: { imageUrl: "/products/niku-navy.png" } });
  await prisma.collection.updateMany({ where: { slug: "fresh-colours" }, data: { imageUrl: "/products/niku-crimson.png" } });
  await prisma.collection.updateMany({ where: { slug: "bold-prints" }, data: { imageUrl: "/products/niku-floral.png" } });
  await prisma.collection.updateMany({ where: { slug: "little-ones" }, data: { imageUrl: "/products/niku-cyan.png" } });
  await prisma.collection.updateMany({ where: { slug: "youth" }, data: { imageUrl: "/products/niku-royal.png" } });
  await prisma.collection.updateMany({ where: { slug: "seasonal-picks" }, data: { imageUrl: "/themes/hero-summer.jpg" } });
  await prisma.collection.updateMany({ where: { slug: "new-arrivals" }, data: { imageUrl: "/products/niku-teal.png" } });
  await prisma.collection.updateMany({ where: { slug: "multipacks" }, data: { imageUrl: "/themes/campaign-summer.jpg" } });

  console.info("Catalog and theme images updated.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
