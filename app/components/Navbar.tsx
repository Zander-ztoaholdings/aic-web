'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";

/**
 * Site navigation, October 2026, laid out the way Vanta's is.
 *
 * Before: a utility bar, six menus, a standalone link, Log in and a long call
 * to action, which overflowed below 1280px. Now: five menus centred between
 * the logo and two pill buttons, and each menu opens one wide panel. A menu
 * with several kinds of page has a rail of sections on the left; the pages
 * sit in two columns on the right, each with a one-line description, no
 * icons. The intake moved from the button to a band under the bar, where a
 * campaign belongs; the button now asks for the thing every page leads to.
 */

export interface NavLink {
  href: string;
  label: string;
  description: string;
}

export interface NavSection {
  label: string;
  items: NavLink[];
}

export interface NavGroup {
  label: string;
  /** Pages in the order the panel shows them. Flattened from sections where there are several. */
  items: NavLink[];
  sections: NavSection[];
}

/** Kept for the footer, which lists standalone links beside Company. None at present. */
export interface TopLevelLink {
  href: string;
  label: string;
}

const group = (label: string, sections: NavSection[]): NavGroup => ({ label, sections, items: sections.flatMap((s) => s.items) });

export const navGroups: NavGroup[] = [
  group("Certification", [
    { label: "Certification", items: [
      { href: "/certification", label: "How certification works", description: "The five Divisions and what an assessment covers" },
      { href: "/standard", label: "The standard", description: "All 44 requirements, published in full" },
      { href: "/aware", label: "AIC Aware", description: "Free self-assessment against the standard" },
      { href: "/registry", label: "Public register", description: "Organisations certified against the standard" },
      { href: "/verify", label: "Verify a certificate", description: "Confirm a certificate in seconds" },
      { href: "/governance-hub#declaration", label: "Algorithmic Rights", description: "The Declaration of Algorithmic Rights" },
      { href: "/disclosures", label: "Governance and disclosures", description: "Impartiality, methodology, appeals" },
    ] },
  ]),
  group("Platform", [
    { label: "Products", items: [
      { href: "/platform/ai-register", label: "AI register", description: "Every system, what it decides, and who answers for it" },
      { href: "/platform/risk-management", label: "AI risk management", description: "Risks scored, owned and tied to the evidence" },
      { href: "/platform/supplier-ai-review", label: "Supplier AI review", description: "The AI inside the software you buy" },
      { href: "/platform/decision-log", label: "Decision log", description: "Decisions, human review and every override" },
      { href: "/platform/evidence-packs", label: "Evidence packs", description: "Sealed records for boards, assessors and insurers" },
      { href: "/platform/trust-page", label: "Trust page", description: "A public page for your customers, live from your record" },
      { href: "/platform/questionnaires", label: "Questionnaires", description: "Answer buyers and insurers from your record" },
    ] },
    { label: "Platform", items: [
      { href: "/platform", label: "Platform overview", description: "Your AI estate, kept on the record" },
      { href: "/integrations", label: "Integrations", description: "The systems AIC reads, read-only" },
      { href: "/platform/api-and-mcp", label: "Read API and MCP", description: "For your own dashboards and AI assistants" },
      { href: "/intake", label: "November intake", description: "Join the founding cohort" },
    ] },
  ]),
  group("Solutions", [
    { label: "By industry", items: [
      { href: "/solutions/hr-and-recruitment", label: "HR and recruitment", description: "Screening and ranking candidates" },
      { href: "/solutions/financial-services", label: "Financial services", description: "Credit, fraud and collections decisions" },
      { href: "/solutions/insurance", label: "Insurance", description: "Pricing and claims, and insuring AI" },
    ] },
    { label: "Training", items: [
      { href: "/workshops", label: "Workshops", description: "Industry sessions on AI governance frameworks" },
    ] },
  ]),
  group("Resources", [
    { label: "News and guides", items: [
      { href: "/news", label: "All news", description: "Policy updates and analysis, newest first" },
      { href: "/policy", label: "Policy updates", description: "Regulatory developments, with their sources" },
      { href: "/articles", label: "Analysis", description: "What the developments mean for accountable AI" },
      { href: "/guides", label: "Guides", description: "POPIA section 71, King V, the EU AI Act and more" },
      { href: "/glossary", label: "Glossary", description: "AI governance terms, defined plainly" },
    ] },
    { label: "Regulation", items: [
      { href: "/regulatory-map", label: "Regulatory map", description: "AI regulation by country, and how AIC applies" },
      { href: "/frameworks", label: "Frameworks", description: "AI mapped onto your industry's safety frameworks" },
    ] },
  ]),
  group("Company", [
    { label: "Company", items: [
      { href: "/about", label: "About AIC", description: "Who we are and why AIC exists" },
      { href: "/insurers", label: "For insurers", description: "A verifiable signal of AI accountability" },
      { href: "/partners", label: "Partner programme", description: "Advisers, technology companies, insurers and brokers" },
      { href: "/trust", label: "Trust centre", description: "Security, privacy, independence and accreditation" },
      { href: "/contact", label: "Contact", description: "Talk to AIC" },
    ] },
  ]),
];

export const topLevelLinks: TopLevelLink[] = [];

