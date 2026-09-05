import Link from "next/link";
import { Gauge, ArrowRight, AlertTriangle, Building2 } from "lucide-react";
import { listAwareDirectory } from "@/lib/aware-directory";

// Server-rendered for the same reason /registry is: this list must reflect
// real data, not a build-time snapshot.
export const dynamic = "force-dynamic";

// listAwareDirectory() returns null when the datastore is unreachable and []
// when nobody has opted in yet — rendered differently on purpose, mirroring
// the distinction lib/registry.ts draws for the certified register (an
// outage must never read as "nobody has declared").
export default async function AwareDirectoryPage() {
  const entries = await listAwareDirectory();

  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      <section className="bg-aic-navy text-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-6 h-6 text-aic-copper" />
            <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
              AIC Aware
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl mb-6 leading-[1.1] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Organisations that have declared
          </h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            Everyone here has completed the free AIC Aware self-assessment and chosen to be named.
            By design, this list shows who has declared and when — never a score, never a risk
            level, never anything that could be mistaken for a verified result. That distinction
            belongs only to the{" "}
            <Link href="/registry" className="text-aic-copper underline underline-offset-2">
              AIC Certified public registry
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          {entries === null ? (
            <div className="flex items-start gap-3 bg-[#fef3f2] border border-[#fecaca] rounded-xl p-6">
              <AlertTriangle className="w-5 h-5 text-[#c41e3a] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#0f1f3d] mb-1">
                  The directory can&apos;t be reached right now.
                </p>
                <p className="text-sm text-[#6b7280]">
                  This is an outage, not an empty list — please check back shortly.
                </p>
              </div>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex items-start gap-3 bg-[#f0f4f8] border border-[#e5e7eb] rounded-xl p-6">
              <Building2 className="w-5 h-5 text-[#6b7280] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#0f1f3d] mb-1">
                  Nobody has opted into the directory yet.
                </p>
                <p className="text-sm text-[#6b7280]">
                  Be the first — the assessment takes about ten minutes.
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-[#e5e7eb] border border-[#e5e7eb] rounded-xl overflow-hidden bg-white">
              {entries.map((e) => (
                <li key={`${e.company}-${e.declaredOn}`} className="flex items-center justify-between px-6 py-4">
                  <span className="text-[#0f1f3d] font-medium">{e.company}</span>
                  <span className="text-sm text-[#6b7280] font-mono">{e.declaredOn}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10">
            <Link
              href="/aware"
              className="inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] text-white px-6 py-3.5 rounded-full transition-all text-sm font-bold"
            >
              Take the free assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
