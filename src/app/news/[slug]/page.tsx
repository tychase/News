import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { buildNewsArticleJsonLd } from "@/lib/structured-data";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Not Found",
      description: "Article not found",
    };
  }

  const canonicalPath = `/news/${article.slug}`;
  const canonicalUrl = absoluteUrl(canonicalPath);

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: canonicalUrl,
      siteName: siteConfig.name,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const jsonLd = buildNewsArticleJsonLd(article);

  return (
    <main className="container">
      <article className="article-page">
        <p className="kicker">{article.section}</p>
        <h1 className="article-title">{article.title}</h1>
        <p className="lede">{article.description}</p>
        <p className="timestamp">
          By {article.author} | Published{" "}
          {new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "UTC" })} UTC
        </p>

        <div className="article-body">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}

