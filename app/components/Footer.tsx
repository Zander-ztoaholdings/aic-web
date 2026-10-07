import Link from "next/link";
import Image from "next/image";
import { Shield, ChevronRight } from "lucide-react";
import { navGroups, topLevelLinks } from "./Navbar";
import { CONTACT_EMAIL, GENERAL_EMAIL } from "@/lib/contact";

// Footer intentionally does NOT reuse the top nav's dropdown interaction —
// footers are conventionally a flat, always-visible sitemap rather than a
// second set of hover/click menus (see e.g. charteredaccountantsworldwide.com's
// footer: branding, then plain categorised link columns, then legal, then
// social — never a footer dropdown). So this renders the same navGroups data
// as static sub-headed lists instead of mirroring the nav's dropdown behaviour.

// Published standards and laws AIC's own standard is built with reference to.
const standards = [
  { label: "ISO/IEC 42001", url: "https://www.iso.org/standard/81230.html" },
  { label: "POPIA section 71", url: "https://popia.co.za/section-71-automated-decision-making/" },
  { label: "NIST AI RMF", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
  { label: "EU AI Act", url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj" },
  { label: "IEEE 7000 series", url: "https://standards.ieee.org/ieee/7000/6781/" },
];

// AIC's industry frameworks, which live on this site.
const industryFrameworks = [
  { label: "Process industry", href: "/frameworks/process-industry" },
  { label: "Financial services", href: "/frameworks/financial-services" },
  { label: "Medical devices", href: "/frameworks/medical-devices" },
  { label: "20 frameworks the platform tracks", href: "/frameworks" },
];

// Brand-accurate marks, not lucide's generic icons — lucide's plain X icon
// reads as a "close" affordance, and its Linkedin glyph is a looser
// approximation than the real wordmark. These two paths are the official
// logos, sized and colored (currentColor) to match every other footer icon.
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0a1628] text-white overflow-hidden relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#c9920a] via-transparent to-transparent" />
      </div>

      {/* Manifesto band */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-3xl">
              <div className="text-white/50 text-sm mb-4">
                Our mission
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white font-serif italic leading-relaxed">
                Certifying that a named human remains accountable for every decision that matters.
              </h2>
            </div>
            <Link
              href="/intake"
              className="shrink-0 inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#dcae4c] text-[#0e1b2c] px-7 py-4 rounded transition-all text-sm font-semibold font-sans self-start lg:self-auto"
            >
              Join the November intake
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20 relative z-10">
        {/* Six columns on a wide screen: the brand, then the site in the order
            of the menus, then what AIC builds on, then how to reach us. The
            standalone links (Workshops) sit with Company rather than in a
            group of their own, which stood out as an orphan. */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10">

          {/* Brand */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-1 lg:row-span-2">
            <Link href="/" className="inline-block group">
              <Image
                src="/AIC-Logo-White.svg"
                alt="AI Integrity Certification"
                width={110}
                height={180}
                className="h-[72px] w-auto sm:h-20 group-hover:opacity-90 transition-opacity"
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Certifying the humans accountable for AI systems. AI Integrity Certification (Pty) Ltd, South Africa.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/ai-integrity-certification/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AIC on LinkedIn"
                className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/60 hover:text-[#c9920a] hover:bg-white/10 transition-colors"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/aiccertified"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AIC on X"
                className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/60 hover:text-[#c9920a] hover:bg-white/10 transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </a>
            </div>
            {/* Links to the accreditation status rather than standing alone,
                so what the mark does and does not assert is published on the
                site rather than explained after someone challenges it. */}
            <Link
              href="/disclosures#accreditation"
              title="AIC's accreditation status, stated plainly"
              className="pt-2 flex items-center gap-2 text-[13px] text-[#dcae4c] hover:text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Accreditation status</span>
            </Link>
            <Link
              href="/verify"
              className="inline-block text-white/60 hover:text-white text-[13px] transition-colors"
            >
              Verify a certificate
            </Link>
          </div>

          {[navGroups[0], navGroups[1], { ...navGroups[4], items: [...navGroups[4].items, ...topLevelLinks.map((l) => ({ ...l, description: "" }))] }].map((group) => (
            <FooterColumn key={group.label} title={group.label} links={group.items.map((i) => ({ label: i.label, href: i.href }))} />
          ))}

          <div className="space-y-8">
            <FooterColumn title={navGroups[2].label} links={navGroups[2].items.map((i) => ({ label: i.label, href: i.href }))} />
            <FooterColumn title={navGroups[3].label} links={navGroups[3].items.map((i) => ({ label: i.label, href: i.href }))} />
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold text-white/80 mb-4">Standards we build on</h4>
              <ul className="space-y-2.5 text-sm">
                {standards.map((std) => (
                  <li key={std.label}>
                    <a href={std.url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                      {std.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <FooterColumn title="Industry frameworks" links={industryFrameworks} />
          </div>

          <div className="col-span-2 sm:col-span-3 lg:col-span-5 lg:col-start-2 border-t border-white/10 pt-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-10 text-sm text-white/60">
            <span>15 Smit Street, Johannesburg, Gauteng, 2000, South Africa</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">{CONTACT_EMAIL}</a>
            {GENERAL_EMAIL !== CONTACT_EMAIL && (
              <a href={`mailto:${GENERAL_EMAIL}`} className="hover:text-white transition-colors">{GENERAL_EMAIL}</a>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-white/50 text-[13px] text-center sm:text-left">
            aiccertified.cloud | © 2026 AI Integrity Certification (Pty) Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/50">
            <Link href="/privacy" className="hover:text-[#c9920a] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#c9920a] transition-colors">
              Terms of Use
            </Link>
            <Link href="/security" className="hover:text-[#c9920a] transition-colors">
              Security
            </Link>
            <Link href="/impartiality" className="hover:text-[#c9920a] transition-colors">
              Impartiality
            </Link>
            <Link href="/disclosures" className="hover:text-[#c9920a] transition-colors">
              Disclosures
            </Link>
            {/* Consent has to be as easy to withdraw as it was to give,
                otherwise it is not consent. Dispatches an event the banner
                listens for, so it reopens without a page reload. */}
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("aic:review-cookie-consent"))
              }
              /* A <button> does not inherit font-size or font-family from its
                 parent — the UA stylesheet sets its own — so the utility
                 classes on the surrounding row applied to the sibling links
                 and not to this. Stated explicitly so it matches them. */
              className="text-[13px] text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Analytics Preference
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white/80 mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-white/70 hover:text-white text-sm transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
