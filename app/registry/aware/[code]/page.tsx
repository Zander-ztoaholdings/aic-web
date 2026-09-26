import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CircleSlash, Clock, AlertTriangle } from "lucide-react";
import { normaliseBadgeCode, verifyBadge } from "@/lib/aware-platform";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `AIC Aware badge ${normaliseBadgeCode(decodeURIComponent(code)) ?? ""} — AIC Public Registry`,
    robots: { index: false },
  };
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

// An AIC Aware badge's entry in the public registry, and where every embedded
// badge links to. Answers one question — is this badge real and current — from
// the platform that issued it, on every request. Kept in its own section of the
// registry: AIC Aware is self-declared, and is never listed among certified
// organisations.
export default async function VerifyBadgePage({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = normaliseBadgeCode(decodeURIComponent(raw));
  const badge = code ? await verifyBadge(code) : "not-found";

  const tone =
    badge === null
      ? { icon: AlertTriangle, ring: "bg-amber-50 text-amber-600", title: "Verification is temporarily unavailable", sub: "This is an outage, not a result. Please try again shortly." }
      : badge === "not-found"
        ? { icon: CircleSlash, ring: "bg-red-50 text-[#c41e3a]", title: "No badge with this code", sub: "AIC has not issued an AIC Aware badge with this code. If you saw it on a website, it is not genuine." }
        : badge.status === "valid"
          ? { icon: BadgeCheck, ring: "bg-emerald-50 text-emerald-600", title: "Valid AIC Aware badge", sub: "Issued by AIC to a registered organisation, on a declaration by a named accountable person." }
          : badge.status === "expired"
            ? { icon: Clock, ring: "bg-gray-100 text-gray-500", title: "This badge has expired", sub: "AIC Aware badges are valid for twelve months. This one has not been renewed." }
            : { icon: CircleSlash, ring: "bg-red-50 text-[#c41e3a]", title: "This badge has been revoked", sub: badge.revocationReason ?? "It is no longer valid." };
  const Icon = tone.icon;
  const found = badge !== null && badge !== "not-found" ? badge : null;

  return (
    <div className="min-h-screen bg-[#f7f7f5] font-sans">
      <div className="mx-auto max-w-xl px-4 py-20">
        <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center justify-center gap-1.5 text-[12px] text-[#9ca3af]">
          <Link href="/registry" className="hover:text-[#0f1f3d]">Public Registry</Link>
          <span aria-hidden>›</span>
          <Link href="/registry/aware" className="hover:text-[#0f1f3d]">AIC Aware</Link>
          <span aria-hidden>›</span>
          <span className="text-[#6b7280]">{found?.organisation ?? code ?? "Badge"}</span>
        </nav>
        <div className="text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-aic-copper">AIC Public Registry · AIC Aware</span>
          <div className={`mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-2xl ${tone.ring}`}>
            <Icon className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#0f1f3d]">{tone.title}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#6b7280]">{tone.sub}</p>
        </div>

        {found && (
          <dl className="mt-10 divide-y divide-[#eceae4] overflow-hidden rounded-2xl border border-[#eceae4] bg-white shadow-[0_1px_4px_rgba(10,22,40,0.05)]">
            {[
              ["Organisation", found.organisation],
              ["Badge code", found.code],
              ["Issued", fmt(found.issuedAt)],
              [found.status === "expired" ? "Expired" : "Valid until", fmt(found.expiresAt)],
              ["Accountable person", found.accountablePersonNamed ? "Named on the declaration" : "—"],
              ["Question set", found.questionSetVersion],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                <dt className="text-[#6b7280]">{k}</dt>
                <dd className={`text-right font-medium text-[#0f1f3d] ${k === "Badge code" || k === "Question set" ? "font-mono" : ""}`}>{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <p className="mt-8 text-center text-xs leading-relaxed text-[#9ca3af]">
          AIC Aware is a self-declaration. It is not AIC Certified and has not been independently audited.
          Certified organisations appear on the{" "}
          <Link href="/registry" className="underline underline-offset-2 hover:text-[#0f1f3d]">public registry</Link>.
        </p>

        <div className="mt-8 text-center">
          <Link href="/aware" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f1f3d] hover:gap-3 transition-all">
            Take the free AIC Aware self-check <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
