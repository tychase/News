import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Home",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const articles = getAllArticles();

  return (
    <main className="container">
      <header className="hero">
        <p className="eyebrow">Metro Wire</p>
        <h1 className="headline">Independent reporting for people who need facts fast.</h1>
        <p className="lede">
          Daily coverage of local policy, health systems, and economic shifts that shape regional
          life.
        </p>
      </header>

      <section className="article-list" aria-label="Latest stories">
        {articles.map((article) => (
          <article key={article.slug} className="article-card">
            <p className="kicker">{article.section}</p>
            <h2>
              <Link href={`/news/${article.slug}`}>{article.headline}</Link>
            </h2>
            <p>{article.summary}</p>
            <p className="timestamp">
              Published {new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "UTC" })}{" "}
              UTC
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
