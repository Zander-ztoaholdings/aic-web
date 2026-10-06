import type { Metadata } from "next";
import Link from "next/link";
import { PLATFORM_AREAS, TRACKED_FRAMEWORKS, CONNECTOR_GROUPS, PLATFORM_URL } from "@/app/data/platform-data";

export const metadata: Metadata = {
  title: "The platform",
  description:
    "The AIC platform keeps your AI estate on the record: every system and who answers for it, the decisions it makes, the frameworks you track, and the evidence from your connected systems.",
  alternates: { canonical: "/platform" },
  openGraph: {
    title: "The AIC platform",
    description:
      "Your AI estate on the record: systems, decisions, frameworks, evidence from connected systems, risks and people, in one workspace.",
  },
};

/**
 * /platform — what app.aiccertified.cloud does.
 *
 * Added October 2026. Until then the website described the certification and
 * said almost nothing about the workspace clients actually use, which had
 * grown into the larger part of what AIC offers.
 *
 * Two things shape the page. First, the workspace's own four menus are the
 * structure, so a reader who signs up finds things where this page said they
 * would be. Second, the line between tools and certification is stated before
 * any feature: nothing done in the platform raises or lowers the chance of
 * certification, and the page has to say so before it says anything else.
 *
 * Every feature listed exists. Nothing marked "soon" in the platform appears.
 */

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2
    id={id}
    className="scroll-mt-28 text-2xl md:text-[2rem] text-[#0f1f3d] leading-[1.15] tracking-[-0.02em] font-bold text-balance"
    style={{ fontFamily: "'Merriweather', serif" }}
  >
    {children}
  </h2>
);

