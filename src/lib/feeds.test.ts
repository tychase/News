import type { NewsArticle } from "@/lib/articles";
import { buildNewsSitemapXml, buildRssXml, NEWS_WINDOW_HOURS } from "@/lib/feeds";

function makeArticle(slug: string, hoursAgo: number, now: Date): NewsArticle {
  const published = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();
  return {
    slug,
    title: `Title ${slug}`,
    description: `Description ${slug}`,
    body: ["paragraph"],
    section: "Local",
    author: "Reporter",
    publishedAt: published,
    updatedAt: published,
  };
}

describe("feed xml builders", () => {
  it("includes absolute canonical article links in rss", () => {
    const xml = buildRssXml([makeArticle("one", 2, new Date("2026-02-07T12:00:00Z"))]);
    expect(xml).toContain("<rss version=\"2.0\">");
    expect(xml).toContain("<link>https://example.com/news/one</link>");
    expect(xml).toContain("<guid isPermaLink=\"true\">https://example.com/news/one</guid>");
  });

  it("limits news sitemap to the last 48 hours", () => {
    const now = new Date("2026-02-07T12:00:00Z");
    const recent = makeArticle("recent", 6, now);
    const boundary = makeArticle("boundary", NEWS_WINDOW_HOURS, now);
    const older = makeArticle("older", NEWS_WINDOW_HOURS + 1, now);

    const xml = buildNewsSitemapXml([recent, boundary, older], now);

    expect(xml).toContain("news:news");
    expect(xml).toContain("/news/recent");
    expect(xml).toContain("/news/boundary");
    expect(xml).not.toContain("/news/older");
  });
});
