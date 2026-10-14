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
  /** ISO date this page's content was published or last verified. */
  publishedAt?: string;
}

/**
 * When this version of the site was published: the build time. LinkedIn's
 * Post Inspector reports a page with no publish date, and some unfurls show
 * one, so every page carries this unless it has a truer date of its own
 * (an article's, or a jurisdiction's verification date).
 */
export const PUBLISHED_AT = new Date().toISOString();

export function ogImageUrl(title: string, kicker?: string): string {
  const q = new URLSearchParams({ title });
  if (kicker) q.set("kicker", kicker);
  return `/og?${q.toString()}`;
}

/**
 * Search results cut titles at roughly 60 characters and descriptions at
 * roughly 160. Content from the CMS (article titles, excerpts) has no such
 * limit, so these keep what reaches the results page whole: the " | AIC"
 * suffix is dropped before the title is cut, and a description is shortened
 * at a word boundary rather than mid-word.
 */
export function fitTitle(title: string, max = 60): string {
  const t = title.replace(/\s+/g, " ").trim();
  if (`${t} | AIC`.length <= max) return `${t} | AIC`;
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

export function fitDescription(text: string, max = 158): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/[\s,;:]+\S*$/, "") + "…";
}

/** Plain text from the opening of a markdown body, for a description when none was written. */
export function excerptFromMarkdown(md: string, max = 158): string {
  const plain = (md || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#{1,6}\s.*$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_>`#|-]/g, " ");
  return fitDescription(plain, max);
}

export function pageMetadata(p: PageSeo): Metadata {
  const url = `${SITE_URL}${p.path === "/" ? "" : p.path}`;
  const image = { url: ogImageUrl(p.cardTitle ?? p.title, p.cardKicker), width: 1200, height: 630, alt: p.cardTitle ?? p.title };
  return {
    // Absolute, with the suffix added here, because a nested layout that sets
    // its own title stops the root template reaching the pages beneath it:
    // country pages were going out without "| AIC".
    title: { absolute: fitTitle(p.title) },
    description: fitDescription(p.description),
    alternates: { canonical: p.path },
    openGraph: {
      type: p.type ?? "website",
      locale: "en_ZA",
      siteName: SITE_NAME,
      url,
      title: p.cardTitle ?? p.title,
      description: fitDescription(p.description, 200),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: p.cardTitle ?? p.title,
      description: fitDescription(p.description, 200),
      images: [image.url],
    },
    other: { publish_date: p.publishedAt ?? PUBLISHED_AT },
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
