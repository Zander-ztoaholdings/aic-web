'use client';

import { useEffect, useRef, useState, type ComponentType } from "react";
import { SOLUTIONS } from "@/app/data/solutions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DURATION, EASE_OUT } from "@/lib/motion";
import {
  Menu, X, ChevronDown, ArrowRight, BookMarked, Activity, ShieldAlert, Truck, PackageCheck, Globe, ClipboardList,
  Plug, Braces, CalendarCheck, FileText, BadgeCheck, Search, ShieldCheck, Scale, Landmark,
} from "lucide-react";
import SealArt from "./SealArt";

/**
 * Site navigation, October 2026.
 *
 * Five menus centred between the logo and two pill buttons. Each opens one
 * wide panel on hover or click. Certification and Platform lead with a card
 * that says what the menu is about and where to start, then their pages in
 * columns, each with an icon and a one-line description. The other menus are
 * columns only. Icons are line icons in brass: they help the eye find a page,
 * so each one names what the page is about, never decoration.
 */

type Icon = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

export interface NavLink {
  href: string;
  label: string;
  description: string;
  icon?: Icon;
}

/** The card that opens a menu: what it is about, and where to start. */
export interface NavFeature {
  href: string;
  title: string;
  text: string;
  cta: string;
  art: "seal" | "record";
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
  feature?: NavFeature;
}

/** Kept for the footer, which lists standalone links beside Company. None at present. */
export interface TopLevelLink {
  href: string;
  label: string;
}

const group = (label: string, sections: NavSection[], feature?: NavFeature): NavGroup => ({
  label,
  sections,
  feature,
  // The footer lists every page in a menu, the feature's page first.
  items: [...(feature ? [{ href: feature.href, label: feature.title, description: feature.text }] : []), ...sections.flatMap((s) => s.items)],
});

