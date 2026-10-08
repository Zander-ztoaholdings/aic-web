import { getNews } from "@/lib/news";
import { SITE_URL } from "@/lib/seo";

// RSS for /news. Feed readers, LinkedIn tools and news aggregators pick a site
// up through its feed, and Google uses one to find new URLs faster than a
// sitemap crawl.
export const revalidate = 300;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const items = (await getNews()) ?? [];
  const latest = items.find((i) => i.date)?.date;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>AIC news: AI regulation and accountability</title>
<link>${SITE_URL}/news</link>
<atom:link href="${SITE_URL}/news/feed.xml" rel="self" type="application/rss+xml"/>
<description>Policy updates on AI law in South Africa and beyond, with their primary sources, and analysis from AI Integrity Certification.</description>
<language>en-za</language>
${latest ? `<lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>` : ""}
${items.slice(0, 50).map((i) => `<item>
<title>${esc(i.title)}</title>
<link>${SITE_URL}${i.href}</link>
<guid isPermaLink="true">${SITE_URL}${i.href}</guid>
${i.date ? `<pubDate>${new Date(i.date).toUTCString()}</pubDate>` : ""}
<category>${esc(i.kind === "policy" ? "Policy update" : "Analysis")}</category>
<category>${esc(i.topic)}</category>
${i.author ? `<dc:creator>${esc(i.author)}</dc:creator>` : "<dc:creator>AI Integrity Certification</dc:creator>"}
<description>${esc(i.summary)}</description>
</item>`).join("\n")}
</channel>
</rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}
