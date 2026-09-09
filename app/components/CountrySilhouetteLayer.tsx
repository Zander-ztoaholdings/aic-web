"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { jurisdictionBySlug } from "@/app/data/regulatory-data";
import {
  MIN_VIEWPORT,
  onFlight,
  restingRect,
  takePending,
  type Rect,
} from "@/lib/country-flight";

/** How long the country takes to travel from the map to its resting place. */
const TRAVEL_MS = 520;
/** Cross-fade in place, over the map's own rendering of the same country. */
const FADE_MS = 200;

/**
 * The country silhouette, owned by the layout rather than by either page.
 *
 * This renders nothing on /regulatory-map and the silhouette on
 * /regulatory-map/<slug>, and because it sits in the shared layout it is the
 * same React element before and after the route change. A country launched
 * from the map is mid-flight when the navigation commits and simply keeps
 * going; nothing is handed over, because nothing changes hands.
 *
 * Deriving the active country from the pathname rather than from props is what
 * makes a direct visit work identically to an animated one: land on the URL
 * cold and the silhouette is simply already at rest.
 *
 * It is decorative, so it is client-only and aria-hidden. The page's heading
 * and body carry every fact; this carries recognition.
 */
export default function CountrySilhouetteLayer() {
  const pathname = usePathname();
  const slug = pathname?.startsWith("/regulatory-map/")
    ? pathname.slice("/regulatory-map/".length).split("/")[0]
    : null;
  const activeId = slug ? jurisdictionBySlug(slug)?.id : undefined;

  const [rest, setRest] = useState<Rect | null>(null);
  const [flightFrom, setFlightFrom] = useState<{ id: string; from: Rect } | null>(null);
  /**
   * "hidden" is the element sitting on top of the country, not yet drawn;
   * "arrived" is it drawn there, over the map's own copper fill; "travel" is
   * it on its way. The middle step is not decoration. The map draws countries
   * in geoNaturalEarth1 and this silhouette is Mercator, so the two outlines
   * are close but not identical — a short cross-fade in place absorbs that
   * difference, where an instant swap would read as the country flinching
   * before it moves.
   */
  const [stage, setStage] = useState<"hidden" | "arrived" | "travel">("hidden");
  const [fade, setFade] = useState(1);
  /**
   * The silhouettes are ~98KB of path data for 28 countries, of which any one
   * visit uses exactly one. Statically imported they landed in the segment
   * layout's chunk, which meant the map page — the one the campaign points at
   * — paid 40KB gzipped up front to animate a click that may never come. So
   * they load after hydration instead, on idle. There is a lot of time here:
   * the earliest a shape can be needed is a country click, a panel read and a
   * second click later.
   */
  const [shapes, setShapes] = useState<{
    paths: Record<string, string>;
    bounds: Record<string, [number, number, number, number]>;
  } | null>(null);
  // A cold visit has no flight to arrive on, so the silhouette would otherwise
  // simply be there on the first painted frame.
  const [ready, setReady] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      import("@/app/data/country-shapes").then((m) => {
        if (!cancelled)
          setShapes({ paths: m.COUNTRY_SHAPES, bounds: m.COUNTRY_BOUNDS });
      });
    // requestIdleCallback is typed as always present but is not (older Safari),
    // hence the runtime check rather than a truthiness test on the function.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle
      ? window.requestIdleCallback(load, { timeout: 2500 })
      : window.setTimeout(load, 400);
    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, []);

  // While in flight the country on screen is the one that was clicked, which is
  // not yet the one the URL names.
  const id = flightFrom?.id ?? activeId;
  const d = id && shapes ? shapes.paths[id] : undefined;
  const box = id && shapes ? shapes.bounds[id] : undefined;
  const aspect = box ? box[2] / box[3] : 1;

  // Geometry is a function of the viewport and the country's own proportions,
  // so it is recomputed rather than stored. Nothing else depends on it.
  useEffect(() => {
    const measure = () =>
      setRest(window.innerWidth >= MIN_VIEWPORT ? restingRect(aspect) : null);
    measure();
    const raf = requestAnimationFrame(() => setReady(true));
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [aspect]);

  // A flight can be launched before this layer has ever rendered, so check for
  // one already waiting as well as subscribing for later ones.
  useEffect(() => {
    const start = (f: { id: string; from: Rect }) => {
      if (window.innerWidth < MIN_VIEWPORT) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setFlightFrom(f);
      setStage("hidden");
      // One frame at the origin before anything is released, or the browser
      // coalesces the states and the element is simply born at rest.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setStage("arrived"))
      );
      timers.current.push(setTimeout(() => setStage("travel"), FADE_MS));
      // Long stop, not the normal one. Handing back to the pathname-driven
      // render is done below, once the URL has actually caught up; this only
      // exists so a navigation that never arrives cannot strand a country on
      // the map.
      timers.current.push(
        setTimeout(() => setFlightFrom(null), FADE_MS + TRAVEL_MS + 4000)
      );
    };
    const waiting = takePending();
    if (waiting) start(waiting);
    return onFlight(start);
  }, []);

  /**
   * Hand back from the flight to the ordinary pathname-driven render, but only
   * once the URL names the country that is flying. Releasing on a timer alone
   * would drop the silhouette for as long as a slow navigation took, and the
   * one thing this component exists to guarantee is that the country is never
   * absent for a frame.
   */
  useEffect(() => {
    if (!flightFrom || activeId !== flightFrom.id || stage !== "travel") return;
    const t = setTimeout(() => setFlightFrom(null), TRAVEL_MS);
    return () => clearTimeout(t);
  }, [flightFrom, activeId, stage]);

  // Let it go as the reader moves past the hero it belongs to. Passive, and
  // only touching opacity, so it never costs a layout during scroll.
  useEffect(() => {
    if (!activeId) return;
    const onScroll = () => {
      const y = window.scrollY;
      setFade(Math.max(0, Math.min(1, 1 - (y - 80) / 240)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeId]);

  // No shape, no silhouette. Twenty-eight of the world's jurisdictions are
  // mapped and the rest are not; inventing an outline for the others would be
  // the one dishonest pixel on a page about regulatory honesty.
  if (!d || !box || !rest) return null;

  // FLIP: the element is always laid out at its resting rect and transformed
  // back onto the map. Animating a transform costs the compositor a matrix;
  // animating left/top/width/height would cost a layout on every frame of a
  // route change, which is the one moment there is nothing to spare.
  const atOrigin = Boolean(flightFrom) && stage !== "travel";

  /**
   * Sit the silhouette on the map's own drawing of the country.
   *
   * Scaling by width alone would be wrong: the map draws in
   * geoNaturalEarth1 fitted to the whole world and this is Mercator fitted to
   * one country, so the two have genuinely different proportions. Match the
   * width and a tall country hangs out of its own outline. Fit to whichever
   * axis is tighter and align the centres, which is the closest the two
   * projections can be brought without redrawing one of them — and close
   * enough that a 220ms cross-fade covers the rest.
   */
  let transform = "translate(0px, 0px) scale(1)";
  if (flightFrom && atOrigin) {
    const f = flightFrom.from;
    const k = Math.min(f.width / rest.width, f.height / rest.height);
    const tx = f.left + f.width / 2 - (rest.width * k) / 2 - rest.left;
    const ty = f.top + f.height / 2 - (rest.height * k) / 2 - rest.top;
    transform = `translate(${tx}px, ${ty}px) scale(${k})`;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed z-30 pointer-events-none hidden lg:block"
      style={{
        left: rest.left,
        top: rest.top,
        width: rest.width,
        height: rest.height,
        transformOrigin: "0 0",
        transform,
        opacity: flightFrom ? (stage === "hidden" ? 0 : 1) : ready ? fade : 0,
        transition: flightFrom
          ? `transform ${TRAVEL_MS}ms cubic-bezier(0.22, 0.61, 0.24, 1), opacity ${FADE_MS}ms ease-out`
          : "opacity 380ms ease-out",
        willChange: "transform",
      }}
    >
      <svg
        viewBox={box.join(" ")}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full overflow-visible"
      >
        <path
          d={d}
          fill="#c9920a"
          stroke="#c9920a"
          strokeWidth={2}
          strokeLinejoin="round"
          opacity={0.92}
        />
      </svg>
    </div>
  );
}
