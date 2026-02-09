import { getAllArticles } from "@/lib/articles";
import { buildRssXml } from "@/lib/feeds";

export const revalidate = 300;

export async function GET() {
  return new Response(buildRssXml(getAllArticles()), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
