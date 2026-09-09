"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as d3geo from "d3-geo";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import Link from "next/link";
import { Mail, X, CheckCircle2, Search, ArrowRight, ArrowLeft } from "lucide-react";
import { scrollElementToTop, isAtTop } from "@/lib/scroll";
import { beginFlight } from "@/lib/country-flight";
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
  /** Projected bounding box, for framing the country during the zoom. */
  bounds: [[number, number], [number, number]];
  /** Projected area, used only to settle duplicate ids. */
  area: number;
}

/** How long the camera zoom runs. */
const ZOOM_MS = 1050;

/**
 * When the country is handed to the layout's silhouette layer, as a fraction of
 * the zoom. The camera uses a strongly eased curve, so by 62% of the duration
 * the country has covered most of its distance and is barely moving — which is
 * what matters, because the hand-off reads the country's rect off the DOM at a
 * single instant. Hand off while it is still travelling and the silhouette
 * launches from a position the map has already left.
 */
const HANDOFF_AT = ZOOM_MS * 0.62;

/**
 * When the route commits — deliberately after the camera has finished, and
 * timed so the silhouette has already reached its resting place.
 *
 * Committing at the end of the zoom was the obvious choice and the wrong one:
 * the jurisdiction page would mount while the country was still mid-flight, so
 * a large copper shape swept across the headline for the better part of a
 * second. Now the whole journey happens under a full-screen navy veil that the
 * hero is then painted behind, and the only thing that changes at the commit is
 * that the rest of the page's text arrives.
 */
