export type NewsArticle = {
  slug: string;
  title: string;
  description: string;
  body: string[];
  section: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
};

const now = Date.now();

export const articles: NewsArticle[] = [
  {
    slug: "city-council-approves-riverfront-housing",
    title: "City Council Approves Riverfront Housing Plan",
    description:
      "A revised proposal adds transit funding and flood-resilience requirements for the downtown riverfront district.",
    body: [
      "City officials approved a multi-phase housing plan for the riverfront corridor after months of hearings with neighborhood groups and business owners.",
      "The final package ties new permits to transit access milestones, flood-resilience benchmarks, and affordable housing targets that will be reviewed quarterly.",
      "Planning staff said construction could begin this spring if state transportation grants are finalized on schedule.",
    ],
    section: "Local",
    author: "Avery Nelson",
    publishedAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    slug: "state-budget-talks-enter-final-week",
    title: "State Budget Talks Enter Final Week of Negotiations",
    description:
      "Lawmakers say education and wildfire response remain the two largest unresolved line items.",
    body: [
      "Legislative leaders entered the final week of budget negotiations with unresolved disagreements on school funding formulas and emergency response reserves.",
      "Committee aides said both chambers narrowed most agency allocations, but a long-term wildfire mitigation package is still under debate.",
      "A floor vote is expected before the statutory deadline, with procedural sessions scheduled through the weekend.",
    ],
    section: "Politics",
    author: "Jordan Patel",
    publishedAt: new Date(now - 27 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    slug: "regional-health-system-opens-new-clinic",
    title: "Regional Health System Opens New Community Clinic",
    description:
      "The clinic expands after-hours pediatric care and bilingual telehealth appointments in the north county area.",
    body: [
      "Regional Health System opened a new community clinic intended to reduce emergency room pressure during winter respiratory surges.",
      "Administrators said the site offers after-hours pediatric services, same-day telehealth, and expanded interpretation support.",
      "Public health officials said the clinic is part of a broader access strategy launched earlier this quarter.",
    ],
    section: "Health",
    author: "Samira Chen",
    publishedAt: new Date(now - 72 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 70 * 60 * 60 * 1000).toISOString(),
  },
];

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return articles.find((article) => article.slug === slug);
}
