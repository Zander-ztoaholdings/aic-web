import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";
import { CAPABILITIES, CAPABILITY_BY_SLUG } from "@/app/data/capabilities";
import { SCENES } from "@/app/data/capability-mocks";
import { PLATFORM_URL } from "@/app/data/platform-data";
import AppStage from "@/app/components/product/AppStage";
import MockScene from "@/app/components/product/MockScene";

export const dynamicParams = false;

export function generateStaticParams() {
  // supplier-ai-review has its own page at app/platform/supplier-ai-review.
  return CAPABILITIES.filter((c) => c.slug !== "supplier-ai-review").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = CAPABILITY_BY_SLUG[slug];
  if (!c) return {};
  return pageMetadata({ path: `/platform/${slug}`, title: c.seoTitle, description: c.description, cardTitle: c.name, cardKicker: "The AIC platform" });
}

const relatedHref = (s: string) => (s === "integrations" ? "/integrations" : `/platform/${s}`);
const relatedName = (s: string) => (s === "integrations" ? "Integrations" : CAPABILITY_BY_SLUG[s]?.name ?? s);
const relatedLede = (s: string) => (s === "integrations" ? "The systems AIC reads every night, read-only." : CAPABILITY_BY_SLUG[s]?.lede ?? "");

/** Which of the workspace's four menus the capability sits under. */
const MENU: Record<string, number> = {
  "ai-register": 0, "decision-log": 0, "evidence-packs": 1, "api-and-mcp": 1,
  "risk-management": 2, "supplier-ai-review": 2, "trust-page": 3, questionnaires: 3,
};

/** "POPIA section 71: knowing which…" becomes "POPIA section 71". */
const shortName = (a: string) => a.split(":")[0].trim();

const serif = { fontFamily: "'Merriweather', serif" } as const;

/**
 * One page per platform capability, laid out the way the best product pages
 * in the category are: the product first, then each thing it does beside a
 * scene of the screen doing it, then what it answers to, then questions.
 */
