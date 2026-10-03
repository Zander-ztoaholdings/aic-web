import { MetadataRoute } from "next";

// Read at request time so the same build can serve production and staging.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (process.env["AIC_ENV"] === "staging") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://aiccertified.cloud/sitemap.xml",
  };
}
