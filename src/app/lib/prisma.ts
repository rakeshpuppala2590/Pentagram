import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const getPrismaClient = () => {
  if (!globalThis.prisma) {
    globalThis.prisma = prismaClientSingleton();
  }
  return globalThis.prisma;
};

// Ensure type safety for `globalThis.prisma`
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = getPrismaClient();

export default prisma;
