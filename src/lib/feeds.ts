import type { NewsArticle } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const NEWS_WINDOW_HOURS = 48;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function articleUrl(article: NewsArticle): string {
  return absoluteUrl(`/news/${article.slug}`);
}

function toIsoString(date: string): string {
  return new Date(date).toISOString();
}

export function getRecentNewsArticles(
  allArticles: NewsArticle[],
  now: Date = new Date(),
): NewsArticle[] {
  const newsWindowStart = now.getTime() - NEWS_WINDOW_HOURS * 60 * 60 * 1000;
  return allArticles.filter((article) => {
    const publishedAt = new Date(article.publishedAt).getTime();
    return publishedAt >= newsWindowStart && publishedAt <= now.getTime();
  });
}

export function buildRssXml(allArticles: NewsArticle[]): string {
  const items = allArticles
    .map((article) => {
      const url = articleUrl(article);
      return [
        "<item>",
        `<title>${escapeXml(article.headline)}</title>`,
        `<description>${escapeXml(article.summary)}</description>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `<pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>`,
        "</item>",
      ].join("");
    })
    .join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "<channel>",
    `<title>${escapeXml(siteConfig.name)}</title>`,
    `<description>${escapeXml(siteConfig.description)}</description>`,
    `<link>${escapeXml(absoluteUrl("/"))}</link>`,
    items,
    "</channel>",
    "</rss>",
  ].join("");
}

export function buildSitemapXml(allArticles: NewsArticle[]): string {
  const urlEntries = [
    [
      "<url>",
      `<loc>${escapeXml(absoluteUrl("/"))}</loc>`,
      `<lastmod>${escapeXml(new Date().toISOString())}</lastmod>`,
      "<changefreq>hourly</changefreq>",
      "<priority>1.0</priority>",
      "</url>",
    ].join(""),
    ...allArticles.map((article) =>
      [
        "<url>",
        `<loc>${escapeXml(articleUrl(article))}</loc>`,
        `<lastmod>${escapeXml(toIsoString(article.updatedAt))}</lastmod>`,
        "<changefreq>daily</changefreq>",
        "<priority>0.8</priority>",
        "</url>",
      ].join(""),
    ),
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlEntries,
    "</urlset>",
  ].join("");
}

export function buildNewsSitemapXml(allArticles: NewsArticle[], now: Date = new Date()): string {
  const urlEntries = getRecentNewsArticles(allArticles, now).map((article) =>
    [
      "<url>",
      `<loc>${escapeXml(articleUrl(article))}</loc>`,
      "<news:news>",
      "<news:publication>",
      `<news:name>${escapeXml(siteConfig.name)}</news:name>`,
      `<news:language>${escapeXml(siteConfig.language)}</news:language>`,
      "</news:publication>",
      `<news:publication_date>${escapeXml(toIsoString(article.publishedAt))}</news:publication_date>`,
      `<news:title>${escapeXml(article.headline)}</news:title>`,
      "</news:news>",
      "</url>",
    ].join(""),
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    ...urlEntries,
    "</urlset>",
  ].join("");
}
