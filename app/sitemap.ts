import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://aiccertified.cloud";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/ai-governance-index`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/corporate-portal`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/governance-hub`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/disclosures`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
