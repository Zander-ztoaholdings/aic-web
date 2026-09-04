'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Download,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Scale,
  Map,
  Newspaper,
  Loader2,
  Eye,
  MessageSquare,
  Bell,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

const heroBg = "https://images.unsplash.com/photo-1585417239901-f3a4085218b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbG9iYWwlMjBkaWdpdGFsJTIwbmV0d29yayUyMGRhdGElMjBjb21wbGlhbmNlfGVufDF8fHx8MTc3MTk2MjY5MXww&ixlib=rb-4.1.0&q=80&w=1080";

const rights = [
  {
    article: "Article I",
    icon: Eye,
    title: "Human Agency",
    colorClass: "bg-aic-paper border-aic-navy/10 text-aic-navy",
    iconClass: "bg-aic-navy/5 text-aic-navy",
    scope: "All automated decision systems affecting natural persons",
    obligations: [
      "Every consequential automated decision must be reviewable by a named human",
      "Establish clear override protocols for algorithmic outcomes",
      "Maintain accessible records of human intervention in AI decisions",
      "Ensure human accountability for all high-risk system deployments",
    ],
    exceptions: "Exemptions available for national security systems under verified governmental review.",
  },
  {
    article: "Article II",
    icon: MessageSquare,
    title: "Explanation",
    colorClass: "bg-aic-paper border-aic-navy/10 text-aic-navy",
    iconClass: "bg-aic-navy/5 text-aic-navy",
    scope: "Decisions with material impact on individual rights, welfare, or opportunities",
    obligations: [
      "Provide plain-language explanations of any automated outcome",
      "Explain the key factors and data points influencing the decision",
      "Ensure explanations are human-readable and accessible",
      "Offer explanations within a documented, timely timeframe",
    ],
    exceptions: "Proprietary algorithm details may be withheld where trade secrets apply, provided a functional explanation is still offered.",
  },
  {
    article: "Article III",
    icon: Bell,
    title: "Empathy",
    colorClass: "bg-aic-paper border-aic-navy/10 text-aic-navy",
    iconClass: "bg-aic-navy/5 text-aic-navy",
    scope: "All communications regarding consequential automated outcomes",
    obligations: [
      "Meet minimum standards of human dignity in all automated notices",
      "Avoid cold, purely algorithmic language in critical communications",
      "Ensure notifications respect the humanity of the recipient",
      "Maintain empathy standards in automated rejections and decisions",
    ],
    exceptions: "Technical system logs and low-level status updates are exempt.",
  },
  {
    article: "Article IV",
    icon: RefreshCw,
    title: "Correction",
    colorClass: "bg-aic-paper border-aic-navy/10 text-aic-navy",
    iconClass: "bg-aic-navy/5 text-aic-navy",
    scope: "All high-stakes automated decisions (credit, employment, healthcare, legal)",
    obligations: [
      "Provide a formal right to trigger a human review of any decision",
      "Guarantee human reconsideration of contested algorithmic outcomes",
      "Ensure errors are corrected within a documented timeframe",
      "Maintain logs of all corrections and reconsideration requests",
    ],
    exceptions: "Low-risk routine automated transactions may have simplified review pathways.",
  },
  {
    article: "Article V",
    icon: UserCheck,
    title: "Truth",
    colorClass: "bg-aic-paper border-aic-navy/10 text-aic-navy",
    iconClass: "bg-aic-navy/5 text-aic-navy",
    scope: "All AI-mediated interactions and evaluations",
    obligations: [
      "Inform individuals when they are interacting with an AI system",
      "Disclose AI evaluation prior to the interaction affecting the person",
      "Use clear and unambiguous truth-in-automation disclosures",
      "Maintain audit trails of all transparency disclosures",
    ],
    exceptions: "Fully automated internal technical processes with no human impact are exempt.",
  },
];


export interface PolicyUpdate {
  id: string | number;
  date: string;
  tag: string;
  title: string;
  summary: string;
  /** Empty for rows with no slug set; such an update has no page to link to. */
  slug?: string;
}

interface GovernanceHubClientProps {
  /** null = the CMS could not be reached. [] = reachable, nothing published. */
  initialPolicyUpdates: PolicyUpdate[] | null;
  initialNextCursor: string | null;
}

