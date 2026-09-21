import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

function createClient() {
  const connectionString = process.env.DATABASE_URL ?? "";
  const log = process.env.NODE_ENV === "development" ? (["error", "warn"] as const) : (["error"] as const);
  if (connectionString.startsWith("postgres")) {
    return new PrismaClient({
      adapter: new PrismaNeon({ connectionString }),
      log: [...log],
    });
  }
  return new PrismaClient({ log: [...log] });
}

export const getPrisma = cache(createClient);

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, _receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
