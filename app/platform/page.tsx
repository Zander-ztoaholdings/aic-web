import type { Metadata } from "next";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CAPABILITIES } from "@/app/data/capabilities";
import { SCENES } from "@/app/data/capability-mocks";
import PlatformTour from "@/app/components/product/PlatformTour";
import MockScene from "@/app/components/product/MockScene";
import { PLATFORM_AREAS, TRACKED_FRAMEWORKS, CONNECTOR_GROUPS, PLATFORM_URL } from "@/app/data/platform-data";

export const metadata: Metadata = pageMetadata({
  path: "/platform",
  title: "AI governance and compliance platform",
  description: "Your AI estate on the record: systems and owners, decisions, risks, and 20 frameworks such as POPIA, ISO 42001 and the EU AI Act, with evidence from your systems.",
  cardTitle: "Your AI estate, kept on the record",
  cardKicker: "The AIC platform",
});

/**
 * /platform: what app.aiccertified.cloud does.
 *
 * Laid out like the best product pages in the category: the promise, then
 * the product stepping through itself, then a grid of what it does, each with
 * a live scene of the screen. The line between tools and certification is
 * stated straight after the opening, before any feature: nothing done in the
 * platform raises or lowers the chance of certification. The workspace's own
 * four menus still structure the detail, so a reader who signs up finds things
 * where this page said they would be. Every feature listed exists.
 */

const serif = { fontFamily: "'Merriweather', serif" } as const;

const TOUR = ["ai-register", "risk-management", "supplier-ai-review", "decision-log", "evidence-packs", "trust-page"];

