import { MetadataRoute } from "next";
import { getArticles, getPolicyUpdateSlugs } from "@/lib/notion";

// Async because the editorial routes are driven by the CMS. Previously this
// listed only static routes, so no article or policy update was ever submitted
// for indexing — the pages existed and nothing pointed search engines at them.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://aiccertified.cloud";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/governance-hub`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/disclosures`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/registry`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/regulatory-map`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/verify`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/certification`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/insurers`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/frameworks`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/frameworks/process-industry`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/frameworks/financial-services`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/frameworks/medical-devices`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/workshops`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/policy`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // A CMS outage must not empty the sitemap: getArticles returns null when it
  // cannot reach Notion, and dropping every editorial URL from the sitemap on a
  // transient failure is worse than briefly omitting a new one. Static routes
  // are returned regardless.
  const [articlesData, policySlugs] = await Promise.all([
    getArticles(100).catch(() => null),
    getPolicyUpdateSlugs().catch(() => [] as string[]),
  ]);

  const articleRoutes: MetadataRoute.Sitemap = (articlesData?.results ?? [])
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${base}/articles/${a.slug}`,
      lastModified: a.date ? new Date(a.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  const policyRoutes: MetadataRoute.Sitemap = policySlugs.map((slug) => ({
    url: `${base}/policy/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...articleRoutes, ...policyRoutes];
}
