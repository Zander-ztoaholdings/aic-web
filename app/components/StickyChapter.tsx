import type { ReactNode } from "react";

/**
 * A chapter whose framing stays put while its contents move past.
 *
 * This is the one thing worth taking from Apple's long-scroll pages. Theirs
 * are nine sections over eight screens carrying twenty-two art-directed
 * photographs — the character comes from the imagery, and the sticky framing
 * exists to hold a viewpoint steady while you move through it. AIC has no
 * photography and should not buy stock to fake it, but it does have the
 * structural half, and the structural half is what stops a long section
 * reading as an undifferentiated scroll: you always know which chapter you
 * are inside, and the heading does not scroll away and abandon you halfway
 * through five long cards.
 *
 * Sticky only from lg. On a phone a pinned rail would eat the screen, so it
 * simply stacks.
 */
export default function StickyChapter({
  eyebrow,
  title,
  intro,
  aside,
  children,
  tone = "light",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Anything that should travel with the heading — a nav, a figure, a note. */
  aside?: ReactNode;
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] gap-10 lg:gap-16 items-start">
      <div className="lg:sticky lg:top-32">
        <span
          className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
            dark ? "text-aic-copper" : "text-aic-copper"
          }`}
        >
          {eyebrow}
        </span>
        <h2
          className={`text-3xl md:text-[2.5rem] leading-[1.1] tracking-[-0.02em] font-bold mt-4 text-balance ${
            dark ? "text-white" : "text-[#0f1f3d]"
          }`}
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          {title}
        </h2>
        {intro && (
          <div
            className={`mt-5 leading-relaxed max-w-[52ch] ${
              dark ? "text-white/60" : "text-[#3d4a58]"
            }`}
          >
            {intro}
          </div>
        )}
        {aside && <div className="mt-8">{aside}</div>}
      </div>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
