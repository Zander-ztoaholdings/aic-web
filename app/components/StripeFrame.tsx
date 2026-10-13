"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * The hero's stripe wipe, carried into the page: navy and brass bars behind a
 * piece of media that slide in at different speeds as it scrolls into view.
 */
const BARS = [
  { top: "4%", h: "7%", w: "78%", c: "#0A1728", from: -160 },
  { top: "14%", h: "2%", w: "64%", c: "#A8772A", from: -260 },
  { top: "30%", h: "10%", w: "92%", c: "#0E1B2C", from: -120 },
  { top: "52%", h: "2%", w: "70%", c: "#C9920A", from: -320 },
  { top: "62%", h: "12%", w: "86%", c: "#0A1728", from: -200 },
  { top: "84%", h: "3%", w: "60%", c: "#A8772A", from: -280 },
  { top: "91%", h: "6%", w: "74%", c: "#0E1B2C", from: -140 },
];

function Bar({ bar, progress, still }: { bar: (typeof BARS)[number]; progress: ReturnType<typeof useSpring>; still: boolean }) {
  const x = useTransform(progress, [0, 0.45], [bar.from, 0]);
  return (
    <motion.span
      className="absolute left-0 block will-change-transform"
      style={{ top: bar.top, height: bar.h, width: bar.w, background: bar.c, x: still ? 0 : x }}
    />
  );
}

export default function StripeFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4, restDelta: 0.0005 });
  return (
    <div ref={ref} className={`relative ${className}`}>
      <div aria-hidden="true" className="absolute -left-5 sm:-left-8 right-6 top-0 bottom-0 overflow-hidden">
        {BARS.map((b) => (
          <Bar key={b.top} bar={b} progress={smooth} still={!!reduce} />
        ))}
      </div>
      <div className="relative px-6 py-[12%] sm:px-10">{children}</div>
    </div>
  );
}
