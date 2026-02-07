import { GET as rssGet } from "@/app/rss.xml/route";
import { GET as sitemapGet } from "@/app/sitemap.xml/route";
import { GET as sitemapNewsGet } from "@/app/sitemap_news.xml/route";

describe("feed and sitemap routes", () => {
  it("serves /rss.xml with rss content type and channel items", async () => {
    const response = await rssGet();
    const xml = await response.text();

    expect(response.headers.get("content-type")).toContain("application/rss+xml");
    expect(xml).toContain("<rss version=\"2.0\">");
    expect(xml).toContain("<item>");
  });

  it("serves /sitemap.xml with urlset and article links", async () => {
    const response = await sitemapGet();
    const xml = await response.text();

    expect(response.headers.get("content-type")).toContain("application/xml");
    expect(xml).toContain("<urlset");
    expect(xml).toContain("/news/");
  });

  it("serves /sitemap_news.xml with Google News tags", async () => {
    const response = await sitemapNewsGet();
    const xml = await response.text();

    expect(response.headers.get("content-type")).toContain("application/xml");
    expect(xml).toContain("xmlns:news=\"http://www.google.com/schemas/sitemap-news/0.9\"");
    expect(xml).toContain("<news:news>");
  });
});

