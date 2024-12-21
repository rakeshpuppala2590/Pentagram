import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;
    const url = new URL(
      "https://rakeshpuppala2591--example-text-to-image-stablediffusion-da8a9a.modal.run"
    );
    url.searchParams.set("prompt", text);
    console.log("URL", url.toString());
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.API_KEY || "",
        Accept: "image/jpeg",
      },
    });

    console.log("Response", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Failed to generate image: ${errorText}`);
    }

    const imageBuffer = await response.arrayBuffer();

    const filename = `${crypto.randomUUID()}.jpg`;

    const blob = await put(filename, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    return NextResponse.json({ success: true, imageUrl: blob.url });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
}
