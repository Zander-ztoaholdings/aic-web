/**
 * The hand-off between the regulatory map and a jurisdiction page.
 *
 * The map zooms into a country and then the route changes. Those are two
 * different things — a CSS transform inside an SVG, and React unmounting one
 * page to mount another — and nothing survives the second one. So the country
 * silhouette is not owned by either page. It is owned by the layout that wraps
 * both of them (app/regulatory-map/layout.tsx), which does not unmount when you
 * navigate between its children. The map only tells it where the country
 * currently is on screen; the layer takes it from there and keeps flying
 * straight through the route commit.
 *
 * That is the whole trick, and it is why this does not use the View
 * Transitions API: no dependency on browser support, and no need to hold the
 * navigation open while an animation plays.
 */

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Height of the sticky site header, from Navbar's h-20. */
const NAV_H = 80;

/**
 * The line the silhouette is centred on, measured from the top of the document.
 *
 * A fixed axis rather than a share of the hero's height, because the hero's
 * height varies with the country: some summaries run to three lines and some
 * titles wrap. Tie the silhouette to a proportion of that and it moves from
 * page to page — and, worse, sits somewhere different during the hand-off from
 * the map than it does once the page has loaded, which is the one thing the
 * whole sequence is built to avoid. The jurisdiction page guarantees the room
 * with lg:min-h-[30rem]; everything above that line is a constant.
 */
const HERO_AXIS = NAV_H + 215;

/** Below this width the hero has no room beside the text, so no silhouette. */
export const MIN_VIEWPORT = 1024;

/**
 * Where the silhouette comes to rest on a jurisdiction page.
 *
 * The flying overlay and the resting silhouette are the same element, so this
 * only has to be self-consistent — but it is also deliberately kept out of CSS.
 * The alternative was to let the page render a slot, measure it, and animate
 * toward the measurement; that cannot work, because the destination has to be
 * known before the page it lives on exists. A formula can be evaluated in
 * advance. A DOM node cannot be measured before it is mounted.
 *
 * Mirrors the hero's own container: max-w-5xl (64rem) centred, px-4.
 */
export function restingRect(aspect: number): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Fit the country's own proportions into the slot rather than boxing every
  // country into a square. Squared, the United States uses a band across the
  // middle and leaves a third of the slot empty top and bottom, which reads on
  // the page as the US being drawn smaller than Japan.
  const maxW = Math.min(Math.max(vw * 0.24, 200), 320);
  const maxH = Math.min(300, vh * 0.34);
  let width = maxW;
  let height = maxW / aspect;
  if (height > maxH) {
    height = maxH;
    width = maxH * aspect;
  }

  // Right edge of the hero's own container: max-w-5xl (64rem) centred, px-4.
  const containerRight = Math.min(vw - 24, (vw + 1024) / 2 - 16);
  return {
    left: containerRight - width,
    top: HERO_AXIS - height / 2,
    width,
    height,
  };
}

interface Flight {
  id: string;
  from: Rect;
}

let pending: Flight | null = null;
const listeners = new Set<(f: Flight) => void>();

/**
 * Called by the map at the point the country fills the frame. `from` is the
 * live on-screen rect of the country's own path element — read from the DOM
 * rather than recomputed, so the projection, the zoom transform and the
 * viewBox scaling are all already accounted for.
 */
export function beginFlight(id: string, from: Rect) {
  pending = { id, from };
  for (const fn of listeners) fn(pending);
}

export function onFlight(fn: (f: Flight) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** A flight launched before the layer mounted is still worth honouring. */
export function takePending(): Flight | null {
  const f = pending;
  pending = null;
  return f;
}
