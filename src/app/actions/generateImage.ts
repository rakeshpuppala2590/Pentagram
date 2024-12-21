"use server";
export async function generateImage(text: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/generate-image`, {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.API_KEY || "",
        "content-type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
