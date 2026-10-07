import type { Metadata } from "next";

/**
 * One way to describe a page to search engines and to whatever unfurls a
 * link (LinkedIn, X, Slack, WhatsApp).
 *
 * WHY THIS EXISTS. Pages that set only a title inherited the home page's
 * Open Graph block, so a link to /aware or /frameworks shared on LinkedIn
 * unfurled as the home page: its title, its description, its URL. With
 * LinkedIn the main channel, that is most of the traffic arriving with the
 * wrong promise. Every page now passes through this, so the title, the
 * description, the canonical URL and the share card always agree.
 */

export const SITE_URL = "https://aiccertified.cloud";
export const SITE_NAME = "AI Integrity Certification";

export interface PageSeo {
  /** Under about 60 characters including " | AIC", which is added. */
  title: string;
  /** 120 to 160 characters: what the reader gets, in their words. */
  description: string;
  /** Path from the site root, starting with "/". */
  path: string;
  /** A shorter headline for the share card, if the title is long. */
  cardTitle?: string;
  /** One line above the headline on the share card. */
  cardKicker?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

export function ogImageUrl(title: string, kicker?: string): string {
  const q = new URLSearchParams({ title });
  if (kicker) q.set("kicker", kicker);
  return `/og?${q.toString()}`;
}

export function pageMetadata(p: PageSeo): Metadata {
  const url = `${SITE_URL}${p.path === "/" ? "" : p.path}`;
  const image = { url: ogImageUrl(p.cardTitle ?? p.title, p.cardKicker), width: 1200, height: 630, alt: p.cardTitle ?? p.title };
  return {
    // Absolute, with the suffix added here, because a nested layout that sets
    // its own title stops the root template reaching the pages beneath it:
    // country pages were going out without "| AIC".
    title: { absolute: `${p.title} | AIC` },
    description: p.description,
    alternates: { canonical: p.path },
    openGraph: {
      type: p.type ?? "website",
      locale: "en_ZA",
      siteName: SITE_NAME,
      url,
      title: p.cardTitle ?? p.title,
      description: p.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: p.cardTitle ?? p.title,
      description: p.description,
      images: [image.url],
    },
    ...(p.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** BreadcrumbList structured data for a page below the top level. */
export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path === "/" ? "" : t.path}`,
    })),
  };
}
