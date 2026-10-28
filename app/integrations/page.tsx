import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Moon, Layers } from "lucide-react";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";
import { INTEGRATIONS } from "@/app/data/integrations";
import IntegrationsLibrary from "./IntegrationsLibrary";
import IntegrationLogo from "./IntegrationLogo";

export const metadata: Metadata = pageMetadata({
  path: "/integrations",
  title: "Integrations: the systems AIC reads",
  description: "The AIC platform reads GitHub, Microsoft 365, OpenAI, Anthropic, your HR system, cloud accounts and more with read-only access, and records what changed.",
  cardKicker: "Integrations",
});

const serif = { fontFamily: "'Merriweather', serif" } as const;

const HOW = [
  { icon: Eye, title: "Read-only, always", text: "AIC cannot change your code, your settings or your models. Where a provider allows it, you run the exporter and AIC never holds your key." },
  { icon: Moon, title: "Checked every night", text: "Each connection is read nightly and every change is written to your continuity record, so evidence is current rather than collected once a year." },
  { icon: Layers, title: "Collected once, used everywhere", text: "One piece of evidence counts for every framework it supports: the AIC standard, POPIA, ISO 27001, ISO/IEC 42001 and the others you track." },
];

/**
 * Honest status, per the platform's own catalogue: the core connections the
 * platform was built around are live; newer connectors are marked as built
 * until each has run against a real client account.
 */
export default function IntegrationsPage() {
  const live = INTEGRATIONS.filter((i) => i.status === "live");
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "AIC integrations",
      url: `${SITE_URL}/integrations`,
      about: { "@type": "SoftwareApplication", name: "AIC platform" },
      hasPart: INTEGRATIONS.map((i) => ({ "@type": "Thing", name: i.name, description: i.reads })),
    },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "The platform", path: "/platform" }, { name: "Integrations", path: "/integrations" }]),
  ];

  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm text-white/60 mb-4"><Link href="/platform" className="hover:text-white">The platform</Link> / Integrations</p>
            <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={serif}>Evidence from the systems you already run</h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">
              Connect your code, cloud, identity, HR and AI providers. AIC reads them with read-only access, checks them every night and records what changed, so your evidence stays current without questionnaires.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/contact?topic=platform" className="group inline-flex items-center justify-center gap-3 rounded-full bg-white pl-6 pr-2 py-2 text-[15px] font-semibold text-[#0e1b2c] hover:bg-white/90 transition-colors">
                Book a walk-through
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#c9920a] text-white transition-transform group-hover:translate-x-0.5"><ArrowRight className="h-4 w-4" /></span>
              </Link>
              <a href="#library" className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-[15px] font-semibold text-white hover:border-white transition-colors">
                Browse all {INTEGRATIONS.length} integrations
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <ul className="grid gap-6 md:grid-cols-3">
          {HOW.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon className="h-6 w-6 text-[#a8772a]" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-bold">{title}</h2>
              <p className="mt-2 text-[15.5px] leading-relaxed text-[#3d4a58]">{text}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-2xl md:text-[1.9rem] font-bold" style={serif}>Core connections</h2>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[#5e6b7b]">The connections the platform was built around, running for clients today.</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {live.map((i) => (
            <li key={i.name} className="rounded-xl border border-[#dde2e8] bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <IntegrationLogo name={i.name} />
                  <h3 className="text-lg font-bold">{i.name}</h3>
                </div>
                <span className="rounded-full bg-[#2e7a57]/10 px-2.5 py-1 text-[12.5px] font-medium text-[#22603f]">Live</span>
              </div>
              <p className="mt-2 text-[16px] leading-relaxed text-[#2b3a4d]">{i.reads}</p>
            </li>
          ))}
        </ul>

        <div id="library" className="scroll-mt-24">
          <h2 className="mt-14 text-2xl md:text-[1.9rem] font-bold" style={serif}>All integrations</h2>
          <p className="mt-3 mb-6 max-w-3xl text-[16px] leading-relaxed text-[#5e6b7b]">
            Connectors marked &ldquo;built&rdquo; are written and tested against each provider&apos;s published interface. We list them separately until each has run against a real client account, and move them to live when it has.
          </p>
          <IntegrationsLibrary />
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Link href="/platform/decision-log" className="rounded-xl border border-[#dde2e8] bg-white p-6 hover:border-[#a8772a] transition-colors">
            <h3 className="text-lg font-bold">Your own systems, through the API</h3>
            <p className="mt-2 text-[15.5px] leading-relaxed text-[#5e6b7b]">Any system that makes a decision can record it in your decision log, and hold it for a person to review.</p>
          </Link>
          <Link href="/platform/api-and-mcp" className="rounded-xl border border-[#dde2e8] bg-white p-6 hover:border-[#a8772a] transition-colors">
            <h3 className="text-lg font-bold">Your own tools, reading AIC</h3>
            <p className="mt-2 text-[15.5px] leading-relaxed text-[#5e6b7b]">A read-only API and MCP server for your dashboards and AI assistants.</p>
          </Link>
        </div>

        <div className="mt-10 rounded-xl bg-[#0e1b2c] px-6 py-8 text-white md:flex md:items-center md:justify-between md:px-10">
          <div>
            <h2 className="text-xl font-bold" style={serif}>Need a system that is not here?</h2>
            <p className="mt-2 text-[15.5px] text-white/75">Tell us which. Requests from clients decide what we build next.</p>
          </div>
          <Link href="/contact?topic=platform" className="mt-5 inline-flex items-center rounded-full bg-[#c9920a] px-6 py-3 text-[15px] font-semibold text-white hover:bg-[#b5830a] transition-colors md:mt-0">
            Request an integration
          </Link>
        </div>
      </section>
    </div>
  );
}
