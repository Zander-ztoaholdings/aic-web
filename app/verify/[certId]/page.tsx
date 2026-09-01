import Link from "next/link";
import type { Metadata } from "next";
import {
  AlertTriangle,
  Flag,
  Search,
  ShieldCheck,
  ShieldAlert,
  CircleSlash,
} from "lucide-react";
import { verifyCertificate } from "@/lib/registry";

// The URL printed on every badge (PRD §8.4). Answers for ALL statuses, not just
// the happy path: a register that can only confirm good news is not a register.
//
// force-dynamic for the same reason as /registry — a cached "valid" for a
// certificate suspended an hour ago is precisely the failure this route exists
// to prevent.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certId: string }>;
}): Promise<Metadata> {
  const { certId } = await params;
  return {
    title: `Verify ${decodeURIComponent(certId)}`,
    // Individual lookups are not search-index material; the register itself is.
    robots: { index: false, follow: true },
  };
}

function Shell({
  certId,
  children,
}: {
  certId: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      <section className="bg-aic-navy text-white py-20">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-6 h-6 text-aic-copper" />
            <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
              Certificate Lookup
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-mono break-all">{certId}</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4">
          {children}
          <p className="text-sm text-[#6b7280] mt-8 text-center">
            Looking for the full list of certified organisations?{" "}
            <Link href="/registry" className="text-aic-copper hover:underline">
              View the public registry
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

function Card({
  tone,
  icon,
  title,
  children,
}: {
  tone: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#e5e7eb] rounded-xl bg-white p-8">
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tone}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-[#0f1f3d] mb-2">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-wrap gap-2 py-2 border-b border-[#e5e7eb] last:border-0">
      <dt className="text-[#9ca3af] text-sm w-32 shrink-0">{label}</dt>
      <dd className="text-[#0f1f3d] text-sm">{value}</dd>
    </div>
  );
}

function ReportBlock({ certId }: { certId: string }) {
  return (
    <div className="mt-8 pt-8 border-t border-[#e5e7eb]">
      <p className="text-sm text-[#6b7280] mb-4 leading-relaxed">
        If an organisation presented this ID as an AIC certification, that claim cannot be
        confirmed. Please report it — this is how the register polices itself.
      </p>
      <a
        href={`mailto:zander@ztoaholdings.com?subject=${encodeURIComponent(
          `Unverifiable AIC certificate ID: ${certId}`
        )}`}
        className="inline-flex items-center gap-2 bg-aic-navy text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#0f1f3d] transition-all"
      >
        <Flag className="w-4 h-4" />
        Report this ID
      </a>
    </div>
  );
}

export default async function VerifyCertPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const decoded = decodeURIComponent(certId);
  const result = await verifyCertificate(decoded);

  if (result.outcome === "listed") {
    const l = result.listing;
    return (
      <Shell certId={decoded}>
        <Card
          tone="bg-[#10b981]/10"
          icon={<ShieldCheck className="w-5 h-5 text-[#0a7a54]" />}
          title={l.status}
        >
          <p className="text-[#6b7280] leading-relaxed mb-6">
            AIC confirms this certificate. {l.organisation} holds AIC certification with the
            scope and validity below.
          </p>
          <dl>
            <DetailRow label="Organisation" value={l.organisation} />
            <DetailRow label="Certificate" value={l.certId} />
            <DetailRow label="Division" value={l.division} />
            <DetailRow label="Scope" value={l.scope} />
            <DetailRow label="Issued" value={l.issued} />
            <DetailRow label="Expires" value={l.expires} />
          </dl>
          {l.remediationNote && (
            <p className="text-sm text-aic-copper mt-4">{l.remediationNote}</p>
          )}
        </Card>
      </Shell>
    );
  }

  if (result.outcome === "confirmed-unlisted") {
    return (
      <Shell certId={decoded}>
        <Card
          tone="bg-aic-copper/10"
          icon={<ShieldCheck className="w-5 h-5 text-aic-copper" />}
          title="AIC Assessed"
        >
          <p className="text-[#6b7280] leading-relaxed mb-6">
            {result.organisation} holds AIC Assessed status. This is confirmed here but is not
            listed on the public register — Assessed status is a verified self-assessment, not
            certification, and the two are deliberately kept distinct.
          </p>
          <dl>
            <DetailRow label="Organisation" value={result.organisation} />
            <DetailRow label="Certificate" value={result.certId} />
            <DetailRow label="Scope" value={result.scope} />
            <DetailRow label="Issued" value={result.issued} />
          </dl>
        </Card>
      </Shell>
    );
  }

  if (result.outcome === "not-current") {
    return (
      <Shell certId={decoded}>
        <Card
          tone="bg-[#d4183d]/10"
          icon={<ShieldAlert className="w-5 h-5 text-[#d4183d]" />}
          title={result.status}
        >
          <p className="text-[#6b7280] leading-relaxed mb-6">
            This certificate exists on the register but is not currently valid. AIC does not
            delete certificates — status history stays visible, so a lapse can always be seen
            rather than quietly disappearing.
          </p>
          <dl>
            <DetailRow label="Organisation" value={result.organisation} />
            <DetailRow label="Certificate" value={result.certId} />
            <DetailRow label="Status" value={result.status} />
            <DetailRow label="Since" value={result.since} />
          </dl>
          <ReportBlock certId={decoded} />
        </Card>
      </Shell>
    );
  }

  if (result.outcome === "unavailable") {
    // Deliberately not "no record". Answering a verification query with a false
    // negative during an outage would undermine the one thing this route is for.
    return (
      <Shell certId={decoded}>
        <Card
          tone="bg-aic-copper/10"
          icon={<CircleSlash className="w-5 h-5 text-aic-copper" />}
          title="Verification temporarily unavailable"
        >
          <p className="text-[#6b7280] leading-relaxed">
            We can&apos;t reach the register right now, so we can&apos;t confirm or deny this
            certificate. This is a fault on our side and says nothing about the certificate
            itself. Please try again shortly.
          </p>
        </Card>
      </Shell>
    );
  }

  // register-empty and no-record both end here, with wording matched to which
  // is true — an empty register is a different statement from a bad ID.
  return (
    <Shell certId={decoded}>
      <Card
        tone="bg-[#d4183d]/10"
        icon={<AlertTriangle className="w-5 h-5 text-[#d4183d]" />}
        title="No record"
      >
        <p className="text-[#6b7280] leading-relaxed">
          {result.outcome === "register-empty"
            ? "AIC has no certificate on record matching this ID. No certifications have been issued yet — the register opens with our founding cohort, currently forming."
            : "AIC has no certificate on record matching this ID."}
        </p>
        <ReportBlock certId={decoded} />
      </Card>
    </Shell>
  );
}
