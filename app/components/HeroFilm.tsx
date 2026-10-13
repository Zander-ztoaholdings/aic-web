"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * The home hero: a short film of where automated decisions land (a city, an
 * interview, a cash machine, a hospital ward, a phone), cut together with
 * navy and brass stripe wipes. As the page scrolls the film draws in from
 * the edges into a rounded frame and the headline lifts away, so the hero
 * hands over to the page below instead of ending at a hard edge.
 *
 * Stock footage from Pexels (free licence, credit optional). No caption ties
 * the people in it to AIC, as that licence requires. Sources, in film order:
 *   Sandton skyline at dusk, by K: pexels.com/video/33644325
 *   An interviewer talking to an applicant, by Tima Miroshnichenko: pexels.com/video/5438980
 *   A woman at a cash machine, by Liliana Drew: pexels.com/video/8551026
 *   A doctor updating a patient and family, by RDNE Stock project: pexels.com/video/6130110
 *   Hands holding a smartphone, by K: pexels.com/video/6186015 (also aic-decision-phone.mp4)
 *
 * The file is chosen after mount (portrait for phones, landscape otherwise),
 * so a visitor only downloads one. Reduced motion or Save-Data shows the
 * still poster and nothing moves.
 */
export default function HeroFilm({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [src, setSrc] = useState<string | null>(null);
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    const isPortrait = window.matchMedia("(max-width: 767px)").matches;
    setPortrait(isPortrait);
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduce || conn?.saveData) return;
    setSrc(isPortrait ? "/media/aic-hero-mobile.mp4" : "/media/aic-hero-desktop.mp4");
  }, [reduce]);

  useEffect(() => {
    const v = videoRef.current;
    if (v && src) v.play().catch(() => {});
  }, [src]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const clip = useTransform(scrollYProgress, [0, 0.85], ["inset(0% 0% 0% 0% round 0px)", "inset(10% 5% 6% 5% round 28px)"]);
  const filmScale = useTransform(scrollYProgress, [0, 0.85], [1, 0.96]);
  const textY = useTransform(scrollYProgress, [0, 0.7], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const poster = portrait ? "/media/aic-hero-mobile-poster.jpg" : "/media/aic-hero-desktop-poster.jpg";

  return (
    <section ref={ref} className="relative bg-[#0a1628] overflow-hidden min-h-[calc(100svh-112px)] lg:min-h-screen flex items-end lg:items-center">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={reduce ? undefined : { clipPath: clip, scale: filmScale }}
      >
        <video
          ref={videoRef}
          src={src ?? undefined}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="h-full w-full object-cover"
        />
        {/* Navy wash so white type reads over any frame. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,40,0.55)_0%,rgba(10,22,40,0.35)_40%,rgba(10,22,40,0.9)_100%)] lg:bg-[linear-gradient(90deg,rgba(10,22,40,0.88)_0%,rgba(10,22,40,0.6)_45%,rgba(10,22,40,0.25)_100%)]" />
      </motion.div>

      <motion.div className="relative w-full" style={reduce ? undefined : { y: textY, opacity: textOpacity }}>
        {children}
      </motion.div>
    </section>
  );
}
