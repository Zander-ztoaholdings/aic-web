/** The parts of lib/news that are safe in a client component: types and
 *  formatting, no CMS client. */

export type NewsKind = "article" | "policy";

export interface NewsItem {
  id: string;
  kind: NewsKind;
  slug: string;
  href: string;
  title: string;
  summary: string;
  date: string;
  topic: string;
  author: string;
  jurisdictions: string[];
}

export const KIND_LABEL: Record<NewsKind, string> = {
  article: "Analysis",
  policy: "Policy update",
};

/** Authors as they should read on the page. "AIC Team" was the CMS default
 *  for an empty Author field, so it is treated as no named author. */
export function cleanAuthor(author: string | undefined | null): string {
  const a = (author ?? "").trim();
  return !a || a === "AIC Team" ? "" : a;
}

/** The person's page, when the author is one of the founders. */
export function authorHref(author: string): string | null {
  return /zander|albert/i.test(author) ? "/about" : null;
}

/** Up to n other items, preferring the same topic, then the same kind. */
export function relatedNews(all: NewsItem[], current: { kind: NewsKind; slug: string; topic?: string }, n = 3): NewsItem[] {
  const others = all.filter((x) => !(x.kind === current.kind && x.slug === current.slug));
  const score = (x: NewsItem) => (x.topic === current.topic ? 2 : 0) + (x.kind === current.kind ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a) || (b.date || "").localeCompare(a.date || "")).slice(0, n);
}

/** "7 October 2026". Dates in the CMS are ISO days. */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Johannesburg" });
}

/** Minutes to read, at 230 words a minute, never less than one. */
export function readingMinutes(text: string): number {
  const words = (text || "").replace(/[#>*_`\[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

/** Second-level headings in a markdown body, with ids matching the ones the
 *  page renders, for a table of contents. */
export function markdownHeadings(md: string): { text: string; id: string }[] {
  return (md || "")
    .split("\n")
    .filter((l) => /^##\s+/.test(l))
    .map((l) => l.replace(/^##\s+/, "").replace(/[*_`]/g, "").trim())
    .filter(Boolean)
    .map((text) => ({ text, id: headingId(text) }));
}

export function headingId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}
