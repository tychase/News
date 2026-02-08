import { getAllArticles } from "@/lib/articles";
import { buildSitemapXml } from "@/lib/feeds";

export const revalidate = 300;

export async function GET() {
  return new Response(buildSitemapXml(getAllArticles()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