export default function PlatformPage() {
  return (
    <div className="bg-[#f5f7f9] min-h-screen font-sans text-[#0f1f3d]">
      {/* Opening */}
      <section className="bg-aic-navy text-white">
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-14 md:py-20">
          <p className="text-sm text-white/60 mb-4">The AIC platform</p>
          <h1
            className="text-[2rem] md:text-5xl leading-[1.08] tracking-[-0.03em] font-bold max-w-3xl text-balance"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Your AI estate, kept on the record
          </h1>
          <p className="text-lg text-white/75 leading-[1.7] max-w-2xl mt-5">
            One workspace for every AI system you run and the person who answers for it, the
            decisions those systems make, the frameworks you are held to, and the evidence your
            own systems already produce. AIC reads that evidence for you, every night, so the
            record stays current without anyone rebuilding it before an audit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <a
              href={`${PLATFORM_URL}/signup`}
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0f1f3d] hover:bg-[#f5f7f9] transition-colors"
            >
              Register your organisation
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:border-white/60 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* The line, before any feature. */}
      <section className="border-b border-[#dde2e8] bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-10 md:py-12 grid md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] gap-4 md:gap-12">
          <h2 className="text-lg font-semibold leading-snug">Tools on one side, the audit on the other</h2>
          <div className="text-[#5e6b7b] leading-[1.7] max-w-[66ch] space-y-3">
            <p>
              The platform is where you keep your record. Certification is an independent audit
              of it. Using the platform, or any tool in it, neither raises nor lowers your chance of
              being certified, and an assessor treats evidence the same way wherever it came from.
            </p>
            <p>
              That separation is what lets AIC offer tools at all while staying impartial. It is set
              out in full in the{" "}
              <Link href="/impartiality" className="font-semibold text-[#a8772a] underline-offset-2 hover:underline">
                impartiality statement
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Contents: the workspace's own four menus. */}
      <nav aria-label="On this page" className="border-b border-[#dde2e8] bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-3 flex gap-2 overflow-x-auto">
          {[...PLATFORM_AREAS.map((a) => ({ id: a.id, name: a.name })), { id: "agents", name: "Agents" }, { id: "insurers", name: "For insurers" }].map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="shrink-0 rounded-full border border-[#dde2e8] px-3.5 py-1.5 text-sm text-[#0f1f3d] hover:border-[#a8772a] transition-colors"
            >
              {a.name}
            </a>
          ))}
        </div>
      </nav>

      {PLATFORM_AREAS.map((area) => (
        <section key={area.id} className="border-b border-[#dde2e8]" aria-labelledby={area.id}>
          <div className="max-w-6xl mx-auto px-5 md:px-6 py-12 md:py-16 grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-6 lg:gap-14 items-start">
            <div className="lg:sticky lg:top-28">
              <H2 id={area.id}>{area.name}</H2>
              <p className="text-[#5e6b7b] leading-[1.65] mt-3">{area.summary}</p>
            </div>
            <div>
              <dl className="border-y border-[#dde2e8] divide-y divide-[#dde2e8] bg-white rounded-xl px-5 md:px-6">
                {area.features.map((f) => (
                  <div key={f.name} className="grid sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] gap-1 sm:gap-6 py-4">
                    <dt className="font-semibold leading-snug">{f.name}</dt>
                    <dd className="text-[15px] text-[#5e6b7b] leading-[1.6]">{f.what}</dd>
                  </div>
                ))}
              </dl>

              {area.id === "compliance" && (
                <div className="grid md:grid-cols-2 gap-8 mt-10">
                  <div>
                    <h3 className="font-semibold mb-1">{TRACKED_FRAMEWORKS.length} frameworks to track</h3>
                    <p className="text-sm text-[#5e6b7b] leading-[1.6] mb-4">
                      A mapping says this evidence usually supports this requirement. It is not an
                      auditor&apos;s conclusion, and the platform shows plainly which requirements it does
                      not cover.
                    </p>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {TRACKED_FRAMEWORKS.map((f) => (
                        <li key={f.name} className="leading-snug">
                          <span className="block text-[15px] font-medium">{f.name}</span>
                          <span className="block text-[13px] text-[#5e6b7b]">{f.where}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-[#5e6b7b] leading-[1.6] mt-4">
                      To see which apply where you operate, open a country on the{" "}
                      <Link href="/regulatory-map" className="font-semibold text-[#a8772a] underline-offset-2 hover:underline">
                        regulatory map
                      </Link>
                      .
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Systems AIC can read</h3>
                    <p className="text-sm text-[#5e6b7b] leading-[1.6] mb-4">
                      Read-only, and you can remove AIC&apos;s access from your side at any time. A
                      connector AIC has not yet seen working against a real client account is marked
                      new in the platform until it has.{" "}
                      <Link href="/security" className="font-semibold text-[#a8772a] underline-offset-2 hover:underline">
                        How AIC handles access
                      </Link>
                    </p>
                    <dl className="space-y-3">
                      {CONNECTOR_GROUPS.map((g) => (
                        <div key={g.group}>
                          <dt className="text-[13px] font-medium text-[#5e6b7b]">{g.group}</dt>
                          <dd className="text-[15px] leading-[1.55]">{g.names.join(", ")}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Agents: optional, and labelled as a tool. */}
      <section className="border-b border-[#dde2e8] bg-white" aria-labelledby="agents">
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-12 md:py-16 grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-6 lg:gap-14">
          <div>
            <H2 id="agents">Agents, if you want them</H2>
            <p className="text-[#5e6b7b] leading-[1.65] mt-3">Optional, and no bearing on certification.</p>
          </div>
          <div className="text-[#5e6b7b] leading-[1.7] max-w-[66ch] space-y-3">
            <p>
              You can run your own AI agents from the platform, with what each one may reach and
              spend fixed before it starts. An agent can only use the tools you give it, such as
              calls to the web addresses you allow, or one SharePoint site, library or folder, and
              every step it takes is checked against that scope and kept in a record that shows if
              anything was changed afterwards.
            </p>
            <p>
              The agent is declared on your AI estate like any other system, with a named person
              accountable for it. Running agents through AIC is a convenience, not a route to
              certification, and choosing not to changes nothing.
            </p>
          </div>
        </div>
      </section>

      {/* Insurers */}
      <section className="border-b border-[#dde2e8]" aria-labelledby="insurers">
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-12 md:py-16 grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-6 lg:gap-14">
          <div>
            <H2 id="insurers">Sharing with your insurer</H2>
            <p className="text-[#5e6b7b] leading-[1.65] mt-3">On your terms, and only observations.</p>
          </div>
          <div className="text-[#5e6b7b] leading-[1.7] max-w-[66ch] space-y-3">
            <p>
              If your insurer asks, you can issue them a key from your workspace. With it they read
              an extract of your record: counts, coverage, rates and dates, each traceable to
              something on the record. It is built from the same source as your own overview, so
              what your insurer sees is never a different picture from the one you manage.
            </p>
            <p>
              The extract carries no rating and no recommendation. Pricing and acceptance are the
              insurer&apos;s decisions, not AIC&apos;s. You can withdraw the key whenever you choose.{" "}
              <Link href="/insurers" className="font-semibold text-[#a8772a] underline-offset-2 hover:underline">
                What AIC offers insurers
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-14 md:py-16 grid md:grid-cols-[minmax(0,1fr)_auto] gap-6 items-center">
          <div className="max-w-2xl">
            <h2
              className="text-2xl md:text-[1.75rem] leading-[1.2] font-bold"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Start with what you already run
            </h2>
            <p className="text-[#5e6b7b] leading-[1.7] mt-3">
              Registration is a short form. A set-up guide then walks you through declaring your
              first system, connecting your first source of evidence and choosing the frameworks you
              track, pointing at each control as you go.
            </p>
          </div>
          <a
            href={`${PLATFORM_URL}/signup`}
            className="inline-flex items-center justify-center rounded-lg bg-[#0f1f3d] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a3160] transition-colors"
          >
            Register your organisation
          </a>
        </div>
      </section>
    </div>
  );
}
