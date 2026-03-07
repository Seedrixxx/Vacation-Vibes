import { PrismaClient } from "@prisma/client";
import { runSeed } from "../lib/trip-builder/seed";

const prisma = new PrismaClient();

runSeed(prisma)
  .then((result) => {
    console.log("Trip builder seed result:", result);
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error("Seed failed:", e);
    prisma.$disconnect();
    process.exit(1);
  });
