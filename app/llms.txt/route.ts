import { getNews } from "@/lib/news";
import { SITE_URL } from "@/lib/seo";
import { GUIDES } from "@/app/data/guides";

// /llms.txt: a plain-text map of the site for AI assistants and answer
// engines (the llmstxt.org convention). When someone asks an assistant about
// POPIA section 71 or AI certification in South Africa, this is the shortest
// path from the question to the right page here.
export const revalidate = 3600;

export async function GET() {
  const news = ((await getNews().catch(() => null)) ?? []).slice(0, 20);
  const lines = [
    "# AI Integrity Certification (AIC)",
    "",
    "> An independent South African certification body for AI accountability, founded in Johannesburg in 2026. AIC certifies that a named person remains accountable for consequential automated decisions, assesses organisations against a published standard of 44 requirements built on POPIA section 71, and publishes the result on a public register. AIC is not yet accredited by SANAS and is not an ISO/IEC 42001 certification body. It does not consult on the systems it certifies.",
    "",
    "## Guides",
    ...GUIDES.map((g) => `- [${g.title}](${SITE_URL}/guides/${g.slug}): ${g.description}`),
    `- [Glossary](${SITE_URL}/glossary): AI governance terms defined plainly.`,
    "",
    "## Certification",
    `- [How certification works](${SITE_URL}/certification): the five Divisions and what an assessment covers.`,
    `- [The AIC standard](${SITE_URL}/standard): all 44 requirements, published in full.`,
    `- [AIC Aware](${SITE_URL}/aware): free self-assessment against the standard, about ten minutes.`,
    `- [Public register](${SITE_URL}/registry): organisations certified against the standard.`,
    `- [Verify a certificate](${SITE_URL}/verify)`,
    `- [Governance and disclosures](${SITE_URL}/disclosures): impartiality, methodology, appeals and accreditation status.`,
    "",
    "## Regulation",
    `- [Regulatory map](${SITE_URL}/regulatory-map): where AI regulation stands, country by country.`,
    `- [Frameworks](${SITE_URL}/frameworks): AI mapped onto industry safety frameworks.`,
    `- [News](${SITE_URL}/news): policy updates with primary sources, and analysis. RSS: ${SITE_URL}/news/feed.xml`,
    ...news.map((n) => `- [${n.title}](${SITE_URL}${n.href})${n.date ? ` (${n.date})` : ""}${n.summary ? `: ${n.summary}` : ""}`),
    "",
    "## Company",
    `- [About AIC](${SITE_URL}/about): founders Zander Wilken and Albert von Ronge.`,
    `- [The platform](${SITE_URL}/platform): the AIC platform for keeping an AI estate on the record.`,
    `- [Workshops](${SITE_URL}/workshops): industry sessions on AI governance frameworks.`,
    `- [Contact](${SITE_URL}/contact)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
