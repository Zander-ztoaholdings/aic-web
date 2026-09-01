"use client";

import { useEffect, useMemo, useState } from "react";
import * as d3geo from "d3-geo";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import Link from "next/link";
import { Download, Mail, X, MapPin } from "lucide-react";
import {
  regulatoryData,
  regulatoryDataReviewedAt,
  type CountryRegulation,
} from "@/app/data/regulatory-data";

const STATUS_TONE: Record<string, string> = {
  "In force": "bg-[#10b981]/10 text-[#0a7a54]",
  "Enacted — phasing in": "bg-aic-copper/10 text-aic-copper",
  "Proposed / draft legislation": "bg-[#c9920a]/10 text-[#8a6607]",
  "Voluntary framework": "bg-[#6b7280]/10 text-[#4b5563]",
  "Guidance only": "bg-[#6b7280]/10 text-[#4b5563]",
  "No dedicated AI law identified": "bg-[#f0f4f8] text-[#9ca3af]",
};

interface CountryFeature {
  id: string;
  name: string;
  path: string;
}

export default function RegulatoryMap() {
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const width = 960;
  const height = 520;

  useEffect(() => {
    let cancelled = false;
    fetch("/data/countries-50m.json")
      .then((r) => r.json())
      .then((topo: Topology) => {
        if (cancelled) return;
        const geo = topojson.feature(
          topo,
          topo.objects.countries as GeometryCollection
        ) as unknown as FeatureCollection<Geometry, { name?: string }>;

        const projection = d3geo
          .geoNaturalEarth1()
          .fitSize([width, height], geo);
        const path = d3geo.geoPath(projection);

        const features: CountryFeature[] = geo.features
          .map((f) => {
            const d = path(f);
            if (!d) return null;
            return {
              id: String(f.id ?? ""),
              name: f.properties?.name ?? "Unknown",
              path: d,
            };
          })
          .filter((f): f is CountryFeature => f !== null);

        setCountries(features);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const selected: CountryRegulation | undefined = useMemo(
    () => (selectedId ? regulatoryData[selectedId] : undefined),
    [selectedId]
  );
  const selectedName = useMemo(
    () => countries.find((c) => c.id === selectedId)?.name,
    [countries, selectedId]
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
      {/* Map */}
      <div className="flex-1 lg:pr-8">
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 sm:p-8">
          {loading ? (
            <div className="aspect-[960/520] flex items-center justify-center text-[#9ca3af] text-sm">
              Loading map…
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto"
              role="img"
              aria-label="World map — click a country to see its regulatory status"
            >
              {countries.map((c) => {
                const hasData = Boolean(regulatoryData[c.id]);
                const isHovered = hoveredId === c.id;
                const isSelected = selectedId === c.id;
                return (
                  <path
                    key={c.id || c.name}
                    d={c.path}
                    className="transition-colors duration-150 cursor-pointer outline-none"
                    fill={
                      isSelected
                        ? "#c9920a"
                        : isHovered
                        ? hasData
                          ? "#dcae4c"
                          : "#c4c9d1"
                        : "#e5e7eb"
                    }
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    onMouseEnter={() => setHoveredId(c.id)}
                    onMouseLeave={() => setHoveredId((h) => (h === c.id ? null : h))}
                    onClick={() => setSelectedId(c.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelectedId(c.id);
                    }}
                    tabIndex={0}
                    aria-label={c.name}
                  >
                    <title>{c.name}</title>
                  </path>
                );
              })}
            </svg>
          )}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#e5e7eb] text-xs text-[#6b7280]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#e5e7eb] inline-block" />
              Not yet mapped
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#dcae4c] inline-block" />
              Hover a mapped jurisdiction
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-aic-copper inline-block" />
              Selected
            </div>
          </div>
        </div>
        <p className="text-xs text-[#9ca3af] mt-4">
          Regulatory status reviewed {regulatoryDataReviewedAt}. General orientation only — not
          legal advice. Verify against primary sources before relying on it.
        </p>
      </div>

      {/* Side panel (desktop: fixed-width column; mobile: stacks below) */}
      <div className="w-full lg:w-96 shrink-0 lg:border-l lg:border-[#e5e7eb] lg:pl-8">
        {!selectedId ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#9ca3af]">
            <MapPin className="w-6 h-6 mb-3" />
            <p className="text-sm max-w-[220px]">
              Click a country to see its AI regulatory status.
            </p>
          </div>
        ) : selected ? (
          <div>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#0f1f3d]">{selectedName}</h3>
              <button
                onClick={() => setSelectedId(null)}
                className="text-[#9ca3af] hover:text-[#0f1f3d] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-1 rounded ${
                STATUS_TONE[selected.status] ?? "bg-[#f0f4f8] text-[#6b7280]"
              }`}
            >
              {selected.status}
            </span>
            <h4 className="text-[#0f1f3d] font-semibold mt-4 mb-1">{selected.framework}</h4>
            <p className="text-xs text-[#9ca3af] uppercase tracking-wide mb-4">
              {selected.authority}
            </p>
            <p className="text-[#6b7280] text-sm leading-relaxed mb-8">{selected.summary}</p>

            <a
              href={`/compliance-measures/${selected.pdfSlug}.pdf`}
              className="w-full inline-flex items-center justify-center gap-2 bg-aic-navy text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-[#0f1f3d] transition-all"
            >
              <Download className="w-4 h-4" />
              Download draft compliance measures
            </a>
            <p className="text-xs text-[#9ca3af] mt-3 leading-relaxed">
              Draft summary, generated from public framework information. Not yet reviewed by
              counsel — treat as a starting point, not a compliance certificate.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#0f1f3d]">{selectedName}</h3>
              <button
                onClick={() => setSelectedId(null)}
                className="text-[#9ca3af] hover:text-[#0f1f3d] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[#6b7280] text-sm leading-relaxed mb-6">
              This jurisdiction hasn&apos;t been mapped yet. We&apos;d rather say that plainly than
              guess at a regulatory position we haven&apos;t verified.
            </p>
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center gap-2 bg-aic-navy text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-[#0f1f3d] transition-all"
            >
              <Mail className="w-4 h-4" />
              Ask us to prioritise this jurisdiction
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
