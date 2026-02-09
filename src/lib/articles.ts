import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type NewsSource = {
  name: string;
  url: string;
  note?: string;
};

export type NewsClaim = {
  claim: string;
  sourceName?: string;
  sourceUrl?: string;
};

export type NewsArticle = {
  slug: string;
  headline: string;
  summary: string;
  takeaways: string[];
  body: string[];
  sources: NewsSource[];
  section: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  storyId?: string;
  topic?: string;
  tags?: string[];
  geo?: string[];
  signals?: string[];
  confidence?: number;
  generatedAt?: string;
  version?: string;
  models?: string[];
  disclosure?: string;
  claims?: NewsClaim[];
  corrections?: string[];
};

type Frontmatter = {
  headline?: unknown;
  summary?: unknown;
  takeaways?: unknown;
  published?: unknown;
  updated?: unknown;
  sources?: unknown;
  section?: unknown;
  author?: unknown;
  story_id?: unknown;
  storyId?: unknown;
  topic?: unknown;
  tags?: unknown;
  geo?: unknown;
  signals?: unknown;
  confidence?: unknown;
  generated_at?: unknown;
  generatedAt?: unknown;
  version?: unknown;
  models?: unknown;
  disclosure?: unknown;
  claims?: unknown;
  corrections?: unknown;
};

const newsDirectory = path.join(process.cwd(), "content", "news");

function assertString(value: unknown, fieldName: string, filePath: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid "${fieldName}" in ${filePath}. Expected non-empty string.`);
  }

  return value.trim();
}

function parseDate(value: unknown, fieldName: string, filePath: string): string {
  const isoInput = assertString(value, fieldName, filePath);
  const parsed = new Date(isoInput);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid "${fieldName}" date in ${filePath}: ${isoInput}`);
  }

  return parsed.toISOString();
}

function parseOptionalString(value: unknown, fieldName: string, filePath: string): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return assertString(value, fieldName, filePath);
}

function parseOptionalDate(value: unknown, fieldName: string, filePath: string): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return parseDate(value, fieldName, filePath);
}

function parseTakeaways(value: unknown, filePath: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Invalid "takeaways" in ${filePath}. Expected a non-empty list.`);
  }

  return value.map((item, index) =>
    assertString(item, `takeaways[${index}]`, filePath),
  );
}

function parseOptionalStringList(
  value: unknown,
  fieldName: string,
  filePath: string,
): string[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "string") {
    return [assertString(value, fieldName, filePath)];
  }

  if (!Array.isArray(value)) {
    throw new Error(`Invalid "${fieldName}" in ${filePath}. Expected a string or list.`);
  }

  return value.map((item, index) => assertString(item, `${fieldName}[${index}]`, filePath));
}

function parseOptionalNumber(value: unknown, fieldName: string, filePath: string): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  throw new Error(`Invalid "${fieldName}" in ${filePath}. Expected a finite number.`);
}

function parseSources(value: unknown, filePath: string): NewsSource[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Invalid "sources" in ${filePath}. Expected a non-empty list.`);
  }

  return value.map((item, index) => {
    if (typeof item !== "object" || item === null) {
      throw new Error(`Invalid source at index ${index} in ${filePath}.`);
    }

    const source = item as Record<string, unknown>;
    const name = assertString(source.name, `sources[${index}].name`, filePath);
    const url = assertString(source.url, `sources[${index}].url`, filePath);
    const note = source.note ? assertString(source.note, `sources[${index}].note`, filePath) : undefined;

    return { name, url, note };
  });
}

