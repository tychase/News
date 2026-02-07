export const siteConfig = {
  name: "Metro Wire",
  description: "Metro Wire is a fast local newsroom covering policy, business, and community reporting.",
  language: "en",
  locale: "en_US",
};

const defaultSiteUrl = "https://example.com";

export function getSiteUrl(): string {
  const rawValue = process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl;
  return rawValue.endsWith("/") ? rawValue.slice(0, -1) : rawValue;
}

export function absoluteUrl(path: string): string {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

