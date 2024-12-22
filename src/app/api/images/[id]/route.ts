import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { action, comment } = await request.json();

  switch (action) {
    case "like":
      try {
        const likedImage = await prisma.image.update({
          where: { id },
          data: { likes: { increment: 1 } },
        });
        return NextResponse.json(likedImage);
      } catch {
        return NextResponse.json(
          { error: "Error liking image" },
          { status: 500 }
        );
      }

    case "comment":
      try {
        const newComment = await prisma.comment.create({
          data: {
            content: comment,
            imageId: id,
          },
        });
        return NextResponse.json(newComment);
      } catch {
        return NextResponse.json(
          { error: "Error adding comment" },
          { status: 500 }
        );
      }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
