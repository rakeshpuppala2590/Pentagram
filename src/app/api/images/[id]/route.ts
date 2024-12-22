// app/api/images/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { action, comment } = await request.json();

  switch (action) {
    case "like":
      const likedImage = await prisma.image.update({
        where: { id: params.id },
        data: { likes: { increment: 1 } },
      });
      return NextResponse.json(likedImage);

    case "comment":
      const newComment = await prisma.comment.create({
        data: {
          content: comment,
          imageId: params.id,
        },
      });
      return NextResponse.json(newComment);

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