const COMMIT_AT = ZOOM_MS + 280;

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

        const built: CountryFeature[] = geo.features
          .map((f) => {
            const d = path(f);
            if (!d) return null;
            const id = String(f.id ?? "");
            return {
              id,
              // Our own name wins where we have one. countries-50m.json carries
              // TWO features with id "036" — Australia and Ashmore and Cartier
              // Is., an uninhabited sandbar — so whichever resolved last was
              // deciding what the map called Australia.
              name: regulatoryData[id]?.name ?? f.properties?.name ?? "Unknown",
              path: d,
              bounds: path.bounds(f) as [[number, number], [number, number]],
              area: path.area(f),
            };
          })
          .filter((f): f is CountryFeature => f !== null);

        // Same collision, second consequence: two paths answering to one id
        // means hover, selection and keyboard focus can land on the wrong
        // geometry. Keep the larger one; a country is never the smaller of two
        // shapes sharing its code.
        const byId = new Map<string, CountryFeature>();
        for (const f of built) {
          if (!f.id) continue;
          const prev = byId.get(f.id);
          if (!prev || f.area > prev.area) byId.set(f.id, f);
        }
        const features = Array.from(byId.values());

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

  /**
   * Selecting a country reframes the view: the search bar goes to the top of
   * the screen, the map sits under it, and the panel opens level with the
   * search bar — which is where it already begins, since the two columns are
   * siblings.
   *
   * Only scrolls when the search bar is not already there, so clicking a
   * second country from a correctly-framed view does nothing rather than
   * jolting the page. Every selection path routes through here — map click,
   * search result, mobile region button — so the framing is the same however
   * you got there.
   */
  function select(id: string) {
    setSelectedId(id);
    if (!isAtTop(searchRef.current)) scrollElementToTop(searchRef.current);
  }

  function choose(id: string) {
    select(id);
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

  const router = useRouter();

  /**
   * The cinematic step, and the reason it is a transform rather than a route
   * animation: the paths are already projected and cached, so scaling a <g>
   * costs nothing, reprojects nothing, and keeps the exact stroke texture the
   * static map has. Nothing is re-rendered — the camera moves.
   *
   * The CTA underneath is a real link. If JavaScript never runs, if motion is
   * reduced, or if the animation is interrupted, the destination is the same
   * URL and the map stays usable. The animation is decoration over a working
   * navigation, never the mechanism of it.
   */
  const [zoom, setZoom] = useState<{ scale: number; tx: number; ty: number } | null>(null);
  const [veil, setVeil] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // The rendered path elements, so the hand-off rect can be read off the DOM
  // rather than recomputed. getBoundingClientRect already accounts for the
  // projection, the camera transform and the viewBox-to-pixel scaling; doing
  // that arithmetic a second time by hand is three chances to be a few pixels
  // out, and a few pixels out is exactly what the reader would notice.
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const openJurisdiction = useCallback(
    (e: React.MouseEvent, feature: CountryFeature | undefined, slug: string) => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Let the browser handle modified clicks — new tab, new window, download.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (reduced || !feature) return; // plain navigation, no camera move

      e.preventDefault();

      const [[x0, y0], [x1, y1]] = feature.bounds;
      const bw = Math.max(x1 - x0, 1);
      const bh = Math.max(y1 - y0, 1);
      // Cap the scale so a small country does not magnify into a few enormous
      // pixels, and floor it so a large one still visibly travels.
      const scale = Math.min(Math.max(Math.min(width / bw, height / bh) * 0.55, 2.2), 14);
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;

      setZoom({ scale, tx: width / 2 - cx * scale, ty: height / 2 - cy * scale });
      // The veil comes in late, so the country is legibly filling the frame
      // before the navy takes over and hands off to the page header.
      timers.current.push(setTimeout(() => setVeil(true), ZOOM_MS * 0.55));

      // Hand the country to the layout while the camera is still moving and
      // the veil is only part-way up. From here the silhouette is no longer
      // this component's problem: it lives in the shared layout, so it carries
      // on travelling straight through the route commit below and lands on the
      // jurisdiction page's hero. That is the difference between an animation
      // that ends at the navigation and one that ends after it.
      // Launched unconditionally: whether a silhouette exists for this country
      // is the layer's business, and asking here would mean importing the
      // shape data into the map's own bundle, which is exactly what the layer
      // goes out of its way to avoid.
      timers.current.push(
        setTimeout(() => {
          const el = pathRefs.current.get(feature.id);
          if (!el) return;
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            beginFlight(feature.id, {
              left: r.left,
              top: r.top,
              width: r.width,
              height: r.height,
            });
          }
        }, HANDOFF_AT)
      );

      timers.current.push(
        setTimeout(() => router.push(`/regulatory-map/${slug}`), COMMIT_AT)
      );
    },
    [router, width, height]
  );

  const selected: CountryRegulation | undefined = useMemo(
    () => (selectedId ? regulatoryData[selectedId] : undefined),
    [selectedId]
  );
  const selectedFeature = useMemo(
    () => countries.find((c) => c.id === selectedId),
    [countries, selectedId]
  );
  const selectedName = useMemo(
    () => (selectedId ? regulatoryData[selectedId]?.name : undefined) ?? selectedFeature?.name,
    [selectedId, selectedFeature]
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
      {/* Map. Takes the full width until a country is selected — the side
          panel was reserving 24rem to hold a "click a country" placeholder,
          which spent a quarter of the widest element on the site telling the
          reader to do the thing the map already invites. */}
      <div
        className={`relative flex-1 min-w-0 transition-[padding] duration-300 ease-out motion-reduce:transition-none ${
          selectedId ? "lg:pr-8" : "lg:pr-0"
        }`}
      >
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
              className="w-full h-auto overflow-hidden"
              role="img"
              aria-label="World map — click a country to see its regulatory status"
            >
              {/* The camera. Scaling this group leaves every projected path
                  untouched, which is what keeps the map's own texture through
                  the move — no reprojection, no tile swap, no second renderer. */}
              <g
                style={{
                  transform: zoom
                    ? `translate(${zoom.tx}px, ${zoom.ty}px) scale(${zoom.scale})`
                    : "none",
                  transformOrigin: "0 0",
                  // Fast out of the gate, settling rather than braking. A linear
                  // or symmetric ease reads as a slideshow; this reads as travel.
                  transition: zoom
                    ? `transform ${ZOOM_MS}ms cubic-bezier(0.7, 0, 0.22, 1)`
                    : "none",
                }}
                className="motion-reduce:!transition-none"
              >
              {countries.map((c) => {
                const hasData = Boolean(regulatoryData[c.id]);
                const isHovered = hoveredId === c.id;
                const isSelected = selectedId === c.id;
                return (
                  <path
                    key={c.id || c.name}
                    ref={(el) => {
                      if (el) pathRefs.current.set(c.id, el);
                      else pathRefs.current.delete(c.id);
                    }}
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
                    // Borders stay hairlines at 14x rather than swelling into
                    // white bands and eating the country they outline.
                    vectorEffect="non-scaling-stroke"
                    style={
                      zoom && !isSelected
                        ? { opacity: 0.25, transition: `opacity ${ZOOM_MS * 0.6}ms ease-out` }
                        : undefined
                    }
                    onMouseEnter={() => setHoveredId(c.id)}
                    onMouseLeave={() => setHoveredId((h) => (h === c.id ? null : h))}
                    onClick={() => select(c.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") select(c.id);
                    }}
                    tabIndex={0}
                    aria-label={c.name}
                  >
                    <title>{c.name}</title>
                  </path>
                );
              })}
              </g>
            </svg>
          )}
          {/* Hand-off.
              Fixed rather than absolute, so it covers the viewport instead of
              the map's own box. That is not a flourish: the silhouette flies to
              where the jurisdiction page's hero will put it, which is near the
              top of the window and well above the map — over a map-sized veil
              it would sail off the navy and across this page's own headings.
              Covering the viewport also means the commit happens navy-to-navy
              with nothing else on screen.
              The inner wrapper reproduces the hero's geometry — same 20 offset
              for the navbar, same vertical padding, same container and
              right-hand gutter, and content anchored to the top rather than
              centred — so the region label and the country name are already
              exactly where the real page is about to draw them. */}
          {zoom && (
            <div
              className={`fixed inset-0 z-20 bg-aic-navy pointer-events-none transition-opacity duration-[450ms] ease-out motion-reduce:hidden ${
                veil ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            >
              <div className="pt-20">
                <div className="py-12 md:py-14">
                  <div className="max-w-5xl mx-auto px-4 lg:pr-[23rem]">
                    {/* Deliberately the same three blocks, in the same classes,
                        as the top of app/regulatory-map/[country]/page.tsx.
                        Matching the STRUCTURE is what matters, not the text:
                        the back link and the meta row are what push the title
                        down to where the real page will draw it. Get those
                        wrong and the headline jumps at the commit, which is the
                        one moment the whole sequence exists to hide. The status
                        badge and summary below it are left out on purpose —
                        they arrive with the page, and reading as content
                        landing under a title that did not move. */}
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 mb-6">
                      <ArrowLeft className="w-3.5 h-3.5" /> Regulatory map
                    </span>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                        {selected?.region}
                      </span>
                      {selected?.verifiedAt && (
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                          Verified {selected.verifiedAt}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-white text-3xl md:text-5xl mb-5 leading-[1.05] tracking-[-0.03em] font-bold text-balance"
                      style={{ fontFamily: "'Merriweather', serif" }}
                    >
                      AI regulation in {selectedName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                          onClick={() => select(reg.id)}
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

      {/* Side panel. Width is animated rather than the element being unmounted,
          so the map resizes smoothly instead of the clicked country jumping
          under the cursor. That is the motion doing a job — preserving spatial
          continuity through a layout change — rather than decorating one. */}
      <div
        className={`transition-[width] duration-300 ease-out motion-reduce:transition-none ${
          selectedId
            ? "w-full lg:w-[26rem] lg:shrink-0 lg:self-start"
            : "hidden lg:block lg:w-0 overflow-hidden"
        }`}
        aria-hidden={!selectedId}
      >
        {/* Its own scroll container, stuck below the header. A country's detail
            can run to obligations, dated commencements, enforcement, sources
            and linked updates — reading it used to scroll the whole page, so
            the map slid away under you and the thing you had just clicked was
            gone. The panel scrolls; nothing else moves. */}
        <div
          className="w-full lg:w-[26rem] lg:border-l lg:border-[#e5e7eb] lg:pl-8 lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto overscroll-contain"
        >
        {selected ? (
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

            {/* The doorway.
                
                The panel used to carry the entire record — obligations, dated
                commencements, enforcement, every source — inside a 26rem column
                that had to scroll independently of the page to stay usable.
                That is a symptom, not a feature. All of it now lives at a URL
                that can be posted, indexed and cited, and the panel answers the
                question the map actually asks: where does this country stand?

                Labelled with the country rather than "Open Intelligence".
                Naming the destination tells the reader where they are going;
                product-speak makes them guess, and a guess is a reason not to
                click. */}
            <a
              href={`/regulatory-map/${selected.slug}`}
              onClick={(e) => openJurisdiction(e, selectedFeature, selected.slug)}
              className="group w-full inline-flex items-center justify-between gap-3 bg-aic-navy text-white px-5 py-4 rounded-lg hover:bg-[#0f1f3d] transition-colors mb-3"
            >
              <span className="text-left">
                <span className="block font-semibold text-sm">Open {selectedName}</span>
                <span className="block text-[11px] text-white/50 mt-0.5">
                  {selected.detail
                    ? "Obligations, dates, enforcement, primary sources"
                    : "Verification record and what we have not yet mapped"}
                </span>
              </span>
              <ArrowRight className="w-4 h-4 shrink-0 text-aic-copper transition-transform group-hover:translate-x-0.5" />
            </a>

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
    </div>
  );
}
