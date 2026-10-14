"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Mock } from "@/app/data/capability-mocks";
import MockScene from "./MockScene";

const MENUS = ["AI overview", "Compliance tracking", "Risk and people", "AIC certification"];

/**
 * The product, framed as the workspace it lives in: the AIC top bar, the four
 * menus with the right one open, and the scene in the main pane, set on a navy
 * ground with the seal's brass arcs behind it. A second, smaller scene can
 * float over the corner, as a detail panel would open in the product.
 */
export default function AppStage({ main, aside, menu = 0, org = "Karoo Lending (Demo)" }: { main: Mock; aside?: Mock; menu?: number; org?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative">
      {/* Ground */}
      <div aria-hidden="true" className="absolute inset-x-0 top-[12%] bottom-[-8%] rounded-[32px] bg-[#0a1628] overflow-hidden">
        <svg viewBox="0 0 600 600" className="absolute -right-24 -top-24 w-[520px] opacity-70">
          {Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx="300" cy="300" r={90 + i * 34} fill="none" stroke={i === 5 ? "#c9920a" : "#a8772a"} strokeOpacity={0.2 + i * 0.08} strokeWidth={i === 5 ? 2 : 1.25} strokeDasharray={`${(2 * Math.PI * (90 + i * 34) * (0.45 + i * 0.06)).toFixed(0)} 4000`} transform={`rotate(${-80 + i * 12} 300 300)`} />
          ))}
        </svg>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative mx-3 sm:mx-8 lg:mx-14 rounded-2xl border border-[#dde2e8] bg-[#f5f7f9] shadow-[0_40px_80px_-40px_rgba(10,22,40,0.6)] overflow-hidden"
      >
        <div className="flex items-center gap-3 border-b border-[#dde2e8] bg-white px-4 py-2.5">
          <span className="font-bold text-[15px] text-[#0e1b2c]">AIC<span className="text-[#c9920a]">.</span></span>
          <span className="text-[12px] text-[#5e6b7b] truncate">{org}</span>
          <span className="ml-auto hidden md:flex gap-1">
            {MENUS.map((m, i) => (
              <span key={m} className={`rounded-full px-3 py-1 text-[12px] ${i === menu ? "bg-[#0e1b2c] text-white" : "text-[#5e6b7b]"}`}>{m}</span>
            ))}
          </span>
        </div>
        <div className="p-3 sm:p-6 lg:p-8 min-w-0">
          <MockScene mock={main} />
        </div>
      </motion.div>

      {aside && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
          className="hidden lg:block absolute right-0 -bottom-10 w-[360px]"
        >
          <MockScene mock={aside} compact />
        </motion.div>
      )}
    </div>
  );
}
