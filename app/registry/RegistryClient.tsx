"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Building2,
  ArrowRight,
  Info,
  AlertTriangle,
} from "lucide-react";
import type { RegistryListing } from "@/lib/registry";

const statusBands = [
  {
    label: "Certified",
    detail: "Active certification in good standing. Full listing.",
  },
  {
    label: "Certified — Provisional",
    detail: "Listed with a 90-day remediation notation.",
  },
  {
    label: "Suspended / Lapsed",
    detail:
      "Status history stays visible — certificates are never silently removed.",
  },
];

const STATUS_TONE: Record<string, string> = {
  "Certified — Active": "bg-[#10b981]/10 text-[#0a7a54]",
  "Certified — Provisional": "bg-aic-copper/10 text-aic-copper",
  Suspended: "bg-[#d4183d]/10 text-[#d4183d]",
  Lapsed: "bg-[#6b7280]/10 text-[#4b5563]",
  Expired: "bg-[#6b7280]/10 text-[#4b5563]",
};

export default function RegistryClient({
  entries,
}: {
  /** null means the register could not be reached — deliberately rendered
   *  differently from an empty register (see the page comment). */
  entries: RegistryListing[] | null;
}) {
  const [query, setQuery] = useState("");

  const filtered = (entries ?? []).filter(
    (e) =>
      e.organisation.toLowerCase().includes(query.toLowerCase()) ||
      e.certId.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-aic-navy text-white py-24 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-aic-copper" />
              <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
                Proof Layer
              </span>
            </div>
            <h1
              className="text-5xl mb-6 font-serif italic"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Public Registry
            </h1>
            <p className="text-xl text-white/70 max-w-3xl leading-relaxed">
              The register of organisations that hold AIC certification — the mechanism that makes
              a certification claim checkable, by anyone, in seconds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="py-16 border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
            <label htmlFor="registry-search" className="sr-only">
              Search the register by organisation name or certificate ID
            </label>
            <input
              id="registry-search"
              type="text"
              placeholder="Search by organisation name or certificate ID…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!entries || entries.length === 0}
              className="w-full pl-12 h-14 bg-white border border-[#e5e7eb] rounded-xl text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-aic-copper/30 disabled:bg-[#f0f4f8] disabled:cursor-not-allowed"
            />
          </div>
          <p className="text-sm text-[#6b7280] mt-4 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-aic-copper" />
            <span>
              Holding a badge that links here — not a listing itself — is what a certified
              organisation can show. Look a certificate up directly at{" "}
              <Link href="/verify" className="text-aic-copper hover:underline">
                /verify
              </Link>
              .
            </span>
          </p>
        </div>
      </section>

      {/* Results / empty state / unavailable */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {entries === null ? (
            /* Outage — never render this as "no organisation is certified",
               which would be a false statement rather than an empty one. */
            <div className="text-center py-20 border border-dashed border-[#e5e7eb] rounded-xl bg-white">
              <AlertTriangle className="w-8 h-8 text-aic-copper mx-auto mb-4" />
              <p className="text-lg text-[#0f1f3d] font-medium mb-2">
                The register can&apos;t be reached right now.
              </p>
              <p className="text-[#6b7280] max-w-md mx-auto">
                This is a temporary fault on our side, not a statement about any certificate.
                Please try again shortly, or verify a specific certificate ID at{" "}
                <Link href="/verify" className="text-aic-copper hover:underline">
                  /verify
                </Link>
                .
              </p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#e5e7eb] rounded-xl bg-white">
              <Building2 className="w-8 h-8 text-[#9ca3af] mx-auto mb-4" />
              <p className="text-lg text-[#0f1f3d] font-medium mb-2">
                The register opens with our founding cohort, currently forming.
              </p>
              <p className="text-[#6b7280] max-w-md mx-auto">
                No organisation currently holds AIC certification. This page will list each certified
                organisation, its certificate ID, status, scope and validity as soon as the first
                certification is issued.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 text-aic-copper font-semibold hover:underline"
              >
                Enquire about the founding cohort <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-8 h-8 text-[#e5e7eb] mx-auto mb-4" />
              <p className="text-[#6b7280]">
                No entry matches &ldquo;{query}&rdquo;. If an organisation gave you a certificate ID,
                check it at{" "}
                <Link href="/verify" className="text-aic-copper hover:underline">
                  /verify
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((entry) => (
                <div
                  key={entry.certId}
                  className="border border-[#e5e7eb] rounded-lg p-6 bg-white"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="font-semibold text-[#0f1f3d] text-lg">
                      {entry.organisation}
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded ${
                        STATUS_TONE[entry.status] ?? "bg-[#f0f4f8] text-[#6b7280]"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </div>
                  <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="flex gap-2">
                      <dt className="text-[#9ca3af]">Certificate</dt>
                      <dd className="text-[#0f1f3d] font-mono">{entry.certId}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-[#9ca3af]">Division</dt>
                      <dd className="text-[#6b7280]">{entry.division}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-[#9ca3af]">Issued</dt>
                      <dd className="text-[#6b7280]">{entry.issued}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-[#9ca3af]">Expires</dt>
                      <dd className="text-[#6b7280]">{entry.expires}</dd>
                    </div>
                  </dl>
                  {entry.remediationNote && (
                    <p className="text-sm text-aic-copper mt-3">{entry.remediationNote}</p>
                  )}
                  <Link
                    href={`/verify/${encodeURIComponent(entry.certId)}`}
                    className="inline-flex items-center gap-1.5 text-sm text-aic-copper font-medium mt-4 hover:gap-2.5 transition-all"
                  >
                    Verify this certificate <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Status bands explainer */}
      <section className="py-20 bg-white border-t border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4">
          <h2
            className="text-2xl md:text-3xl text-[#0f1f3d] mb-10 font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            How to read a registry status
          </h2>
          <div className="space-y-8">
            {statusBands.map((band) => (
              <div key={band.label} className="border-t border-[#e5e7eb] pt-6">
                <div className="text-aic-copper font-semibold uppercase tracking-wide text-xs mb-2">
                  {band.label}
                </div>
                <p className="text-[#6b7280] leading-relaxed">{band.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#6b7280] mt-10 leading-relaxed">
            The registry never shows a numeric score — a separate instrument (the AI Governance
            Index) handles scoring. Status is deliberately binary: certified, provisional, or not.
          </p>
        </div>
      </section>
    </div>
  );
}
