"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Mock } from "@/app/data/capability-mocks";
import MockScene from "./MockScene";

/**
 * The platform page's opening: the workspace with a row of tabs above it that
 * steps through the products on its own every few seconds, and stops when a
 * visitor picks one.
 */
export default function PlatformTour({ tabs }: { tabs: { name: string; mock: Mock }[] }) {
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (held || reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % tabs.length), 5200);
    return () => clearInterval(t);
  }, [held, reduce, tabs.length]);

  return (
    <div>
      <div role="tablist" aria-label="Products" className="flex gap-2 overflow-x-auto pb-1 sm:justify-center [scrollbar-width:none]">
        {tabs.map((t, n) => (
          <button
            key={t.name}
            role="tab"
            aria-selected={n === i}
            onClick={() => { setI(n); setHeld(true); }}
            className={`relative shrink-0 overflow-hidden rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${n === i ? "bg-[#0e1b2c] text-white" : "bg-white text-[#3d4a58] border border-[#dde2e8] hover:border-[#0e1b2c]"}`}
          >
            {t.name}
            {n === i && !held && !reduce && (
              <motion.span key={i} className="absolute left-0 bottom-0 h-[2px] bg-[#c9920a]" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5.2, ease: "linear" }} />
            )}
          </button>
        ))}
      </div>
      <div className="relative mt-8">
        <div aria-hidden="true" className="absolute inset-x-0 top-[10%] bottom-[-6%] rounded-[32px] bg-[#0a1628]" />
        <div className="relative mx-3 sm:mx-10 lg:mx-24 rounded-2xl border border-[#dde2e8] bg-[#f5f7f9] shadow-[0_40px_80px_-40px_rgba(10,22,40,0.6)] overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[#dde2e8] bg-white px-4 py-2.5">
            <span className="font-bold text-[15px]">AIC<span className="text-[#c9920a]">.</span></span>
            <span className="text-[12px] text-[#5e6b7b]">Karoo Lending (Demo)</span>
          </div>
          <div className="p-3 sm:p-6 lg:p-8 min-h-[330px] min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
                <MockScene mock={tabs[i].mock} eager />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
