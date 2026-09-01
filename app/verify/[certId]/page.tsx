import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, Flag, Search } from "lucide-react";

// Stage 1: no certifications have been issued yet, so every lookup is genuinely
// unknown — this route always renders the "No record" state (§8.4 of the
// Website Master PRD). Once the Notion-backed registry sync lands, this becomes
// a server-rendered lookup against the real dataset and this file gains the
// valid / suspended / lapsed / assessed-unlisted branches; the empty state
// below stays as the final fallback for a genuinely unknown ID.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certId: string }>;
}): Promise<Metadata> {
  const { certId } = await params;
  return {
    title: `Verify ${certId}`,
    robots: { index: false, follow: true },
  };
}

export default async function VerifyCertPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const decoded = decodeURIComponent(certId);

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
          <h1 className="text-3xl md:text-4xl font-mono break-all">{decoded}</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="border border-[#e5e7eb] rounded-xl bg-white p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d4183d]/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#d4183d]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0f1f3d] mb-2">No record</h2>
                <p className="text-[#6b7280] leading-relaxed">
                  AIC has no certificate on record matching this ID. No certifications have been
                  issued yet — the register opens with our founding cohort, currently forming.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[#e5e7eb]">
              <p className="text-sm text-[#6b7280] mb-4 leading-relaxed">
                If an organisation presented this ID as an AIC certification, that claim cannot be
                confirmed. Please report it — this is how the register polices itself.
              </p>
              <a
                href={`mailto:zander@ztoaholdings.com?subject=${encodeURIComponent(
                  `Unverifiable AIC certificate ID: ${decoded}`
                )}`}
                className="inline-flex items-center gap-2 bg-aic-navy text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#0f1f3d] transition-all"
              >
                <Flag className="w-4 h-4" />
                Report this ID
              </a>
            </div>
          </div>

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
