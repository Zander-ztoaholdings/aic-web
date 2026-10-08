import { getArticles, getPolicyUpdates } from "@/lib/notion";

/**
 * News: articles and policy updates read as one stream.
 *
 * They were two separate sections with two different looks, and a reader had
 * to know AIC's internal distinction (analysis versus a dated development) to
 * find anything. The hub lists both, newest first, and lets the reader narrow
 * by kind or topic. Topics come from the content itself, so a filter never
 * leads to an empty list.
 */

import { cleanAuthor, type NewsItem } from "@/lib/news-shared";
export * from "@/lib/news-shared";

/** Null when the CMS cannot be reached; an empty list when it is reachable
 *  and has nothing published. Duplicates (the same slug published twice) are
 *  dropped, keeping the newest. */
export async function getNews(): Promise<NewsItem[] | null> {
  const [a, p] = await Promise.all([
    getArticles(100).catch(() => null),
    getPolicyUpdates(100).catch(() => null),
  ]);
  if (a === null && p === null) return null;

  const items: NewsItem[] = [
    ...(a?.results ?? []).filter((x) => x.slug).map((x) => ({
      id: x.id,
      kind: "article" as const,
      slug: x.slug,
      href: `/articles/${x.slug}`,
      title: x.title,
      summary: x.excerpt,
      date: x.date,
      topic: x.category === "Uncategorized" ? "AI governance" : x.category,
      author: cleanAuthor(x.author),
      jurisdictions: [],
    })),
    ...(p?.results ?? []).filter((x) => x.slug).map((x) => ({
      id: x.id,
      kind: "policy" as const,
      slug: x.slug,
      href: `/policy/${x.slug}`,
      title: x.title,
      summary: x.summary,
      date: x.date,
      topic: x.tag === "Update" ? "Regulatory" : x.tag,
      author: "",
      jurisdictions: x.jurisdictions,
    })),
  ];

  const seen = new Set<string>();
  return items
    .sort((x, y) => (y.date || "").localeCompare(x.date || ""))
    .filter((x) => {
      const key = `${x.kind}:${x.slug}`;
      const titleKey = x.title.trim().toLowerCase();
      if (seen.has(key) || seen.has(titleKey)) return false;
      seen.add(key);
      seen.add(titleKey);
      return true;
    });
}

