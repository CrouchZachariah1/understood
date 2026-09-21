import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const rows = await prisma.theme.findMany({
  select: { season: true, label: true, published: true, heroImage: true },
});
console.log(JSON.stringify(rows, null, 2));
await prisma.$disconnect();
