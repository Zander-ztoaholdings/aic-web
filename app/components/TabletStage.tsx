"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import AmbientVideo from "./AmbientVideo";

/**
 * The platform on a tablet, rising out of the dark as the page scrolls: it
 * starts lying back, almost flat, and tilts up to face the reader while a
 * pool of light opens beneath it. On the screen, the real workspace moving
 * through the record, the AI register, the decision log, the risk register and
 * the frameworks, filmed from the product with sample data.
 */
export default function TabletStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4, restDelta: 0.0005 });
  const rotateX = useTransform(p, [0, 1], [58, 0]);
  const scale = useTransform(p, [0, 1], [0.82, 1]);
  const y = useTransform(p, [0, 1], [60, 0]);
  const glow = useTransform(p, [0.2, 1], [0.15, 1]);

  return (
    <div ref={ref} className="relative mx-auto max-w-[1040px] [perspective:1600px]">
      <motion.div
        className="relative will-change-transform"
        style={reduce ? undefined : { rotateX, scale, y, transformOrigin: "50% 100%" }}
      >
        <div className="rounded-[34px] bg-[#16181d] p-[14px] sm:p-[18px] shadow-[0_0_0_1.5px_#2c3038_inset,0_0_0_1px_#3a3f48,0_60px_120px_-40px_rgba(0,0,0,0.8)]">
          <div className="relative overflow-hidden rounded-[20px] bg-white aspect-[4/3]">
            <AmbientVideo src="/media/platform-tour.mp4" poster="/media/platform-tour-poster.jpg" className="absolute inset-0 h-full w-full object-cover object-top" />
          </div>
        </div>
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -bottom-16 h-24 w-[85%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.35),rgba(255,255,255,0))] blur-md"
        style={reduce ? undefined : { opacity: glow }}
      />
    </div>
  );
}
