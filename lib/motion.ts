/**
 * The site's motion system.
 *
 * One curve, three durations, one stagger interval — defined here and nowhere
 * else. Before this, durations were invented per component (0.4 here, 0.6
 * there, delay i * 0.15 somewhere else), which is why the motion read as
 * texture rather than intent: when everything moves differently, no movement
 * means anything.
 *
 * The governing rule is "intention behind context": motion has to say what it
 * is doing that the context requires. Two things pass that test on this site —
 * sequencing a comparison so it can be read in order, and giving weight to a
 * number that is itself the payload. Everything else stays still, deliberately.
 *
 * Only `transform` and `opacity` are animated. Both are composited off the
 * main thread, so motion stays smooth on a mid-range phone; animating layout
 * properties would not.
 */

/**
 * Immediate departure, long settle. The perceived speed of an interface comes
 * almost entirely from how fast a movement *starts*, not how long it runs.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Symmetrical, for things that move in both directions. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  /** State flips: a button, a toggle. Short enough to feel instant. */
  fast: 0.18,
  /** The default. Something appearing or repositioning. */
  base: 0.34,
  /** Reserved for a moment the reader caused and is watching. */
  slow: 0.55,
} as const;

/** Between items in a sequence. Below ~40ms reads as simultaneous; above ~90ms as slow. */
export const STAGGER = 0.055;

/** Standard entrance: rise and fade, from a state that is never hidden at rest. */
export function riseIn(index = 0, reduced = false) {
  if (reduced) return { initial: false as const, animate: { opacity: 1, y: 0 } };
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: DURATION.base,
      ease: EASE_OUT,
      delay: index * STAGGER,
    },
  };
}

/**
 * Counts a number up over a duration, for figures where the magnitude is the
 * point. Returns the final value immediately when motion is reduced — the
 * number is the information, the animation is only emphasis.
 */
export function countTo(
  to: number,
  onValue: (v: number) => void,
  { duration = 900, reduced = false }: { duration?: number; reduced?: boolean } = {}
): () => void {
  if (reduced || to === 0) {
    onValue(to);
    return () => {};
  }
  let raf = 0;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    // Matches EASE_OUT closely enough for a number, without a bezier solver.
    const eased = 1 - Math.pow(1 - t, 3);
    onValue(Math.round(to * eased));
    if (t < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