export const navGroups: NavGroup[] = [
  group("Certification", [
    { label: "The standard", items: [
      { href: "/standard", label: "The standard", description: "All 44 requirements, published in full", icon: FileText },
      { href: "/aware", label: "AIC Aware", description: "Free self-assessment against the standard", icon: BadgeCheck },
      { href: "/governance-hub#declaration", label: "Algorithmic Rights", description: "The Declaration of Algorithmic Rights", icon: Scale },
    ] },
    { label: "Check a certificate", items: [
      { href: "/registry", label: "Public register", description: "Organisations certified against the standard", icon: Landmark },
      { href: "/verify", label: "Verify a certificate", description: "Confirm a certificate in seconds", icon: Search },
      { href: "/disclosures", label: "Governance and disclosures", description: "Impartiality, methodology, appeals", icon: ShieldCheck },
    ] },
  ], {
    href: "/certification",
    title: "How certification works",
    text: "The five Divisions, what an assessment covers, and who decides.",
    cta: "See the process",
    art: "seal",
  }),
  group("Platform", [
    { label: "Keep the record", items: [
      { href: "/platform/ai-register", label: "AI register", description: "Every system, what it decides, and who answers for it", icon: BookMarked },
      { href: "/platform/decision-log", label: "Decision log", description: "Decisions, human review and every override", icon: Activity },
      { href: "/platform/risk-management", label: "AI risk management", description: "Risks scored, owned and tied to the evidence", icon: ShieldAlert },
      { href: "/platform/supplier-ai-review", label: "Supplier AI review", description: "The AI inside the software you buy", icon: Truck },
    ] },
    { label: "Show it", items: [
      { href: "/platform/evidence-packs", label: "Evidence packs", description: "Sealed records for boards, assessors and insurers", icon: PackageCheck },
      { href: "/platform/trust-page", label: "Trust page", description: "A public page for your customers, live from your record", icon: Globe },
      { href: "/platform/questionnaires", label: "Questionnaires", description: "Answer buyers and insurers from your record", icon: ClipboardList },
    ] },
    { label: "Connect", items: [
      { href: "/integrations", label: "Integrations", description: "The systems AIC reads, read-only", icon: Plug },
      { href: "/platform/api-and-mcp", label: "Read API and MCP", description: "For your own dashboards and AI assistants", icon: Braces },
      { href: "/intake", label: "Founding cohort", description: "Join the first ten organisations", icon: CalendarCheck },
    ] },
  ], {
    href: "/platform",
    title: "Platform overview",
    text: "Your AI estate, kept on the record: who is accountable, and the evidence behind it.",
    cta: "Tour the platform",
    art: "record",
  }),
  group("Solutions", [
    { label: "By industry", items: [
      ...SOLUTIONS.map((x) => ({ href: `/solutions/${x.slug}`, label: x.name, description: x.short })),
    ] },
    { label: "Training", items: [
      { href: "/workshops", label: "Workshops", description: "Industry sessions on AI governance frameworks" },
      { href: "/solutions", label: "All industries", description: "Where AI decides, and the rules that apply" },
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
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const toggle = (label: string) => setOpenGroup(openGroup === label ? null : label);

  // Hover opens a menu on devices with a pointer; leaving the bar and panel
  // closes it after a short pause, so moving diagonally into the panel works.
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const hoverOpen = (label: string) => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) return;
    cancelClose();
    setOpenGroup(label);
  };
  const hoverClose = () => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) return;
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenGroup(null), 180);
  };
  useEffect(() => () => cancelClose(), []);

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
        onMouseLeave={hoverClose}
        onMouseEnter={cancelClose}
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
                    onMouseEnter={() => hoverOpen(g.label)}
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
              <div className="flex gap-8 overflow-hidden rounded-2xl border border-[#dde2e8] bg-white p-6 shadow-[0_30px_80px_-24px_rgba(10,22,40,0.45)]">
                {active.feature && <FeatureCard feature={active.feature} onNavigate={() => setOpenGroup(null)} />}
                <div
                  className={`grid flex-1 gap-x-8 gap-y-2 py-2 ${
                    active.sections.length >= 3 ? "grid-cols-3" : active.sections.length === 2 ? "grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {active.sections.map((s) => (
                    <div key={s.label}>
                      <p className="px-3 pb-3 text-[17px] text-[#0e1b2c]" style={{ fontFamily: "'Merriweather', serif" }}>{s.label}</p>
                      <ul className={active.sections.length === 1 ? "grid grid-cols-2 gap-x-8" : ""}>
                        {s.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setOpenGroup(null)}
                                className="group flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#f5f7f9] focus-visible:bg-[#f5f7f9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a8772a]"
                              >
                                {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#a8772a]" aria-hidden />}
                                <span>
                                  <span className="block text-[15.5px] font-medium leading-snug text-[#0e1b2c] group-hover:text-[#8a6114]">{item.label}</span>
                                  <span className="mt-0.5 block text-[13.5px] leading-snug text-[#5e6b7b]">{item.description}</span>
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
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
                        {g.feature && (
                          <Link href={g.feature.href} onClick={() => setMenuOpen(false)} className="block rounded-xl bg-[#f5f7f9] px-3 py-3">
                            <span className="block text-[15px] font-semibold text-[#0e1b2c]">{g.feature.title}</span>
                            <span className="block text-[13px] text-[#5e6b7b]">{g.feature.text}</span>
                          </Link>
                        )}
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
    </header>
  );
}

/** Open outlines of a record: rows, an owner mark and one brass seal. No words or numbers, so it can never claim a fact. */
function RecordArt() {
  const rows = [0, 1, 2, 3];
  return (
    <svg viewBox="0 0 260 150" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect x="14" y="10" width="232" height="130" rx="12" fill="#ffffff" stroke="#dde2e8" />
      {rows.map((r) => (
        <g key={r} transform={`translate(30 ${28 + r * 27})`}>
          <circle cx="6" cy="6" r="6" fill="none" stroke="#a8772a" strokeOpacity={0.35 + r * 0.15} strokeWidth="1.5" />
          <rect x="22" y="2" width={92 - r * 10} height="8" rx="4" fill="#dde2e8" />
          <rect x="128" y="2" width="44" height="8" rx="4" fill="#eef1f5" />
          <rect x="182" y="0" width="18" height="12" rx="6" fill="none" stroke={r === 0 ? "#2e7a57" : "#dde2e8"} strokeWidth="1.25" />
        </g>
      ))}
    </svg>
  );
}

function FeatureCard({ feature, onNavigate }: { feature: NavFeature; onNavigate: () => void }) {
  return (
    <Link
      href={feature.href}
      onClick={onNavigate}
      className="group relative flex w-[320px] shrink-0 flex-col overflow-hidden rounded-xl bg-[#f5f7f9] p-6 transition-colors hover:bg-[#eef1f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a8772a]"
    >
      <span className="text-[20px] leading-snug text-[#0e1b2c]" style={{ fontFamily: "'Merriweather', serif" }}>{feature.title}</span>
      <span className="mt-2 text-[14px] leading-relaxed text-[#5e6b7b]">{feature.text}</span>
      <span className="relative mt-5 flex h-[150px] items-center justify-center">
        {feature.art === "seal" ? <SealArt className="h-[170px] w-[170px]" /> : <RecordArt />}
      </span>
      <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#0e1b2c] pl-4 pr-1.5 py-1.5 text-[14px] font-semibold text-white">
        {feature.cta}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c9920a] text-[#0e1b2c] transition-transform group-hover:translate-x-0.5">
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </span>
    </Link>
  );
}
