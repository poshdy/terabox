import { PrismaClient } from "@/lib/generated/prisma";

const globalForPrisma = global as unknown as { db: PrismaClient };

export const db =
  globalForPrisma.db || new PrismaClient({ log: ["info", "error", "warn"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}
