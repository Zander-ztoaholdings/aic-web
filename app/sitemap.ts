import { MetadataRoute } from "next";
import { getNews } from "@/lib/news";
import { GUIDES } from "@/app/data/guides";
import { allJurisdictions } from "@/app/data/regulatory-data";

// Async because the editorial routes are driven by the CMS. Previously this
// listed only static routes, so no article or policy update was ever submitted
// for indexing — the pages existed and nothing pointed search engines at them.
// Rebuilt hourly so new posts reach the sitemap without a deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://aiccertified.cloud";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/governance-hub`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/disclosures`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/impartiality`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/registry`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/aware`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/aware/directory`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/aware/badge-rules`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/regulatory-map`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/verify`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/certification`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/standard`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/intake`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/platform`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/insurers`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/frameworks`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/frameworks/process-industry`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/frameworks/financial-services`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/frameworks/medical-devices`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/workshops`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/news`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/glossary`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/policy`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/security`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // A CMS outage must not empty the sitemap: getNews returns null when it
  // cannot reach Notion, and dropping every editorial URL on a transient
  // failure is worse than briefly omitting a new one. lastModified is each
  // item's own date, so a crawler is told when content actually changed.
  const news = (await getNews().catch(() => null)) ?? [];
  const newsRoutes: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${base}${n.href}`,
    lastModified: n.date ? new Date(n.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Guides answer the questions people search for, so they rank high here.
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${base}/guides/${g.slug}`,
    lastModified: new Date(g.updated),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // One page per mapped jurisdiction. These are the map's actual addressable
  // surface — a social post can point at a country, which a world map alone
  // cannot be. lastModified is the entry's own verification date rather than
  // the build time, so a crawler is told when the content genuinely changed
  // instead of every page claiming to be fresh on every deploy.
  const jurisdictionRoutes: MetadataRoute.Sitemap = allJurisdictions().map((j) => ({
    url: `${base}/regulatory-map/${j.slug}`,
    lastModified: new Date(j.verifiedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...guideRoutes, ...newsRoutes, ...jurisdictionRoutes];
}
