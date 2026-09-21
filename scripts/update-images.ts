import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const imageSwaps: [string, string][] = [
  ["/products/niku-lime.jpg", "/products/niku-lime-2.jpg"],
  ["/products/niku-coral.jpg", "/products/niku-coral-2.jpg"],
  ["/products/niku-tropical.jpg", "/products/niku-tropical-2.jpg"],
  ["/products/niku-stripe.jpg", "/products/niku-stripe-2.jpg"],
];

const collectionImages: Record<string, string> = {
  "everyday-basics": "/products/niku-black.jpg",
  "fresh-colours": "/products/niku-lime-2.jpg",
  "bold-prints": "/products/niku-tropical-2.jpg",
  "little-ones": "/themes/age-toddler.jpg",
  youth: "/themes/age-youth.jpg",
  "seasonal-picks": "/themes/summer-v2.jpg",
  "new-arrivals": "/products/niku-stripe-2.jpg",
  multipacks: "/themes/summer-v2.jpg",
};

async function main() {
  for (const [from, to] of imageSwaps) {
    const result = await prisma.productImage.updateMany({
      where: { url: from },
      data: { url: to },
    });
    console.info(`images ${from} -> ${to} (${result.count})`);
  }

  await prisma.theme.updateMany({
    where: { season: "SUMMER" },
    data: { heroImage: "/themes/summer-v2.jpg" },
  });
  await prisma.theme.updateMany({
    where: { season: "SPRING" },
    data: { heroImage: "/themes/spring-v2.jpg" },
  });
  await prisma.theme.updateMany({
    where: { season: "AUTUMN" },
    data: { heroImage: "/themes/autumn-v2.jpg" },
  });
  await prisma.theme.updateMany({
    where: { season: "WINTER" },
    data: { heroImage: "/themes/winter-v2.jpg" },
  });
  await prisma.theme.updateMany({
    where: { season: "CUSTOM" },
    data: { heroImage: "/themes/summer-v2.jpg" },
  });

  for (const [slug, imageUrl] of Object.entries(collectionImages)) {
    await prisma.collection.updateMany({ where: { slug }, data: { imageUrl } });
  }

  await prisma.campaign.updateMany({
    where: { slug: "summer-understood" },
    data: { heroUrl: "/themes/summer-v2.jpg" },
  });

  console.info("Image paths updated.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
