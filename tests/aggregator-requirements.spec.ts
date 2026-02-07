import { expect, test } from "@playwright/test";

const articleSlug = "city-council-approves-riverfront-housing";

test("rss feed is reachable and includes items", async ({ request }) => {
  const response = await request.get("/rss.xml");
  const text = await response.text();

  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/rss+xml");
  expect(text).toContain("<rss version=\"2.0\">");
  expect(text).toContain("<item>");
});

test("general sitemap is reachable and includes article URLs", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  const text = await response.text();

  expect(response.ok()).toBeTruthy();
  expect(text).toContain("<urlset");
  expect(text).toContain("/news/");
});

test("google news sitemap is reachable and contains news namespace", async ({ request }) => {
  const response = await request.get("/sitemap_news.xml");
  const text = await response.text();

  expect(response.ok()).toBeTruthy();
  expect(text).toContain("xmlns:news=\"http://www.google.com/schemas/sitemap-news/0.9\"");
  expect(text).toContain("<news:news>");
});

test("article page has canonical, json-ld, og, and twitter metadata", async ({ page }) => {
  await page.goto(`/news/${articleSlug}`);

  await expect(page.locator("link[rel='canonical']")).toHaveAttribute(
    "href",
    new RegExp(`/news/${articleSlug}$`),
  );
  await expect(page.locator("meta[property='og:type']")).toHaveAttribute("content", "article");
  await expect(page.locator("meta[property='og:title']")).toHaveCount(1);
  await expect(page.locator("meta[name='twitter:card']")).toHaveAttribute(
    "content",
    "summary_large_image",
  );

  const jsonLd = page.locator("script[type='application/ld+json']");
  await expect(jsonLd).toHaveCount(1);
  const jsonLdText = await jsonLd.first().textContent();
  expect(jsonLdText).toContain("\"@type\":\"NewsArticle\"");
});