function parseClaims(value: unknown, filePath: string): NewsClaim[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new Error(`Invalid "claims" in ${filePath}. Expected a list.`);
  }

  return value.map((item, index) => {
    if (typeof item === "string") {
      return { claim: assertString(item, `claims[${index}]`, filePath) };
    }

    if (typeof item !== "object" || item === null) {
      throw new Error(`Invalid claim at index ${index} in ${filePath}.`);
    }

    const claim = item as Record<string, unknown>;
    const claimText = assertString(
      claim.claim ?? claim.text,
      `claims[${index}].claim`,
      filePath,
    );

    const sourceValue = parseOptionalString(claim.source, `claims[${index}].source`, filePath);
    let sourceName = parseOptionalString(
      claim.source_name ?? claim.sourceName,
      `claims[${index}].source_name`,
      filePath,
    );
    let sourceUrl = parseOptionalString(
      claim.source_url ?? claim.sourceUrl,
      `claims[${index}].source_url`,
      filePath,
    );

    if (sourceValue) {
      if (/^https?:\/\//i.test(sourceValue)) {
        sourceUrl = sourceUrl ?? sourceValue;
      } else {
        sourceName = sourceName ?? sourceValue;
      }
    }

    return { claim: claimText, sourceName, sourceUrl };
  });
}

function slugFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/i, "");
}

function toParagraphs(markdownContent: string): string[] {
  return markdownContent
    .split(/\r?\n\s*\r?\n/g)
    .map((paragraph) => paragraph.replace(/\r?\n/g, " ").trim())
    .filter((paragraph) => paragraph.length > 0);
}

function parseArticleFromFile(filePath: string): NewsArticle {
  const rawFile = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(rawFile);
  const frontmatter = data as Frontmatter;

  const headline = assertString(frontmatter.headline, "headline", filePath);
  const summary = assertString(frontmatter.summary, "summary", filePath);
  const takeaways = parseTakeaways(frontmatter.takeaways, filePath);
  const sources = parseSources(frontmatter.sources, filePath);
  const publishedAt = parseDate(frontmatter.published, "published", filePath);
  const updatedAt = frontmatter.updated
    ? parseDate(frontmatter.updated, "updated", filePath)
    : publishedAt;
  const storyId = parseOptionalString(frontmatter.story_id ?? frontmatter.storyId, "story_id", filePath);
  const topic = parseOptionalString(frontmatter.topic, "topic", filePath);
  const tags = parseOptionalStringList(frontmatter.tags, "tags", filePath);
  const geo = parseOptionalStringList(frontmatter.geo, "geo", filePath);
  const signals = parseOptionalStringList(frontmatter.signals, "signals", filePath);
  const confidence = parseOptionalNumber(frontmatter.confidence, "confidence", filePath);
  const generatedAt = parseOptionalDate(
    frontmatter.generated_at ?? frontmatter.generatedAt,
    "generated_at",
    filePath,
  );
  const version = parseOptionalString(frontmatter.version, "version", filePath);
  const models = parseOptionalStringList(frontmatter.models, "models", filePath);
  const disclosure = parseOptionalString(frontmatter.disclosure, "disclosure", filePath);
  const claims = parseClaims(frontmatter.claims, filePath);
  const corrections = parseOptionalStringList(frontmatter.corrections, "corrections", filePath);

  const body = toParagraphs(content);
  if (body.length === 0) {
    throw new Error(`Missing article body in ${filePath}.`);
  }

  return {
    slug: slugFromFileName(path.basename(filePath)),
    headline,
    summary,
    takeaways,
    body,
    sources,
    section: frontmatter.section
      ? assertString(frontmatter.section, "section", filePath)
      : "News",
    author: frontmatter.author ? assertString(frontmatter.author, "author", filePath) : "Metro Wire Staff",
    publishedAt,
    updatedAt,
    storyId,
    topic,
    tags,
    geo,
    signals,
    confidence,
    generatedAt,
    version,
    models,
    disclosure,
    claims,
    corrections,
  };
}

export function getAllArticles(): NewsArticle[] {
  if (!fs.existsSync(newsDirectory)) {
    return [];
  }

  const files = fs
    .readdirSync(newsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .sort();

  const loadedArticles = files.map((fileName) =>
    parseArticleFromFile(path.join(newsDirectory, fileName)),
  );

  return loadedArticles.sort(
    (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}
