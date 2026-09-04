import Link from "next/link";
import { Newspaper, ArrowRight, Map } from "lucide-react";
import { getPolicyUpdates } from "@/lib/notion";

// Editorial content, safe to cache. The registry and /verify stay dynamic
// because they assert something about the present; this does not.
export const revalidate = 300;

const TAG_STYLES: Record<string, string> = {
  Regulatory: "bg-[#d4183d]/10 text-[#d4183d]",
  Standards: "bg-[#1a3160]/10 text-[#1a3160]",
  Enforcement: "bg-[#d4183d]/10 text-[#d4183d]",
  Guidance: "bg-[#c9920a]/10 text-[#c9920a]",
};

export default async function PolicyIndexPage() {
  const data = await getPolicyUpdates(50);

  // null means the CMS could not be reached; an empty array means it was
  // reached and has nothing published. These are different claims about the
  // world and the page says which one is true.
  const unavailable = data === null;
  const updates = data?.results ?? [];

  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-24">
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#162640] pt-24 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-aic-copper to-transparent" />
        <div className="max-w-5xl mx-auto px-4 relative">
          <span className="text-aic-copper text-sm uppercase tracking-widest">
            Intelligence
          </span>
          <h1
            className="text-4xl md:text-5xl text-aic-paper font-bold mt-3 leading-tight"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Policy Updates
          </h1>
          <p className="text-aic-paper/70 mt-5 max-w-2xl leading-relaxed">
            Regulatory and standards developments affecting accountable AI. Each
            entry states its primary source. We do not assert a deadline we have
            not read in the instrument itself.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        {updates.length === 0 ? (
          <div className="border border-[#e5e7eb] rounded-xl bg-white p-12 text-center">
            <Newspaper className="w-10 h-10 text-[#e5e7eb] mx-auto mb-4" />
            <p className="text-[#0f1f3d] font-semibold mb-2">
              {unavailable
                ? "We can't load policy updates right now."
                : "No policy updates published yet."}
            </p>
            <p className="text-[#6b7280] text-sm leading-relaxed max-w-md mx-auto">
              When we publish a regulatory development it appears here with its
              source. Meanwhile the{" "}
              <Link href="/regulatory-map" className="text-aic-copper hover:underline">
                regulatory map
              </Link>{" "}
              covers where AI regulation currently stands by jurisdiction.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => {
              const card = (
                <>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        TAG_STYLES[update.tag] ?? "bg-[#f0f4f8] text-[#6b7280]"
                      }`}
                    >
                      {update.tag}
                    </span>
                    <time
                      dateTime={update.date}
                      className="text-xs text-[#6b7280]/70 font-mono"
                    >
                      {update.date}
                    </time>
                  </div>
                  <h2
                    className="text-xl text-[#0f1f3d] font-semibold leading-snug mb-2"
                    style={{ fontFamily: "'Merriweather', serif" }}
                  >
                    {update.title}
                  </h2>
                  <p className="text-[#6b7280] text-sm leading-relaxed">
                    {update.summary}
                  </p>
                </>
              );

              // An update without a slug has no URL to link to. Rendering it as
              // a dead card is better than linking to /policy/undefined.
              return update.slug ? (
                <Link
                  key={update.id}
                  href={`/policy/${update.slug}`}
                  className="group block bg-white border border-[#e5e7eb] rounded-xl p-6 hover:shadow-md hover:border-aic-copper/40 transition-all"
                >
                  {card}
                  <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-aic-copper group-hover:gap-2.5 transition-all">
                    Read the update <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ) : (
                <div
                  key={update.id}
                  className="bg-white border border-[#e5e7eb] rounded-xl p-6"
                >
                  {card}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 border border-[#e5e7eb] rounded-xl bg-white p-8 text-center">
          <Map className="w-8 h-8 text-aic-copper mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-[#0f1f3d] mb-2 font-serif">
            Where regulation stands by jurisdiction
          </h2>
          <p className="text-[#6b7280] text-sm max-w-lg mx-auto mb-5 leading-relaxed">
            Updates record what changed. The regulatory map records the current
            position in each jurisdiction we track.
          </p>
          <Link
            href="/regulatory-map"
            className="inline-flex items-center gap-2 text-sm font-semibold text-aic-copper hover:gap-3 transition-all"
          >
            Open the regulatory map <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
