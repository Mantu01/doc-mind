import { crawlWebsite } from "@/helpers/crawler";
import { DocumentIndexer } from "@/helpers/indexing";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url, apiKey } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing URL" },
        { status: 400 }
      );
    }

    const pages = await crawlWebsite(url, 50);
    if (!pages.length) {
      return NextResponse.json(
        { error: "No pages found while crawling" },
        { status: 404 }
      );
    }
    const textContent = pages.map(page => `URL: ${page.url}\n\n${page.text}`).join("\n\n---\n\n") // separator between pages
    console.log(textContent)
    const indexer = new DocumentIndexer({
      apiKey,
      textContent,
    });
    await indexer.run();

    return NextResponse.json({
      message: "Website indexed successfully",
    });
  } catch (error) {
    console.error("❌ Error in /api/crawl:", error || error);

    return NextResponse.json(
      {
        error: "Failed to crawl and index website",
        details: error || String(error),
      },
      { status: 500 }
    );
  }
}
