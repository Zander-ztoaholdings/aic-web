import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/integrations",
  title: "Integrations: the systems AIC reads",
  description: "The AIC platform reads GitHub, Microsoft 365, OpenAI, Anthropic, your HR system, cloud accounts and more with read-only access, and records what changed.",
  cardKicker: "Integrations",
});

/**
 * Honest status, per the platform's own catalogue: four core connections the
 * platform was built around, and newer connectors marked unverified until
 * each has run against a real client account. The page says which is which.
 */
const LIVE = [
  { name: "GitHub", what: "Branch protection, required review, AI-written changes reviewed by a person, exposed secrets, critical vulnerabilities, two-factor sign-in." },
  { name: "Microsoft 365 and Entra ID", what: "Second factor enforced and registered, global administrators, accounts no one has used in months." },
  { name: "OpenAI", what: "Which models are used, by which system, and what they cost. Through an exporter you run, or a read-only key." },
  { name: "Anthropic", what: "The same, for Claude models: usage and spend, so AI nobody declared shows up." },
];

const BUILT: { group: string; names: string[] }[] = [
  { group: "AI", names: ["Claude Enterprise"] },
  { group: "Cloud", names: ["Amazon Web Services", "Google Cloud", "Microsoft Azure", "Cloudflare"] },
  { group: "Identity and access", names: ["Google Workspace", "Okta", "1Password Business"] },
  { group: "Code", names: ["GitLab", "Bitbucket Cloud"] },
  { group: "People and HR", names: ["BambooHR", "HiBob", "Personio", "Deel", "Rippling"] },
  { group: "Devices", names: ["Microsoft Intune", "Jamf Pro", "Kandji"] },
  { group: "Security", names: ["Snyk", "CrowdStrike Falcon"] },
  { group: "Work and support", names: ["Jira", "Linear", "Zendesk", "Slack", "Salesforce"] },
  { group: "Observability", names: ["Datadog"] },
];

export default function IntegrationsPage() {
  const ld = [
    { "@context": "https://schema.org", "@type": "WebPage", name: "AIC integrations", url: `${SITE_URL}/integrations`, about: { "@type": "SoftwareApplication", name: "AIC platform" } },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "The platform", path: "/platform" }, { name: "Integrations", path: "/integrations" }]),
  ];
  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm text-white/60 mb-4"><Link href="/platform" className="hover:text-white">The platform</Link> / Integrations</p>
            <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: "'Merriweather', serif" }}>Evidence from the systems you already run</h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">
              AIC reads your systems with read-only access, checks them every night, and records what changed. It cannot change your code, your settings or your models. Evidence collected once counts for every framework it supports.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-[1.9rem] font-bold" style={{ fontFamily: "'Merriweather', serif" }}>Core connections</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {LIVE.map((i) => (
            <li key={i.name} className="rounded-xl border border-[#dde2e8] bg-white p-6">
              <h3 className="text-lg font-bold">{i.name}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#2b3a4d]">{i.what}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-2xl md:text-[1.9rem] font-bold" style={{ fontFamily: "'Merriweather', serif" }}>More connectors, newly built</h2>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[#5e6b7b]">These connectors are built and tested against each provider&apos;s published interface. We list them separately until each has run against a real client account, and move them up when it has.</p>
        <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {BUILT.map((g) => (
            <div key={g.group}>
              <h3 className="text-base font-bold">{g.group}</h3>
              <ul className="mt-2 space-y-1.5 text-[15.5px] text-[#2b3a4d]">{g.names.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
          ))}
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
        <p className="mt-8 text-[15px] text-[#5e6b7b]">Need a system that is not here? <Link href="/contact?topic=platform" className="font-semibold text-[#8a6114] hover:underline">Tell us which</Link>.</p>
      </section>
    </div>
  );
}
