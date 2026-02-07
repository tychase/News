import type { NewsArticle } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function buildNewsArticleJsonLd(article: NewsArticle) {
  const url = absoluteUrl(`/news/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    articleSection: article.section,
    url,
  };
}