export default async function CapabilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CAPABILITY_BY_SLUG[slug];
  if (!c) notFound();
  const scenes = SCENES[slug];
  const rows = c.points.slice(0, scenes?.points.length ?? 0);
  const rest = c.points.slice(rows.length);

  const faqs = [
    { q: `${c.name}: what does it do?`, a: c.description },
    { q: `Which laws and standards does it help with?`, a: c.answersTo.join(". ") + "." },
    {
      q: `Does using it make AIC certification more likely?`,
      a: "No. The platform is a tool. Using it neither raises nor lowers the chance of certification, which is decided only against the published AIC standard, by assessors who treat evidence the same way wherever it came from.",
    },
  ];

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `AIC platform: ${c.name}`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: c.description,
      url: `${SITE_URL}/platform/${slug}`,
      featureList: c.points.map((p) => p.title),
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "The platform", path: "/platform" }, { name: c.name, path: `/platform/${slug}` }]),
  ];

  return (
    <div className="bg-white text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* Opening: the promise, then the product. */}
      <section className="relative overflow-hidden bg-[#f5f7f9]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-24 md:pb-32">
          <nav aria-label="Breadcrumb" className="text-center text-sm text-[#5e6b7b]">
            <Link href="/platform" className="hover:text-[#0e1b2c]">The platform</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span>{c.name}</span>
          </nav>
          <h1 className="mt-5 mx-auto max-w-3xl text-center text-[2.25rem] md:text-[3.4rem] font-bold leading-[1.06] tracking-[-0.03em] text-balance" style={serif}>
            {c.name}
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-center text-[17px] md:text-lg text-[#3d4a58] leading-[1.65] text-balance">{c.lede}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact?topic=platform" className="group inline-flex items-center gap-3 rounded-full bg-[#0e1b2c] pl-6 pr-2 py-2 text-[15px] font-semibold text-white hover:bg-[#1c2f47] transition-colors">
              Book a walk-through
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#c9920a] text-white transition-transform group-hover:translate-x-0.5"><ArrowRight className="h-4 w-4" /></span>
            </Link>
            <a href={`${PLATFORM_URL}/signup`} className="inline-flex items-center rounded-full border border-[#c9ced6] bg-white px-6 py-3 text-[15px] font-semibold hover:border-[#0e1b2c] transition-colors">
              Register your organisation
            </a>
          </div>
          {scenes && (
            <div className="mt-14 md:mt-16">
              <AppStage main={scenes.hero} menu={MENU[slug] ?? 0} />
            </div>
          )}
        </div>
      </section>

      {/* What it answers to, as a band. */}
      <section className="bg-[#0a1628] text-white">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-12 md:py-14">
          <p className="text-center text-sm text-white/60">Built to answer to</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
            {c.answersTo.map((a) => (
              <li key={a} className="rounded-full border border-white/15 px-4 py-2 text-[14px] text-white/90">{shortName(a)}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Each thing it does, beside the screen doing it. */}
      {rows.map((p, i) => (
        <section key={p.title} className="border-b border-[#eef1f5]">
          <div className={`max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-24 grid grid-cols-1 gap-10 lg:gap-16 items-center lg:grid-cols-2 [&>*]:min-w-0`}>
            <div className={i % 2 ? "lg:order-2" : ""}>
              <h2 className="text-[1.75rem] md:text-[2.25rem] font-bold leading-[1.12] tracking-[-0.02em] text-balance" style={serif}>{p.title}</h2>
              <p className="mt-4 text-[17px] leading-[1.7] text-[#3d4a58] max-w-[52ch]">{p.text}</p>
              <Link href="/contact?topic=platform" className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#c9ced6] px-5 py-2.5 text-[14.5px] font-semibold hover:border-[#0e1b2c] transition-colors">
                See it in a walk-through <ArrowRight className="h-4 w-4 text-[#a8772a]" />
              </Link>
            </div>
            <div className={`rounded-[28px] bg-[#f5f7f9] p-5 sm:p-10 lg:p-12 ${i % 2 ? "lg:order-1" : ""}`}>
              <MockScene mock={scenes!.points[i]} />
            </div>
          </div>
        </section>
      ))}

      {/* The rest, as a grid. */}
      {rest.length > 0 && (
        <section className="bg-[#0a1628] text-white">
          <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-20">
            <h2 className="text-[1.6rem] md:text-[2rem] font-bold leading-[1.15]" style={serif}>And also</h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <li key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-[17px] font-semibold">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-white/70">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* What it answers to, in full, and the line on certification. */}
      <section className="bg-[#f5f7f9]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-20 grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-8 lg:gap-16">
          <h2 className="text-[1.6rem] md:text-[2rem] font-bold leading-[1.15]" style={serif}>What it answers to</h2>
          <div>
            <ul className="space-y-3 text-[17px] leading-relaxed text-[#2b3a4d]">
              {c.answersTo.map((a) => <li key={a} className="border-l-[3px] border-[#a8772a] pl-4">{a}</li>)}
            </ul>
            <p className="mt-6 text-sm text-[#5e6b7b] leading-relaxed">
              The platform is a tool. Using it neither raises nor lowers the chance of AIC certification, which is decided only against the{" "}
              <Link href="/standard" className="text-[#8a6114] underline underline-offset-2">published standard</Link>. See{" "}
              <Link href="/impartiality" className="text-[#8a6114] underline underline-offset-2">impartiality</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section>
        <div className="max-w-[880px] mx-auto px-5 md:px-8 py-16 md:py-20">
          <h2 className="text-[1.6rem] md:text-[2rem] font-bold leading-[1.15] text-center" style={serif}>Questions</h2>
          <div className="mt-8 divide-y divide-[#dde2e8] border-y border-[#dde2e8]">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                  {f.q}
                  <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#dde2e8] text-[#a8772a] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[16px] leading-[1.7] text-[#3d4a58]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Works with */}
      <section className="border-t border-[#eef1f5]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-20">
          <h2 className="text-[1.6rem] md:text-[2rem] font-bold leading-[1.15] text-center" style={serif}>Works with</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {c.related.map((r) => (
              <li key={r}>
                <Link href={relatedHref(r)} className="group flex h-full flex-col rounded-2xl border border-[#dde2e8] bg-white p-6 hover:border-[#a8772a] hover:shadow-[0_20px_40px_-28px_rgba(10,22,40,0.4)] transition-all">
                  <span className="text-[18px] font-bold" style={serif}>{relatedName(r)}</span>
                  <span className="mt-2 text-[15px] leading-[1.6] text-[#5e6b7b]">{relatedLede(r)}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#8a6114]">
                    Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center">
            <Link href="/platform" className="text-[15px] font-semibold text-[#8a6114] underline underline-offset-4">See everything the platform does</Link>
          </p>
        </div>
      </section>

      {/* Close */}
      <section className="bg-[#0a1628] text-white">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-20 text-center">
          <h2 className="mx-auto max-w-2xl text-[1.75rem] md:text-[2.4rem] font-bold leading-[1.12] text-balance" style={serif}>
            See your own AI estate on the record
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70 leading-[1.7]">
            A short session on your own systems, with the person who will answer for them.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact?topic=platform" className="group inline-flex items-center gap-3 rounded-full bg-white pl-6 pr-2 py-2 text-[15px] font-semibold text-[#0e1b2c]">
              Book a walk-through
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#c9920a] text-white"><ArrowRight className="h-4 w-4" /></span>
            </Link>
            <a href={`${PLATFORM_URL}/signup`} className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold hover:bg-white/10 transition-colors">
              Register your organisation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
