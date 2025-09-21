import { scrapeInstagramPublic } from "@/helpers/scrape";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return Response.json({ error: "URL is required" }, { status: 400 });
  }

  // Validate Instagram URL
  if (!url.includes("instagram.com")) {
    return Response.json({ error: "Invalid Instagram URL" }, { status: 400 });
  }

  try {
    const { images, title } = await scrapeInstagramPublic(url);

    if (images.length === 0) {
      return Response.json({
        warning: "No images found. The profile might be private or the page structure changed.",
        images: [],
      });
    }

    return Response.json({
      success: true,
      count: images.length,
      images,
      title,
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      {
        error: "Failed to scrape images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
