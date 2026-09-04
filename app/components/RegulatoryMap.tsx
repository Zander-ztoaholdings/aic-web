"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3geo from "d3-geo";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import Link from "next/link";
import { Download, Mail, X, MapPin, CheckCircle2, Search } from "lucide-react";
import {
  regulatoryData,
  oldestVerification,
  type CountryRegulation,
} from "@/app/data/regulatory-data";

/** Display order for the mobile jurisdiction list. */
const REGION_ORDER = [
  "Africa",
  "Europe",
  "North America",
  "Latin America",
  "Middle East",
  "Asia-Pacific",
] as const;

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

/** A published policy update, as attached to a country on the map. */
export interface MapUpdate {
  title: string;
  date: string;
  slug: string;
  tag: string;
}

export default function RegulatoryMap({
  updatesByCountry = {},
}: {
  /** Country ISO numeric code -> updates affecting it, newest first. */
  updatesByCountry?: Record<string, MapUpdate[]>;
}) {
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Search exists because the map alone cannot be used to find a small country.
  // Vatican City is roughly one pixel at this projection; so are Monaco, San
  // Marino, Liechtenstein and Malta. Clicking is fine for Brazil and useless
  // for the places people most often need to look up.
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Searches every country on the map, not only the mapped ones, so looking up
  // an uncovered jurisdiction lands on the honest "not yet mapped" panel and
  // its prioritisation request rather than silently returning nothing.
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const scored = countries
      .filter((c) => c.name.toLowerCase().includes(q))
      .map((c) => ({
        country: c,
        mapped: Boolean(regulatoryData[c.id]),
        // Prefix matches first: typing "ind" should offer India before Indonesia.
        rank: c.name.toLowerCase().startsWith(q) ? 0 : 1,
      }));
    scored.sort(
      (a, b) => a.rank - b.rank || a.country.name.localeCompare(b.country.name)
    );
    return scored.slice(0, 8);
  }, [query, countries]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function choose(id: string) {
    setSelectedId(id);
    setQuery("");
    setOpen(false);
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || matches.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(matches[activeIndex].country.id);
    }
  }

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
        {/* Search. Rendered above the map on every breakpoint, and on mobile it
            is the ONLY way in — see the note on the SVG wrapper below. */}
        <div ref={searchRef} className="relative mb-4">
          <label htmlFor="jurisdiction-search" className="sr-only">
            Search for a country
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
            <input
              id="jurisdiction-search"
              type="text"
              role="combobox"
              aria-expanded={open && matches.length > 0}
              aria-controls="jurisdiction-search-results"
              aria-autocomplete="list"
              aria-activedescendant={
                open && matches.length > 0 ? `jsr-${activeIndex}` : undefined
              }
              autoComplete="off"
              placeholder="Search for a country — try Vatican, Malta, Singapore"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onSearchKeyDown}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#0f1f3d] placeholder:text-[#9ca3af] focus:outline-none focus:border-aic-copper focus:ring-2 focus:ring-aic-copper/20 transition-all disabled:opacity-50"
            />
          </div>

          {open && query.trim() !== "" && (
            <ul
              id="jurisdiction-search-results"
              role="listbox"
              aria-label="Matching countries"
              className="absolute z-20 mt-2 w-full bg-white border border-[#e5e7eb] rounded-lg shadow-lg overflow-hidden max-h-80 overflow-y-auto"
            >
              {matches.length === 0 ? (
                <li className="px-4 py-3 text-sm text-[#9ca3af]">
                  No country matches “{query.trim()}”.
                </li>
              ) : (
                matches.map((m, i) => (
                  <li key={m.country.id} id={`jsr-${i}`} role="option" aria-selected={i === activeIndex}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => choose(m.country.id)}
                      className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                        i === activeIndex ? "bg-[#f0f4f8]" : "bg-white"
                      }`}
                    >
                      <span className="text-sm text-[#0f1f3d]">{m.country.name}</span>
                      {/* Says up front whether there is anything to read, so an
                          uncovered country is not a dead end the user discovers
                          only after clicking. */}
                      <span
                        className={`text-[10px] uppercase tracking-wide font-semibold shrink-0 ${
                          m.mapped ? "text-aic-copper" : "text-[#9ca3af]"
                        }`}
                      >
                        {m.mapped ? "Mapped" : "Not yet mapped"}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* The SVG is desktop-only. At phone width a world map is not an
            interface: the tap targets for most countries are smaller than a
            fingertip, so it would be decoration that costs a 750KB download.
            Mobile gets the search box above and the region list below. */}
        <div className="hidden lg:block bg-white border border-[#e5e7eb] rounded-xl p-4 sm:p-8">
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
        {/* Mobile substitute for the map: the 28 covered jurisdictions, grouped
            by region, so someone on a phone can browse rather than having to
            already know the name of the country they want. */}
        <div className="lg:hidden">
          {loading ? (
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 text-sm text-[#9ca3af]">
              Loading jurisdictions…
            </div>
          ) : (
            <div className="space-y-5">
              {REGION_ORDER.map((region) => {
                const inRegion = Object.values(regulatoryData)
                  .filter((c) => c.region === region)
                  .map((c) => ({
                    reg: c,
                    name:
                      countries.find((f) => f.id === c.id)?.name ?? c.framework,
                  }))
                  .sort((a, b) => a.name.localeCompare(b.name));
                if (inRegion.length === 0) return null;
                return (
                  <div key={region}>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af] mb-2">
                      {region}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {inRegion.map(({ reg, name }) => (
                        <button
                          key={reg.id}
                          type="button"
                          onClick={() => setSelectedId(reg.id)}
                          aria-pressed={selectedId === reg.id}
                          className={`text-sm px-3 py-2 rounded-lg border transition-all ${
                            selectedId === reg.id
                              ? "border-aic-copper bg-aic-copper/10 text-aic-copper font-semibold"
                              : "border-[#e5e7eb] bg-white text-[#0f1f3d] hover:border-aic-copper/40"
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-xs text-[#9ca3af] mt-4">
          Every jurisdiction on this map has been checked against its primary
          source since {oldestVerification()}; each entry carries its own
          verification date. General orientation only — not legal advice. Verify
          against primary sources before relying on it.
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
            <p className="text-[#6b7280] text-sm leading-relaxed mb-6">{selected.summary}</p>

            {/* The credibility line. A regulatory map is only worth anything if
                the reader can tell how current THIS entry is, rather than
                inferring it from a single date covering the whole dataset. */}
            <div className="flex items-start gap-2.5 mb-8 p-3 rounded-lg bg-[#f0f4f8] border border-[#e5e7eb]">
              <CheckCircle2 className="w-4 h-4 text-aic-copper shrink-0 mt-0.5" />
              <div className="text-xs text-[#6b7280] leading-relaxed">
                <span className="font-semibold text-[#0f1f3d]">
                  Checked {selected.verifiedAt}
                </span>
                <br />
                This entry was last verified against its primary source on that
                date. It is not a live feed.
              </div>
            </div>

            {/* The map states a position; these are the dated, sourced changes
                behind it. Without them the two halves of the site describe the
                same regulation at different granularities and never meet. */}
            {(updatesByCountry[selected.id]?.length ?? 0) > 0 && (
              <div className="mb-8">
                <h5 className="text-xs font-semibold uppercase tracking-wide text-[#0f1f3d] mb-3">
                  What has changed here
                </h5>
                <ul className="space-y-2">
                  {updatesByCountry[selected.id].map((u) => (
                    <li key={u.slug}>
                      <Link
                        href={`/policy/${u.slug}`}
                        className="group block border border-[#e5e7eb] rounded-lg p-3 hover:border-aic-copper/40 hover:bg-[#f0f4f8] transition-all"
                      >
                        <span className="block text-[11px] font-mono text-[#9ca3af] mb-1">
                          {u.date} · {u.tag}
                        </span>
                        <span className="block text-sm text-[#0f1f3d] leading-snug group-hover:text-aic-copper transition-colors">
                          {u.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
            {/* Carries the country through to the form. Previously this
                dropped the visitor on a blank contact page, so the one piece
                of information the request is about — which jurisdiction — was
                the one thing we made them retype, and usually did not get. */}
            <Link
              href={`/contact?jurisdiction=${encodeURIComponent(
                selectedName ?? ""
              )}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-aic-navy text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-[#0f1f3d] transition-all"
            >
              <Mail className="w-4 h-4" />
              Ask us to prioritise {selectedName ?? "this jurisdiction"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
