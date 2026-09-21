import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  const log = process.env.NODE_ENV === "development" ? (["error", "warn"] as const) : (["error"] as const);
  if (connectionString?.startsWith("postgres")) {
    return new PrismaClient({
      adapter: new PrismaNeon({ connectionString }),
      log: [...log],
    });
  }
  return new PrismaClient({ log: [...log] });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
