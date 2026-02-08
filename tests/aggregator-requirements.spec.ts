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

  await expect(page.getByRole("heading", { name: "Key Takeaways" })).toHaveCount(1);
  await expect(page.getByText("Disclosure:")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Claim-to-source" })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Sources & Methodology" })).toHaveCount(1);
});

test("homepage header links to trust page with required sections", async ({ page }) => {
  await page.goto("/");

  const trustLink = page.getByRole("link", { name: "Trust & Methodology" }).first();
  await expect(trustLink).toHaveAttribute("href", "/trust");
  await trustLink.click();

  await expect(page.getByRole("heading", { name: "Trust & Methodology" })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "How we work" })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Sources" })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "AI disclosure" })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Corrections" })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Independence" })).toHaveCount(1);
});