export default function PlatformPage() {
  const tabs = TOUR.map((slug) => ({ name: CAPABILITIES.find((c) => c.slug === slug)!.name, mock: SCENES[slug].hero }));
  return (
    <div className="bg-white min-h-screen font-sans text-[#0e1b2c]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "AIC platform",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: `${SITE_URL}/platform`,
              description: "A workspace that keeps an organisation's AI estate on the record: systems and accountable owners, decisions, risks, and evidence mapped to 20 compliance frameworks.",
              featureList: CAPABILITIES.map((c) => c.name),
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "What the AIC platform does",
              itemListElement: CAPABILITIES.map((c, n) => ({ "@type": "ListItem", position: n + 1, name: c.name, url: `${SITE_URL}/platform/${c.slug}` })),
            },
          ]),
        }}
      />

      {/* Opening: the promise, then the product, stepping through itself. */}
      <section className="bg-[#f5f7f9] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-20 md:pb-28">
          <p className="text-center text-sm text-[#5e6b7b]">The AIC platform</p>
          <h1 className="mt-4 mx-auto max-w-3xl text-center text-[2.25rem] md:text-[3.5rem] leading-[1.05] tracking-[-0.03em] font-bold text-balance" style={serif}>
            Your AI estate, kept on the record
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-center text-[17px] md:text-lg text-[#3d4a58] leading-[1.65] text-balance">
            Every AI system you run and the person who answers for it, the decisions those systems make, the frameworks you are held to, and the evidence your own systems already produce, read every night.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact?topic=platform" className="group inline-flex items-center gap-3 rounded-full bg-[#0e1b2c] pl-6 pr-2 py-2 text-[15px] font-semibold text-white hover:bg-[#1c2f47] transition-colors">
              Book a walk-through
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#c9920a] text-white transition-transform group-hover:translate-x-0.5"><ArrowRight className="h-4 w-4" /></span>
            </Link>
            <a href={`${PLATFORM_URL}/signup`} className="inline-flex items-center rounded-full border border-[#c9ced6] bg-white px-6 py-3 text-[15px] font-semibold hover:border-[#0e1b2c] transition-colors">
              Register your organisation
            </a>
          </div>
          <div className="mt-14">
            <PlatformTour tabs={tabs} />
          </div>
        </div>
      </section>

      {/* The line, before any feature. */}
      <section className="bg-[#0a1628] text-white">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-14 md:py-16 grid md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-5 md:gap-14">
          <h2 className="text-[1.5rem] md:text-[1.9rem] font-bold leading-[1.15]" style={serif}>Tools on one side, the audit on the other</h2>
          <div className="text-white/75 leading-[1.75] max-w-[66ch] space-y-3">
            <p>
              The platform is where you keep your record. Certification is an independent audit of it. Using the platform, or any tool in it,
              neither raises nor lowers your chance of being certified, and an assessor treats evidence the same way wherever it came from.
            </p>
            <p>
              That separation is what lets AIC offer tools at all while staying impartial. It is set out in full in the{" "}
              <Link href="/impartiality" className="font-semibold text-[#e0b85c] underline-offset-2 hover:underline">impartiality statement</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section aria-labelledby="products">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <h2 id="products" className="text-center text-[1.75rem] md:text-[2.4rem] font-bold leading-[1.12] tracking-[-0.02em]" style={serif}>What it does</h2>
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
            {CAPABILITIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/platform/${c.slug}`} className="group flex h-full flex-col">
                  <div aria-hidden="true" className="relative h-[230px] overflow-hidden rounded-2xl bg-[#0a1628] p-5 pt-6">
                    <div className="pointer-events-none origin-top transition-transform duration-500 group-hover:-translate-y-1">
                      <MockScene mock={SCENES[c.slug].points[0]} compact />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0a1628] to-transparent" />
                  </div>
                  <h3 className="mt-5 text-[19px] font-bold" style={serif}>{c.name}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-[#5e6b7b]">{c.lede}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#8a6114]">
                    Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The workspace's own four menus. */}
      <section className="bg-[#f5f7f9]" aria-labelledby="workspace">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <h2 id="workspace" className="text-center text-[1.75rem] md:text-[2.4rem] font-bold leading-[1.12] tracking-[-0.02em]" style={serif}>Four menus, everything in its place</h2>
          <p className="mt-4 mx-auto max-w-2xl text-center text-[#5e6b7b] leading-[1.7]">The page follows the workspace, so what you read here is where you will find it.</p>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 [&>*]:min-w-0">
            {PLATFORM_AREAS.map((area) => (
              <section key={area.id} id={area.id} className="scroll-mt-28 rounded-2xl border border-[#dde2e8] bg-white p-6 md:p-8">
                <h3 className="text-[1.3rem] font-bold" style={serif}>{area.name}</h3>
                <p className="mt-1 text-[15px] text-[#5e6b7b]">{area.summary}</p>
                <dl className="mt-5 divide-y divide-[#eef1f5]">
                  {area.features.map((f) => (
                    <div key={f.name} className="py-3">
                      <dt className="font-semibold text-[15px]">
                        {f.href ? <Link href={f.href} className="hover:text-[#8a6114] underline decoration-[#a8772a]/40 underline-offset-4">{f.name}</Link> : f.name}
                      </dt>
                      <dd className="mt-0.5 text-[14.5px] text-[#5e6b7b] leading-[1.6]">{f.what}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks and connectors */}
      <section aria-labelledby="frameworks">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-24 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="frameworks" className="text-[1.6rem] md:text-[2rem] font-bold leading-[1.15]" style={serif}>{TRACKED_FRAMEWORKS.length} frameworks to track</h2>
            <p className="mt-3 text-[15px] text-[#5e6b7b] leading-[1.7]">
              A mapping says this evidence usually supports this requirement. It is not an auditor&apos;s conclusion, and the platform shows plainly which requirements it does not cover. To see which apply where you operate, open a country on the{" "}
              <Link href="/regulatory-map" className="font-semibold text-[#8a6114] underline-offset-2 hover:underline">regulatory map</Link>.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {TRACKED_FRAMEWORKS.map((f) => (
                <li key={f.name} className="rounded-full border border-[#dde2e8] px-3.5 py-1.5 text-[14px]" title={f.where}>{f.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[1.6rem] md:text-[2rem] font-bold leading-[1.15]" style={serif}>Systems AIC can read</h2>
            <p className="mt-3 text-[15px] text-[#5e6b7b] leading-[1.7]">
              Read-only, and you can remove AIC&apos;s access from your side at any time. A connector AIC has not yet seen working against a real client account is marked new in the platform until it has.{" "}
              <Link href="/integrations" className="font-semibold text-[#8a6114] underline-offset-2 hover:underline">All integrations</Link>
            </p>
            <dl className="mt-6 space-y-3">
              {CONNECTOR_GROUPS.map((g) => (
                <div key={g.group} className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-3 border-b border-[#eef1f5] pb-3">
                  <dt className="text-[14px] text-[#5e6b7b]">{g.group}</dt>
                  <dd className="text-[15px] leading-[1.55]">{g.names.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Agents and insurers */}
      <section className="bg-[#f5f7f9]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-20 grid gap-6 lg:grid-cols-2">
          <div id="agents" className="scroll-mt-28 rounded-2xl bg-white border border-[#dde2e8] p-6 md:p-8">
            <h2 className="text-[1.3rem] font-bold" style={serif}>Agents, if you want them</h2>
            <p className="mt-1 text-[15px] text-[#8a6114]">Optional, and no bearing on certification.</p>
            <div className="mt-4 space-y-3 text-[15px] text-[#3d4a58] leading-[1.7]">
              <p>
                You can run your own AI agents from the platform, with what each one may reach and spend fixed before it starts. An agent can only use the tools you give it, such as calls to the web addresses you allow, or one SharePoint site, library or folder, and every step it takes is checked against that scope and kept in a record that shows if anything was changed afterwards.
              </p>
              <p>
                The agent is declared on your AI estate like any other system, with a named person accountable for it. Running agents through AIC is a convenience, not a route to certification, and choosing not to changes nothing.
              </p>
            </div>
          </div>
          <div id="insurers" className="scroll-mt-28 rounded-2xl bg-white border border-[#dde2e8] p-6 md:p-8">
            <h2 className="text-[1.3rem] font-bold" style={serif}>Sharing with your insurer</h2>
            <p className="mt-1 text-[15px] text-[#8a6114]">On your terms, and only observations.</p>
            <div className="mt-4 space-y-3 text-[15px] text-[#3d4a58] leading-[1.7]">
              <p>
                If your insurer asks, you can issue them a key from your workspace. With it they read an extract of your record: counts, coverage, rates and dates, each traceable to something on the record. It is built from the same source as your own overview, so what your insurer sees is never a different picture from the one you manage.
              </p>
              <p>
                The extract carries no rating and no recommendation. Pricing and acceptance are the insurer&apos;s decisions, not AIC&apos;s. You can withdraw the key whenever you choose.{" "}
                <Link href="/insurers" className="font-semibold text-[#8a6114] underline-offset-2 hover:underline">What AIC offers insurers</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="bg-[#0a1628] text-white">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-20 text-center">
          <h2 className="mx-auto max-w-2xl text-[1.75rem] md:text-[2.4rem] font-bold leading-[1.12] text-balance" style={serif}>Start with what you already run</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70 leading-[1.7]">
            Registration is a short form. A set-up guide then walks you through declaring your first system, connecting your first source of evidence and choosing the frameworks you track.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact?topic=platform" className="inline-flex items-center gap-3 rounded-full bg-white pl-6 pr-2 py-2 text-[15px] font-semibold text-[#0e1b2c]">
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
