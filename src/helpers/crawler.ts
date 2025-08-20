// src/lib/crawler.ts
import * as cheerio from "cheerio";
import axios from 'axios';
import { URL } from "url";

export async function crawlWebsite(startUrl: string, maxPages = 50) {
  const visited = new Set<string>();
  const pages: { url: string; text: string }[] = [];

  async function crawl(url: string) {
    if (visited.size >= maxPages || visited.has(url)) return;
    visited.add(url);

    try {
      const res = await axios.get(url,{timeout:10000});
      const $ = cheerio.load(res.data);

      const text = $("body").text().replace(/\s+/g, " ").trim();
      pages.push({ url, text });
      const base = new URL(startUrl);
      $("a[href]").each((_, el) => {
        const link = $(el).attr("href");
        if (!link) return;

        try {
          const absolute = new URL(link, base).toString();
          if (absolute.startsWith(base.origin)) {
            crawl(absolute);
          }
        } catch {}
      });
    } catch (err) {
      console.error("Failed to fetch:", url, err);
    }
  }

  await crawl(startUrl);
  return pages;
}