export default function GovernanceHubClient({
  initialPolicyUpdates,
  initialNextCursor,
}: GovernanceHubClientProps) {
  const [expandedRight, setExpandedRight] = useState<number | null>(null);
  
  const policyUnavailable = initialPolicyUpdates === null;
  const [policyUpdates, setPolicyUpdates] = useState<PolicyUpdate[]>(initialPolicyUpdates ?? []);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMorePolicies = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(`/api/notion/policy-updates?cursor=${nextCursor}`);
      const data = await res.json();
      setPolicyUpdates(prev => [...prev, ...data.results]);
      setNextCursor(data.nextCursor);
    } catch {
      // silently fail — user can retry via button
    } finally {
      setIsLoadingMore(false);
    }
  };


  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 to-[#0a1628]/80" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[#c9920a]" />
            <span className="text-[#c9920a] text-sm uppercase tracking-widest">Governance Hub</span>
          </div>
          <h1 className="text-5xl text-white mb-4" style={{ fontFamily: "'Merriweather', serif", fontWeight: 700 }}>
            The Declaration of<br />
            <span className="text-[#c9920a]">Algorithmic Rights</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-8">
            The five rights AIC certifies against, the regulatory picture we maintain, and the
            policy developments we&apos;re tracking &mdash; for researchers, regulators and
            policymakers.
          </p>
          <div className="flex gap-4">
            <a
              href="#declaration"
              className="inline-flex items-center gap-2 bg-[#c9920a] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#b07d08] transition-colors"
            >
              <Scale className="w-4 h-4" /> Declaration of Rights
            </a>
            <a
              href="#standards-map"
              className="inline-flex items-center gap-2 bg-aic-paper/10 text-aic-paper px-6 py-3 rounded-lg text-sm font-medium hover:bg-aic-paper/20 transition-colors border border-aic-paper/20"
            >
              <Map className="w-4 h-4" /> Global Standards Map
            </a>
          </div>
        </div>
      </section>

      {/* Declaration of Algorithmic Rights */}
      <section id="declaration" className="py-20 bg-aic-paper">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/3 lg:sticky lg:top-24">
              <span className="text-[#c9920a] text-sm uppercase tracking-widest">Universal Standard</span>
              <h2 className="text-3xl text-[#0f1f3d] mt-2 mb-4" style={{ fontFamily: "'Merriweather', serif" }}>
                Declaration of Algorithmic Rights
              </h2>
              <p className="text-[#0f1f3d] text-sm leading-relaxed mb-6 font-medium">
                The Declaration of Algorithmic Rights establishes five fundamental entitlements for every person interacting with automated systems. These rights form the cornerstone of all AIC certification assessments.
              </p>
              <div className="bg-[#f0f4f8] rounded-xl p-5 border border-[#e5e7eb]">
                <div className="text-xs text-[#0f1f3d] uppercase tracking-wider mb-3 font-bold opacity-70">Document Reference</div>
                <a
                  href="/AIC-Declaration-of-Algorithmic-Rights.pdf" 
                  download 
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-[#c9920a] text-white text-sm py-2.5 rounded-lg hover:bg-[#b07d08] transition-colors"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </a>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-4">
              {rights.map((right, i) => {
                const Icon = right.icon;
                const isExpanded = expandedRight === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`border rounded-xl overflow-hidden transition-all ${right.colorClass}`}
                  >
                    <button
                      className="w-full flex items-center gap-4 p-5 text-left"
                      aria-expanded={isExpanded}
                      onClick={() => setExpandedRight(isExpanded ? null : i)}
                    >
                      <div className={`w-10 h-10 rounded-lg ${right.iconClass} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs uppercase tracking-wider opacity-60">{right.article}</div>
                        <div className="font-semibold">{right.title}</div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 opacity-60" />
                      ) : (
                        <ChevronRight className="w-4 h-4 opacity-60" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-4">
                        <div>
                          <div className="text-xs uppercase tracking-wider opacity-60 mb-1">Scope of Application</div>
                          <p className="text-sm">{right.scope}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wider opacity-60 mb-2">Compliance Obligations</div>
                          <ul className="space-y-1.5">
                            {right.obligations.map((ob, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0 opacity-60"></span>
                                {ob}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wider opacity-60 mb-1">Recognized Exceptions</div>
                          <p className="text-sm opacity-80">{right.exceptions}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Global Standards Map */}
      <section id="standards-map" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <span className="text-[#c9920a] text-sm uppercase tracking-widest">Global Overview</span>
            <h2 className="text-3xl text-[#0f1f3d] mt-2 mb-2" style={{ fontFamily: "'Merriweather', serif" }}>
              AI Regulatory Map
            </h2>
            <p className="text-[#6b7280] text-sm max-w-2xl">
              An interactive, country-by-country view of AI-relevant regulation — built from verified public
              sources, with draft compliance-measure summaries you can download.
            </p>
          </div>

          <Link
            href="/regulatory-map"
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-xl border border-[#e5e7eb] bg-aic-paper p-8 hover:border-[#c9920a] hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#0a1628] flex items-center justify-center shrink-0">
                <Map className="w-5 h-5 text-[#c9920a]" />
              </div>
              <div>
                <div className="text-[#0f1f3d] font-semibold text-lg">Open the Regulatory Map</div>
                <div className="text-[#6b7280] text-sm">
                  Click any mapped country for its framework, authority, status, and a draft compliance-measures download.
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-[#c9920a] font-semibold text-sm shrink-0">
              View map <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* Policy Updates */}
      <section id="policy-updates" className="py-20 bg-aic-paper">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-[#c9920a] text-sm uppercase tracking-widest">Intelligence</span>
              <h2 className="text-3xl text-[#0f1f3d] mt-2" style={{ fontFamily: "'Merriweather', serif" }}>
                Policy Updates
              </h2>
            </div>
            <Link
              href="/policy"
              className="flex items-center gap-2 text-sm text-[#0f1f3d] border border-[#e5e7eb] px-4 py-2 rounded-lg hover:bg-[#f0f4f8] transition-colors"
            >
              <Newspaper className="w-4 h-4" /> All updates
            </Link>
          </div>

          {policyUpdates.length === 0 && (
            <div className="border border-[#e5e7eb] rounded-xl bg-white p-10 text-center max-w-2xl mx-auto">
              <Newspaper className="w-10 h-10 text-[#e5e7eb] mx-auto mb-4" />
              <p className="text-[#0f1f3d] font-semibold mb-2">
                {policyUnavailable
                  ? "We can't load policy updates right now."
                  : "No policy updates published yet."}
              </p>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                When we publish a regulatory development, it will appear here with its
                source. In the meantime, the{" "}
                <Link href="/regulatory-map" className="text-aic-copper hover:underline">
                  regulatory map
                </Link>{" "}
                covers where AI regulation currently stands by jurisdiction.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policyUpdates.map((update, i) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.1 }}
                className="border border-[#e5e7eb] rounded-xl p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    update.tag === "Regulatory" ? "bg-[#d4183d]/10 text-[#d4183d]" :
                    update.tag === "Standards" ? "bg-[#1a3160]/10 text-[#1a3160]" :
                    update.tag === "Accreditation" ? "bg-[#c9920a]/10 text-[#c9920a]" :
                    "bg-[#f0f4f8] text-[#6b7280]"
                  }`}>
                    {update.tag}
                  </span>
                  <span className="text-xs text-[#6b7280]/60">{update.date}</span>
                </div>
                <h3 className="text-[#0f1f3d] font-semibold mb-2 leading-snug">{update.title}</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed mb-4">{update.summary}</p>
                {/* Without this the body written for each update was
                    unreachable: the card showed the summary and stopped. */}
                {update.slug && (
                  <Link
                    href={`/policy/${update.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-aic-copper hover:gap-2.5 transition-all"
                  >
                    Read the update <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {nextCursor && (
            <div className="mt-12 flex justify-center">
              <Button
                onClick={handleLoadMorePolicies}
                disabled={isLoadingMore}
                className="bg-aic-paper border border-[#e5e7eb] text-[#0f1f3d] hover:bg-[#f0f4f8] px-8 py-6 h-auto text-base"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Policy Updates"
                )}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
