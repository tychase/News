import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ArticlePage, { generateMetadata } from "@/app/news/[slug]/page";

const firstSlug = "city-council-approves-riverfront-housing";

describe("article page metadata", () => {
  it("sets canonical, og, and twitter metadata on article pages", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: firstSlug }),
    });

    expect(metadata.alternates?.canonical).toBe(`/news/${firstSlug}`);
    expect(metadata.openGraph?.type).toBe("article");
    expect(metadata.openGraph?.url).toBe(`https://example.com/news/${firstSlug}`);
    expect(metadata.twitter?.card).toBe("summary_large_image");
  });

  it("renders NewsArticle JSON-LD on article page", async () => {
    const element = await ArticlePage({
      params: Promise.resolve({ slug: firstSlug }),
    });
    const html = renderToStaticMarkup(element);

    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('"@type":"NewsArticle"');
    expect(html).toContain(`"url":"https://example.com/news/${firstSlug}"`);
    expect(html).toContain("Key Takeaways");
    expect(html).toContain("Disclosure:");
    expect(html).toContain("Claim-to-source");
    expect(html).toContain("Sources &amp; Methodology");
  });
});
