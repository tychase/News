import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { buildNewsArticleJsonLd } from "@/lib/structured-data";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
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
    title: article.headline,
    description: article.summary,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: article.headline,
      description: article.summary,
      type: "article",
      url: canonicalUrl,
      siteName: siteConfig.name,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.headline,
      description: article.summary,
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
        <h1 className="article-title">{article.headline}</h1>
        <p className="lede">{article.summary}</p>
        <p className="timestamp">
          By {article.author} | Published{" "}
          {new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "UTC" })} UTC
        </p>

        <section className="article-subsection">
          <h2>Key Takeaways</h2>
          <ul className="bullet-list">
            {article.takeaways.map((takeaway) => (
              <li key={takeaway}>{takeaway}</li>
            ))}
          </ul>
        </section>

        <div className="article-body">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <section className="article-subsection">
          <h2>Sources &amp; Methodology</h2>
          <ul className="bullet-list">
            {article.sources.map((source) => (
              <li key={`${source.name}-${source.url}`}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.name}
                </a>
                {source.note ? `: ${source.note}` : ""}
              </li>
            ))}
          </ul>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
