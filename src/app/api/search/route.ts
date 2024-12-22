// app/api/search/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  const images = await prisma.image.findMany({
    where: {
      prompt: {
        contains: query,
        mode: "insensitive",
      },
    },
    include: {
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ images });
}
