import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = (): PrismaClient => {
  return new PrismaClient();
};

const getPrismaClient = (): PrismaClient => {
  if (!globalThis.prisma) {
    globalThis.prisma = prismaClientSingleton();
  }
  return globalThis.prisma;
};

// Ensure type safety for `globalThis.prisma`
declare global {
  var prisma: PrismaClient | undefined; // Use `var` to declare on globalThis
}

const prisma = getPrismaClient();

export default prisma;
