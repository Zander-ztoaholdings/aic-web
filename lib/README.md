# lib

Logic shared by pages and API routes. Each file starts with a comment saying what it is for.

| File | Does |
| --- | --- |
| `db/` | Database connection (`db.ts`) and the Drizzle schema (`schema.ts`). See [docs/DATABASE.md](../docs/DATABASE.md). |
| `standard-scoring.ts`, `scoring.ts`, `assessment.ts` | The certification scoring model and turning the standard into an assessment. |
| `registry.ts`, `registry-notice.ts` | The public register and the notice every result carries. |
| `aware-analysis.ts`, `aware-instrument.ts`, `aware-platform.ts` | AIC Aware: the question bank, the analysis, and badges read from the platform. |
| `news.ts`, `news-shared.ts`, `notion.ts` | News and articles from Notion, read as one stream. |
| `seo.ts` | Page metadata, social images and structured data helpers. |
| `analytics.ts`, `analytics-mode.ts` | Google Analytics, only after consent unless switched on by default. |
| `contact.ts` | The email addresses the site publishes. |
| `validation.ts`, `rate-limit.ts`, `secure-compare.ts` | Input checks, per-IP limits and constant-time token checks for the API. |
| `report-generator.ts` | PDF summaries. |
| `motion.ts`, `scroll.ts` | The site's motion and scroll behaviour. |
