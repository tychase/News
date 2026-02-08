import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust & Methodology",
  alternates: {
    canonical: "/trust",
  },
};

export default function TrustPage() {
  return (
    <main className="container">
      <article className="article-page trust-page">
        <h1 className="article-title">Trust &amp; Methodology</h1>

        <section className="article-subsection">
          <h2>How we work</h2>
          <p>
            We publish explainers and reported updates using a mix of staff reporting, public
            records review, and structured verification checks before publication.
          </p>
        </section>

        <section className="article-subsection">
          <h2>Sources</h2>
          <p>
            Every story includes named source material in a Sources &amp; Methodology section so
            readers can inspect the basis for major factual statements.
          </p>
        </section>

        <section className="article-subsection">
          <h2>AI disclosure</h2>
          <p>
            We disclose AI-assisted drafting or analysis when used. Editorial staff review outputs
            before publication and remain accountable for final copy.
          </p>
        </section>

        <section className="article-subsection">
          <h2>Corrections</h2>
          <p>
            If we identify an error, we correct it promptly and document the change in the article
            correction log.
          </p>
        </section>

        <section className="article-subsection">
          <h2>Independence</h2>
          <p>
            Editorial decisions are independent from advertisers, sponsors, and platform partners.
            We do not sell favorable coverage.
          </p>
        </section>
      </article>
    </main>
  );
}
