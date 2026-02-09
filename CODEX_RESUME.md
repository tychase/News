# CODEX Resume Notes

Last updated: 2026-02-09

## Current Repo State

- CWD: `C:\Users\tmcha\Dev\NewsSite`
- Branch: `codex/news-aggregator-seo-feeds-ci`
- Working tree: clean
- Remote: `origin https://github.com/tychase/News.git`

## PR Status

- PR: `https://github.com/tychase/News/pull/1`
- Title: `[codex] implement news aggregator seo feeds metadata and ci`
- Draft: `true`
- Base: `master`
- Head: `codex/news-aggregator-seo-feeds-ci`
- Latest checks: all passing (`lint-and-test`, `playwright`)

## What Is Already Implemented

- News aggregator baseline:
  - canonical URLs
  - `/rss.xml`
  - `/sitemap.xml`
  - `/sitemap_news.xml` (last 48 hours)
  - NewsArticle JSON-LD
  - OG/Twitter metadata
- Markdown-backed article system:
  - content in `content/news/*.md`
  - frontmatter fields: `headline`, `summary`, `takeaways`, `published`, `updated`, `sources`, etc.
- Optional AI/trust metadata parsing (non-breaking):
  - `story_id`, `topic`, `tags`, `geo`, `signals`, `confidence`, `generated_at`, `version`, `models`, `disclosure`, `claims`, `corrections`
- Article page rendering additions:
  - disclosure (if present)
  - Claim-to-source section (if claims exist)
  - Sources & Methodology section
- Trust page:
  - `/trust` with sections: How we work, Sources, AI disclosure, Corrections, Independence
- Global nav includes link to `/trust`.

## Auth / Tooling State

- GitHub CLI binary used in this repo: `.\.tools\gh286\bin\gh.exe`
- GitHub auth: logged in as `tychase`
- Vercel auth: logged in as `tmcmail6-5545`
- Last verified preview URL:
  - `https://newssite-b185i2d2x-tyler-chases-projects.vercel.app`
  - endpoints returned `200` for RSS/sitemaps/article route

## Fast Resume Commands

```powershell
cd C:\Users\tmcha\Dev\NewsSite
git checkout codex/news-aggregator-seo-feeds-ci
git pull
npm install
npm run lint
npm test
npm run test:e2e
.\.tools\gh286\bin\gh.exe pr checks 1
```

## Deploy + Verify (If Needed)

```powershell
vercel deploy -y --public
$env:PLAYWRIGHT_BASE_URL='https://<preview-url>'
npm run test:e2e
```

## Likely Next Actions

- Update PR title/body if desired to mention trust + AI metadata changes.
- Mark draft PR ready when final review is complete:
  - `.\.tools\gh286\bin\gh.exe pr ready 1`
