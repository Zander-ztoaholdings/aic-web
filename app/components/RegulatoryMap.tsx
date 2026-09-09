"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Mail,
  X,
  CheckCircle2,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { scrollElementToTop, isAtTop } from "@/lib/scroll";
import JurisdictionRecord, {
  type RecordUpdate,
} from "@/app/components/JurisdictionRecord";
import { COUNTRY_FRAMES } from "@/app/data/country-frames";
import {
  regulatoryData,
  oldestVerification,
  jurisdictionBySlug,
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

/** The shape of public/data/world-map.json — see scripts/build-world-map.mjs. */
interface WorldMap {
  w: number;
  h: number;
  countries: { i: string; n: string; d: string }[];
}

/**
 * How long the camera takes to travel.
 *
 * Long, and deliberately so. The reference is the way a globe swings round to
 * a searched country: you watch it arrive, and the distance it covered is part
 * of what tells you where you are. A quick cut is cheaper and tells you
 * nothing.
 */
const TRAVEL_MS = 1400;

/**
 * How long the page takes to clear out of the way before the camera moves.
 *
 * Opening a country widens the map card and collapses the panel beside it.
 * Doing that while the camera runs means resizing the SVG underneath a
 * transform, which is what made the zoom stutter on the first frames. Running
 * them in sequence costs a third of a second and the motion is clean: the
 * interface steps aside, then the journey starts.
 */
const LAYOUT_MS = 320;


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
    // Already projected, already simplified, already de-duplicated. This used
    // to fetch 756KB of topology and then decode it, fit a projection and
    // generate every path string in the browser — a second of network on a
    // cold cache followed by a lump of main-thread work, with "Loading map…"
    // on screen throughout. See scripts/build-world-map.mjs.
    fetch("/data/world-map.json")
      .then((r) => r.json())
      .then((world: WorldMap) => {
        if (cancelled) return;
        setCountries(
          world.countries.map((c) => ({
            // Our own name wins where we have one: Natural Earth's differ from
            // the ones the dataset uses, and the search reads these.
            id: c.i,
            name: regulatoryData[c.i]?.name ?? c.n,
            path: c.d,
          }))
        );
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

  /**
   * Opening a jurisdiction does not leave the map.
   *
   * It used to: the camera zoomed, a veil came up, and the router pushed
   * /regulatory-map/<slug>. That page still exists and is still the thing
   * search engines index and people share — but arriving at it by navigation
   * threw away the map, so comparing two countries meant going back, finding
   * the map again and re-clicking. The map IS the product here; leaving it to
   * read about a country is the wrong shape.
   *
   * So the camera moves, the country is framed and outlined, the record opens
   * around it, and the URL is rewritten to the jurisdiction's own address with
   * history.pushState. Nothing unmounts. Refresh, share or open in a new tab
   * and you get the real server-rendered page, because the URL is real.
   *
   * The transform is still the mechanism: the paths are already projected and
   * cached, so scaling a <g> costs nothing, reprojects nothing, and keeps the
   * map's own stroke texture through the move.
   */
  const [zoom, setZoom] = useState<{ scale: number; tx: number; ty: number } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /**
   * Where the camera comes to rest.
   *
   * The country is framed into the left of the canvas rather than the middle,
   * because the right of it has to hold the label — and because leaving the
   * surrounding continents visible is what stops the zoom reading as a cut to
   * an unrelated picture. You should still be able to see where in the world
   * you have arrived.
   */
  const frameFor = useCallback(
    (feature: CountryFeature) => {
      // Frames are computed on the principal landmasses only. A country's own
      // bounds include every territory, so framing on those puts Alaska and
      // the Aleutians in shot and leaves the United States 844 units wide of a
      // 960-unit world — no zoom left to perform. Same for France, Norway and
      // the Netherlands. Only mapped jurisdictions can be opened, and every one
      // of those has a frame (there is a test).
      const f = COUNTRY_FRAMES[feature.id];
      if (!f) return null;
      const bw = Math.max(f[2], 0.2);
      const bh = Math.max(f[3], 0.2);
      const [x0, y0] = f;
      // These four are duplicated in scripts/build-country-detail.mjs, which
      // simplifies each outline to the precision of the zoom it computes here.
      // Change them there too, and regenerate.
      const stageW = width * 0.46;
      const stageH = height * 0.82;
      // Floored so a large country still visibly travels. The ceiling is high
      // because of city-states: Singapore is one unit across in this
      // projection, and at 20x it occupied 2% of the canvas.
      const scale = Math.min(Math.max(Math.min(stageW / bw, stageH / bh), 1.8), 200);
      const cx = x0 + bw / 2;
      const cy = y0 + bh / 2;
      return {
        scale,
        tx: width * 0.25 - cx * scale,
        ty: height / 2 - cy * scale,
      };
    },
    [width, height]
  );

  const expand = useCallback(
    (id: string, pushUrl = true) => {
      const j = regulatoryData[id];
      if (!j) return;
      const feature = countries.find((c) => c.id === id);
      setSelectedId(id);
      setExpandedId(id);
      // Let the layout finish before the camera starts — see LAYOUT_MS.
      if (feature) {
        timers.current.push(
          setTimeout(() => setZoom(frameFor(feature)), LAYOUT_MS)
        );
      }
      if (pushUrl) {
        // Next supports the native history API for shallow updates, and this is
        // the one thing that must not be a router.push: a push would unmount
        // this component and take the camera with it.
        window.history.pushState({ aicJurisdiction: id }, "", `/regulatory-map/${j.slug}`);
      }
      if (!isAtTop(stageRef.current)) scrollElementToTop(stageRef.current);
    },
    [countries, frameFor]
  );

  const collapse = useCallback((pushUrl = true) => {
    setExpandedId(null);
    setZoom(null);
    if (pushUrl) window.history.pushState({}, "", "/regulatory-map");
  }, []);

  /**
   * Arriving from a shared link.
   *
   * The standalone jurisdiction page is what gets indexed and posted, and it
   * has no map on it. /regulatory-map?j=<slug> is the way back in: the map
   * opens already zoomed to that country, then tidies the URL to the
   * jurisdiction's own address so what you copy from the bar is the canonical
   * one rather than the query form.
   *
   * Waits for the geometry, because there is nothing to frame until it lands.
   */
  const entered = useRef(false);
  useEffect(() => {
    if (entered.current || countries.length === 0) return;
    const slug = new URLSearchParams(window.location.search).get("j");
    if (!slug) return;
    const j = jurisdictionBySlug(slug);
    entered.current = true;
    if (!j) return;
    const feature = countries.find((c) => c.id === j.id);
    setSelectedId(j.id);
    setExpandedId(j.id);
    if (feature) setZoom(frameFor(feature));
    window.history.replaceState(
      { aicJurisdiction: j.id },
      "",
      `/regulatory-map/${j.slug}`
    );
  }, [countries, frameFor]);

  // Back and forward have to work, or the URL was a lie.
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const id = (e.state as { aicJurisdiction?: string } | null)?.aicJurisdiction;
      if (id && regulatoryData[id]) expand(id, false);
      else collapse(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [expand, collapse]);

  useEffect(() => {
    if (!expandedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") collapse();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedId, collapse]);


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

  const expanded: CountryRegulation | undefined = useMemo(
    () => (expandedId ? regulatoryData[expandedId] : undefined),
    [expandedId]
  );
  const expandedName = useMemo(
    () =>
      (expandedId ? regulatoryData[expandedId]?.name : undefined) ??
      countries.find((c) => c.id === expandedId)?.name,
    [expandedId, countries]
  );

  /**
   * The label waits for the camera.
   *
   * Arriving with the move would put text on top of a country that is still
   * crossing the screen, and the eye cannot read and track at the same time.
   * It comes in just past halfway, as the motion is settling.
   */
  /**
   * High-detail outlines, loaded after hydration.
   *
   * 1:50m is right for the world and wrong close up — Singapore is literally
   * one projected unit across in it. These are the same countries redrawn from
   * 1:10m in the same projection, so a detail outline registers exactly on top
   * of the country it replaces. 137KB, needed only once someone opens a
   * jurisdiction, so it is never on the path to first paint.
   */
  const [detail, setDetail] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      import("@/app/data/country-detail").then((m) => {
        if (!cancelled) setDetail(m.COUNTRY_DETAIL);
      });
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle
      ? window.requestIdleCallback(load, { timeout: 3000 })
      : window.setTimeout(load, 600);
    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, []);

  const [annotated, setAnnotated] = useState(false);
  /**
   * The record is not mounted until the camera has landed.
   *
   * Mounting it — the full jurisdiction record plus the standard layer — in the
   * same commit that starts the zoom put a few hundred nodes into the document
   * on exactly the frame the animation needed, and the motion stuttered before
   * it got going. It is below the fold for the whole flight anyway.
   */
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!expandedId) {
      setAnnotated(false);
      setSettled(false);
      return;
    }
    const a = setTimeout(() => setAnnotated(true), LAYOUT_MS + TRAVEL_MS * 0.45);
    const b = setTimeout(() => setSettled(true), LAYOUT_MS + TRAVEL_MS);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [expandedId]);

  /**
   * The detail outline always arrives as a cross-fade.
   *
   * It is loaded on idle, so it is normally in hand long before anyone opens a
   * country — but if it resolves DURING a zoom, React inserts a several-hundred
   * vertex path on a frame the animation needs, and you see it. Fading it in
   * costs nothing and makes both cases identical: the shape underneath is the
   * same country, so what the reader sees is the coastline getting sharper.
   */
  const [detailIn, setDetailIn] = useState(false);
  useEffect(() => {
    if (!expandedId || !detail?.[expandedId]) {
      setDetailIn(false);
      return;
    }
    const raf = requestAnimationFrame(() => setDetailIn(true));
    return () => cancelAnimationFrame(raf);
  }, [expandedId, detail]);

  /**
   * The cue retires the moment it has been obeyed, and the way back appears in
   * its place.
   *
   * The back button belongs in the annotation, where it is part of the
   * composition. But the annotation scrolls away with the map, and the record
   * underneath runs for several screens — so from down there the only way out
   * of the country was the browser's own back arrow. A floating one costs the
   * stage nothing because it is not on the stage: it only exists once the map
   * has left the screen.
   */
  const [cue, setCue] = useState(true);
  const [pastMap, setPastMap] = useState(false);
  useEffect(() => {
    if (!expandedId) {
      setCue(true);
      setPastMap(false);
      return;
    }
    const onScroll = () => {
      const y = window.scrollY;
      setCue(y < 120);
      setPastMap(y > 380);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [expandedId]);

  return (
    <div ref={stageRef}>
      <div className={expanded ? "block" : "flex flex-col lg:flex-row gap-8 lg:gap-0"}>
      {/* Map. Takes the full width until a country is selected — the side
          panel was reserving 24rem to hold a "click a country" placeholder,
          which spent a quarter of the widest element on the site telling the
          reader to do the thing the map already invites. */}
      <div
        className={`relative flex-1 min-w-0 transition-[padding] duration-300 ease-out motion-reduce:transition-none ${
          selectedId && !expanded ? "lg:pr-8" : "lg:pr-0"
        }`}
      >
        {/* Search. Rendered above the map on every breakpoint, and on mobile it
            is the ONLY way in — see the note on the SVG wrapper below. */}
        <div ref={searchRef} className={`relative mb-4 ${expanded ? "hidden" : ""}`}>
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
        {/* The card takes the full width for the stage — but it finishes doing
            so BEFORE the camera starts. Widening the card and collapsing the
            panel while the zoom was running meant the SVG was being resized
            under a transform mid-flight, which is what made the zoom stutter.
            The two are now sequential rather than simultaneous: the layout
            clears, and then the camera travels. See LAYOUT_MS. */}
        <div
          className={`hidden lg:block bg-white border border-[#e5e7eb] rounded-xl overflow-hidden transition-[padding] duration-300 ease-out ${
            expanded ? "p-0" : "p-4 sm:p-8"
          }`}
        >
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
                  transition: `transform ${TRAVEL_MS}ms cubic-bezier(0.62, 0, 0.20, 1)`,
                }}
                className="motion-reduce:!transition-none"
              >
              {countries.map((c) => {
                const hasData = Boolean(regulatoryData[c.id]);
                const isHovered = hoveredId === c.id;
                const isSelected = selectedId === c.id;
                const isExpanded = expandedId === c.id;
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
                    // The subject gets a hard edge against the ground; everyone
                    // else keeps the hairline that separates neighbours.
                    stroke={isExpanded ? "#0a1628" : "#ffffff"}
                    strokeWidth={isExpanded ? 1.25 : 0.5}
                    // Borders stay hairlines at 20x rather than swelling into
                    // bands and eating the country they outline.
                    vectorEffect="non-scaling-stroke"
                    style={
                      zoom && !isExpanded
                        ? {
                            // The rest of the world recedes but does not leave.
                            // Fading it out entirely turns the move into a cut
                            // to an unrelated picture, and you lose the one
                            // thing the zoom was for — knowing where you are.
                            //
                            // Except at city-state magnification. Past about
                            // 60x the neighbours are 1:50m coastlines blown up
                            // forty times, so they stop being context and
                            // become big featureless slabs that read as a
                            // rendering fault. At that point they are better
                            // nearly gone.
                            opacity: (zoom?.scale ?? 0) > 60 ? 0.09 : 0.28,
                            transition: `opacity ${TRAVEL_MS * 0.7}ms ease-out`,
                          }
                        : undefined
                    }
                    pointerEvents={zoom && !isExpanded ? "none" : undefined}
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

              {/* The framed country, redrawn at 1:10m.
                  Laid over the 50m path rather than replacing it, so nothing
                  swaps mid-flight and any territory the frame deliberately
                  excludes — Alaska, French Guiana — is still drawn as part of
                  the country by the map underneath. */}
              {expandedId && detail?.[expandedId] && (
                <path
                  d={detail[expandedId]}
                  fill="#c9920a"
                  stroke="#0a1628"
                  strokeWidth={1.25}
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                  style={{
                    opacity: detailIn ? 1 : 0,
                    transition: "opacity 380ms ease-out",
                  }}
                />
              )}
              </g>
            </svg>
          )}

          {/* The annotation.
              Back inside the card, in the right-hand space the camera
              deliberately leaves empty, because the country and the claim
              about it should read as one composition rather than a picture
              with a caption in a different column. */}
          {expanded && (
            <div
              className="absolute inset-y-0 right-0 w-[46%] flex items-center pr-8 md:pr-12 pointer-events-none"
              style={{
                opacity: annotated ? 1 : 0,
                transform: annotated ? "translateY(0)" : "translateY(12px)",
                transition:
                  "opacity 520ms ease-out, transform 520ms cubic-bezier(0.2,0.7,0.3,1)",
              }}
            >
              <div className="pointer-events-auto max-w-sm">
                {/* A filled button rather than the caps-lock link this used to
                    be. It sat here quietly enough to be missed entirely. */}
                <button
                  type="button"
                  onClick={() => collapse()}
                  className="inline-flex items-center gap-2 bg-aic-navy text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0f1f3d] transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4 text-aic-copper" />
                  Back to the world map
                </button>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                    {expanded.region}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9ca3af]">
                    Verified {expanded.verifiedAt}
                  </span>
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold text-[#0f1f3d] leading-[1.05] tracking-[-0.03em] mb-4 text-balance"
                  style={{ fontFamily: "'Merriweather', serif" }}
                >
                  {expandedName}
                </h2>
                <span
                  className={`inline-block text-xs font-semibold px-2.5 py-1 rounded mb-4 ${
                    STATUS_TONE[expanded.status] ?? "bg-[#f0f4f8] text-[#6b7280]"
                  }`}
                >
                  {expanded.status}
                </span>
                <p className="text-[#0f1f3d] font-semibold leading-snug">
                  {expanded.framework}
                </p>
                <p className="text-xs text-[#9ca3af] uppercase tracking-wide mt-1">
                  {expanded.authority}
                </p>
              </div>
            </div>
          )}
          <div className={`items-center gap-6 mt-6 pt-6 border-t border-[#e5e7eb] text-xs text-[#6b7280] ${expanded ? "hidden" : "flex"}`}>
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
        <div className={expanded ? "hidden" : "lg:hidden"}>
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

        {/* There is a great deal below this and no way to tell from the stage,
            which shows one country and its name and otherwise looks finished. */}
        {expanded && (
          <div
            className="hidden lg:flex justify-center mt-5"
            style={{
              opacity: settled && cue ? 1 : 0,
              transition: "opacity 400ms ease-out",
              pointerEvents: settled && cue ? "auto" : "none",
            }}
            aria-hidden={!(settled && cue)}
          >
            <button
              type="button"
              onClick={() =>
                window.scrollBy({ top: window.innerHeight * 0.72, behavior: "smooth" })
              }
              className="group inline-flex flex-col items-center gap-1.5 text-[#9ca3af] hover:text-aic-copper transition-colors"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
                Scroll for the full record
              </span>
              <ChevronDown className="w-5 h-5 animate-bounce motion-reduce:animate-none" />
            </button>
          </div>
        )}

        <p className={`text-xs text-[#9ca3af] mt-4 ${expanded ? "hidden" : ""}`}>
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
          selectedId && !expanded
            ? "w-full lg:w-[26rem] lg:shrink-0 lg:self-start"
            : "hidden lg:block lg:w-0 overflow-hidden"
        }`}
        aria-hidden={!selectedId || Boolean(expanded)}
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
              onClick={(e) => {
                // Still a real link: modified clicks, no JavaScript, and
                // reduced motion all fall through to the server-rendered page.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
                  return;
                if (
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
                  !selectedFeature
                )
                  return;
                e.preventDefault();
                expand(selected.id);
              }}
              className="group w-full inline-flex items-center justify-between gap-3 bg-aic-navy text-white px-5 py-4 rounded-lg hover:bg-[#0f1f3d] transition-colors mb-3"
            >
              <span className="text-left">
                <span className="block font-semibold text-sm">Open {selectedName}</span>
                <span className="block text-[11px] text-white/50 mt-0.5">
                  {selected.detail
                    ? "Zoom in — obligations, dates, enforcement, sources"
                    : "Zoom in — verification record and what is not yet mapped"}
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

      {/* The record, in the page rather than in a panel.
          This is the sacrifice the in-place model asks for and it is worth
          making: obligations, dated commencements, enforcement and sources do
          not belong in a 26rem column that has to scroll independently of the
          page to stay usable. Below the stage they get the full width and the
          country stays on screen above them. It is the same component the
          standalone page renders, so there is one version of this record. */}
      {expanded && (
        <div
          className="fixed bottom-6 left-6 z-40 hidden lg:block"
          style={{
            opacity: pastMap ? 1 : 0,
            transform: pastMap ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 260ms ease-out, transform 260ms ease-out",
            pointerEvents: pastMap ? "auto" : "none",
          }}
          aria-hidden={!pastMap}
        >
          <button
            type="button"
            onClick={() => {
              collapse();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 bg-aic-navy text-white px-4 py-3 rounded-lg font-semibold text-sm shadow-lg shadow-aic-navy/20 hover:bg-[#0f1f3d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-aic-copper" />
            Back to the world map
          </button>
        </div>
      )}

      {expanded && settled && (
        <div className="mt-6 lg:mt-8 border-t border-[#e5e7eb]">
          <JurisdictionRecord
            j={expanded}
            updates={(updatesByCountry[expanded.id] ?? []) as RecordUpdate[]}
          />
        </div>
      )}
    </div>
  );
}
