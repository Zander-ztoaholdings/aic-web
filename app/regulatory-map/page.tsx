import { Globe2 } from "lucide-react";
import RegulatoryMap, { type MapUpdate } from "@/app/components/RegulatoryMap";
import { getPolicyUpdates } from "@/lib/notion";
import { countriesForJurisdictions } from "@/app/data/regulatory-data";

// Metadata lives in ./layout.tsx alongside every other route's.

// The map itself is static data, but the updates attached to it are not.
export const revalidate = 300;

export default async function RegulatoryMapPage() {
  // Attach published updates to the countries they affect. This is what makes
  // the map a record rather than a snapshot: the dataset says where a
  // jurisdiction stands, and the updates say what moved it there and when.
  const data = await getPolicyUpdates(100);
  const updatesByCountry: Record<string, MapUpdate[]> = {};

  for (const update of data?.results ?? []) {
    if (!update.slug) continue; // no page to link to
    for (const code of countriesForJurisdictions(update.jurisdictions)) {
      (updatesByCountry[code] ??= []).push({
        title: update.title,
        date: update.date,
        slug: update.slug,
        tag: update.tag,
      });
    }
  }

  for (const list of Object.values(updatesByCountry)) {
    list.sort((a, b) => b.date.localeCompare(a.date));
  }

  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-aic-navy text-white py-24 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Globe2 className="w-6 h-6 text-aic-copper" />
            <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
              Regulatory Map
            </span>
          </div>
          <h1
            className="text-4xl md:text-6xl mb-6 leading-[1.05] tracking-[-0.03em] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Where AI regulation stands, by country
          </h1>
          <p className="text-xl text-white/70 max-w-3xl leading-relaxed">
            Click a country to see its AI-relevant regulatory framework, who administers it, and how
            it maps to AIC&apos;s certification methodology. Jurisdictions we haven&apos;t verified
            yet stay grey, on purpose — we&apos;d rather leave a gap visible than guess.
          </p>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1600px] mx-auto px-4">
          <RegulatoryMap updatesByCountry={updatesByCountry} />
        </div>
      </section>

      {/* Disclaimer strip */}
      <section className="py-16 bg-white border-t border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-[#0f1f3d] mb-3">
            How to use this map
          </h2>
          <p className="text-[#6b7280] leading-relaxed">
            This map is a general orientation guide, built and maintained by AIC from public
            regulatory sources. It is not legal advice, and coverage is intentionally partial —
            we add a jurisdiction once we have a verified reference point for it, rather than
            estimate one. The downloadable summaries are draft documents: a starting point for your
            own review, not a certificate of compliance. If you spot something out of date, or want
            us to prioritise a jurisdiction, get in touch.
          </p>
        </div>
      </section>
    </div>
  );
}
