import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const getPrismaClient = () => {
  if (!(globalThis as any).prisma) {
    (globalThis as any).prisma = prismaClientSingleton();
  }
  return (globalThis as any).prisma;
};

// Ensure type safety for `globalThis.prisma`
declare global {
  let prisma: PrismaClient | undefined; // Changed `var` to `let`
}

const prisma = getPrismaClient();

export default prisma;
