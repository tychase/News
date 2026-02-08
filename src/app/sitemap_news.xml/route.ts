import { getAllArticles } from "@/lib/articles";
import { buildNewsSitemapXml } from "@/lib/feeds";

export const revalidate = 300;

export async function GET() {
  return new Response(buildNewsSitemapXml(getAllArticles(), new Date()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