const CTA = { href: "/contact?topic=platform", label: "Book a walk-through" };

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [section, setSection] = useState(0);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const overlayOpen = openGroup !== null || menuOpen;
  const active = navGroups.find((g) => g.label === openGroup) ?? null;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
    setOpenMobileGroup(null);
  }, [pathname]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null);
    };
    const onEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenGroup(null); };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const toggle = (label: string) => {
    setSection(0);
    setOpenGroup(openGroup === label ? null : label);
  };

  return (
    <header className="sticky top-0 z-50">
      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            aria-hidden
            onClick={() => { setOpenGroup(null); setMenuOpen(false); }}
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduced ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : DURATION.fast, ease: EASE_OUT }}
            className="fixed inset-0 z-40 bg-[#0a1628]/25"
            style={{ backdropFilter: "blur(8px) saturate(140%)", WebkitBackdropFilter: "blur(8px) saturate(140%)" }}
          />
        )}
      </AnimatePresence>

      <nav
        ref={navRef}
        aria-label="Main"
        className={`relative z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-[0_8px_24px_-12px_rgba(10,22,40,0.25)]" : "border-b border-[#dde2e8]"}`}
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-6 xl:px-10">
          <div className="flex items-center justify-between h-[72px]">
            <Link href="/" aria-label="AI Integrity Certification, home" className="flex items-center shrink-0">
              <div>
                <div className="font-bold text-xl leading-tight tracking-tight text-[#0e1b2c]">AIC<span className="text-[#c9920a]">.</span></div>
                <div className="text-[12px] leading-tight text-[#5e6b7b]">AI Integrity Certification</div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navGroups.map((g) => {
                const isOpen = openGroup === g.label;
                return (
                  <button
                    key={g.label}
                    type="button"
                    onClick={() => toggle(g.label)}
                    aria-expanded={isOpen}
                    aria-controls="nav-panel"
                    className={`flex items-center gap-1 whitespace-nowrap px-2.5 xl:px-3.5 py-2 rounded-full text-[15px] font-medium transition-colors ${
                      isOpen ? "text-[#0e1b2c] bg-[#f0f3f6] ring-1 ring-[#dde2e8]" : "text-[#0e1b2c] hover:bg-[#f0f3f6]"
                    }`}
                  >
                    {g.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              <Link href="/login" className="whitespace-nowrap rounded-full border border-[#c9ced6] px-4 py-2 text-[15px] font-semibold text-[#0e1b2c] hover:border-[#0e1b2c] transition-colors">
                Log in
              </Link>
              <Link href={CTA.href} className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#0e1b2c] pl-4 pr-1.5 py-1.5 text-[15px] font-semibold text-white hover:bg-[#1c2f47] transition-colors">
                {CTA.label}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c9920a] text-[#0e1b2c] transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>

            <button
              className="lg:hidden p-2 text-[#0e1b2c]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* One wide panel for whichever menu is open. */}
        {active && (
          <div id="nav-panel" className="hidden lg:block absolute inset-x-0 top-full pt-2">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10">
              <div className="flex overflow-hidden rounded-2xl border border-[#dde2e8] bg-white shadow-[0_30px_80px_-24px_rgba(10,22,40,0.45)]">
                {active.sections.length > 1 && (
                  <div className="w-64 shrink-0 bg-[#eef1f5] p-6 space-y-1.5" role="tablist" aria-label={active.label}>
                    {active.sections.map((s, i) => (
                      <button
                        key={s.label}
                        type="button"
                        role="tab"
                        aria-selected={section === i}
                        onMouseEnter={() => setSection(i)}
                        onFocus={() => setSection(i)}
                        onClick={() => setSection(i)}
                        className={`flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-[15px] font-medium transition-colors ${
                          section === i ? "bg-[#0e1b2c] text-white" : "text-[#0e1b2c] hover:bg-white"
                        }`}
                      >
                        {s.label}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex-1 p-8">
                  <ul className="grid grid-cols-2 gap-x-10 gap-y-6">
                    {(active.sections[section] ?? active.sections[0]).items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={() => setOpenGroup(null)} className="group block">
                          <span className="block text-[18px] leading-snug text-[#0e1b2c] group-hover:text-[#8a6114]" style={{ fontFamily: "'Merriweather', serif" }}>{item.label}</span>
                          <span className="mt-1 block text-[13.5px] text-[#5e6b7b]">{item.description}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {menuOpen && (
          <div
            className="lg:hidden relative z-50 bg-white border-t border-[#dde2e8] overflow-y-auto"
            style={{ maxHeight: "calc(100dvh - 72px)" }}
          >
            <div className="px-4 py-4 flex flex-col">
              {navGroups.map((g) => {
                const isOpen = openMobileGroup === g.label;
                return (
                  <div key={g.label} className="border-b border-[#eef1f5] last:border-0">
                    <button
                      type="button"
                      onClick={() => setOpenMobileGroup(isOpen ? null : g.label)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between px-2 py-4 text-left"
                    >
                      <span className="text-base font-semibold text-[#0e1b2c]">{g.label}</span>
                      <ChevronDown className={`w-4 h-4 text-[#5e6b7b] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="pb-4 space-y-4">
                        {g.sections.map((s) => (
                          <div key={s.label}>
                            {g.sections.length > 1 && <p className="px-2 pb-1 text-[13px] font-semibold text-[#8a6114]">{s.label}</p>}
                            {s.items.map((item) => (
                              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-2 py-2.5 hover:bg-[#f0f3f6]">
                                <span className="block text-[15px] font-medium text-[#0e1b2c]">{item.label}</span>
                                <span className="block text-[13px] text-[#5e6b7b]">{item.description}</span>
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="pt-5 flex flex-col gap-3">
                <Link href={CTA.href} onClick={() => setMenuOpen(false)} className="flex items-center justify-center rounded-full bg-[#0e1b2c] px-4 py-3.5 text-base font-semibold text-white">
                  {CTA.label}
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center rounded-full border border-[#c9ced6] px-4 py-3.5 text-base font-semibold text-[#0e1b2c]">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Campaign band, under the bar, as Vanta runs theirs. */}
      <div className="relative z-30 bg-aic-navy text-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 py-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[14px]">
          <span className="font-semibold">The November intake is open: join the founding cohort.</span>
          <Link href="/intake" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white">
            Find out more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
