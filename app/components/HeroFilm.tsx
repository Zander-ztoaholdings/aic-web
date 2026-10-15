"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import AmbientVideo from "./AmbientVideo";

/**
 * The home hero: a short film from Sandton to signature. The city, the data
 * centre and server room where AI runs, the code, the boardroom review, the
 * lawyers on the contract, and a named person signing. Shots are cut with
 * navy and brass stripe wipes. As the page scrolls the film eases back into a
 * rounded frame and the headline lifts away, handing over to the page below.
 *
 * Scroll motion uses transforms only (scale, translate, opacity), which the
 * browser composites without repainting the video, and is smoothed with a
 * spring so a flick on a phone does not stutter.
 *
 * Stock footage from Pexels (free licence, credit optional). No caption ties
 * the people in it to AIC, as that licence requires. Sources, in film order:
 *   Sandton skyline at dusk, by K: pexels.com/video/33644325
 *   Modern data centre, aerial, by Jakub Zerdzicki: pexels.com/video/38000679
 *   Database storage of a server, by ALL IZ Well: pexels.com/video/5028622
 *   Developer typing code on multiple monitors, by Jakub Zerdzicki: pexels.com/video/36328529
 *   Professionals looking carefully at documents, by Mikhail Nilov: pexels.com/video/8847933
 *   Lawyers discussing a contract, by Kaboompics: pexels.com/video/8135851
 *   A person signing a document, by Thirdman: pexels.com/video/8471105 (also aic-signature.mp4)
 */
export default function HeroFilm({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    const isPortrait = window.matchMedia("(max-width: 767px)").matches;
    setPortrait(isPortrait);
    setSrc(isPortrait ? "/media/aic-hero-mobile.mp4" : "/media/aic-hero-desktop.mp4");
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4, restDelta: 0.0005 });
  const filmScale = useTransform(p, [0, 0.9], [1, 0.9]);
  const radius = useTransform(p, [0, 0.9], [0, 28]);
  const textY = useTransform(p, [0, 0.7], [0, -80]);
  const textOpacity = useTransform(p, [0, 0.55], [1, 0]);

  const poster = portrait ? "/media/aic-hero-mobile-poster.jpg" : "/media/aic-hero-desktop-poster.jpg";

  return (
    <section
      ref={ref}
      className="relative isolate bg-[#0a1628] overflow-hidden min-h-[calc(100svh-72px)] lg:min-h-[calc(100vh-72px)] flex items-end lg:items-center"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden will-change-transform [transform:translateZ(0)]"
        style={{ scale: filmScale, borderRadius: radius }}
      >
        <AmbientVideo src={src} poster={poster} playbackRate={0.6} className="absolute inset-0 h-full w-full object-cover" />
        {/* A flat black tint over the whole film, then the navy wash, so white type reads over any frame. */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,40,0.55)_0%,rgba(10,22,40,0.35)_40%,rgba(10,22,40,0.9)_100%)] lg:bg-[linear-gradient(90deg,rgba(10,22,40,0.88)_0%,rgba(10,22,40,0.6)_45%,rgba(10,22,40,0.25)_100%)]" />
      </motion.div>

      <motion.div className="relative w-full will-change-transform" style={{ y: textY, opacity: textOpacity }}>
        {children}
      </motion.div>
    </section>
  );
}
