"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck, Bot, UserCheck, Eye, Server } from "lucide-react";
import { categoryMeta, type Category } from "@/app/data/questions";

const BEAT_DURATION_MS = 4200;
const BEAT_COUNT = 3;

const CATEGORY_LABEL: Record<Category, string> = {
  USAGE: "AI Usage Context",
  OVERSIGHT: "Human Oversight",
  TRANSPARENCY: "Transparency",
  INFRASTRUCTURE: "Infrastructure & Compliance",
};

const CATEGORY_ICON: Record<Category, typeof Bot> = {
  USAGE: Bot,
  OVERSIGHT: UserCheck,
  TRANSPARENCY: Eye,
  INFRASTRUCTURE: Server,
};

/**
 * A short, skippable motion sequence in front of AIC Aware's own intro.
 *
 * Three beats: what this is, how it's structured (pulled from the real
 * categoryMeta weights below, not invented copy), and the privacy promise
 * that used to only appear as a small caption on the old intro screen.
 * Auto-advances like a story, but a click, a keypress, or Skip all move
 * just as fast — nobody is ever stuck waiting on an animation to finish.
 */
export default function AwareWelcome({ onComplete }: { onComplete: () => void }) {
  const [beat, setBeat] = useState(0);
  const reduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function advance() {
    setBeat((b) => {
      if (b + 1 >= BEAT_COUNT) {
        onComplete();
        return b;
      }
      return b + 1;
    });
  }

  useEffect(() => {
    if (reduceMotion) return;
    timerRef.current = setTimeout(advance, BEAT_DURATION_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat, reduceMotion]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onComplete();
      if (e.key === "ArrowRight" || e.key === " ") advance();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen bg-aic-navy text-white overflow-hidden flex flex-col">
      {/* Slow-drifting glow, the same radial AIC uses on the Aware hero — kept moving here since this is the one screen built to hold still on it. */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 20% 20%, #c9920a 0%, transparent 45%)" }}
        animate={reduceMotion ? undefined : { opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Skip — a sibling of the click surface below, never nested inside it. */}
      <button
        type="button"
        onClick={onComplete}
        className="absolute top-6 right-6 z-20 text-xs font-mono uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors px-3 py-2"
      >
        Skip intro
      </button>

      {/* Progress — one segment per beat, filling like a story. */}
      <div className="absolute top-6 left-6 right-24 z-20 flex gap-1.5">
        {Array.from({ length: BEAT_COUNT }).map((_, i) => (
          <div key={i} className="h-[2px] flex-1 bg-white/15 rounded-full overflow-hidden">
            {i < beat && <div className="h-full w-full bg-aic-copper" />}
            {i === beat && (
              <motion.div
                key={beat}
                className="h-full bg-aic-copper origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reduceMotion ? 0 : BEAT_DURATION_MS / 1000, ease: "linear" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Click anywhere to advance — a div, not a button, so the CTA button
          inside the last beat never ends up nested inside another button. */}
      <div
        role="button"
        tabIndex={0}
        onClick={advance}
        onKeyDown={(e) => { if (e.key === "Enter") advance(); }}
        className="flex-1 flex items-center justify-center px-6 cursor-pointer outline-none"
        aria-label="Continue"
      >
        <AnimatePresence mode="wait">
          {beat === 0 && <BeatMark key="beat-0" />}
          {beat === 1 && <BeatStructure key="beat-1" />}
          {beat === 2 && <BeatPrivacy key="beat-2" onBegin={onComplete} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BeatMark() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-lg text-center"
    >
      <motion.svg
        width="72" height="84" viewBox="0 0 22 26" fill="none" className="mx-auto mb-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
      >
        <motion.path
          d="M11 1L2 4.5V12C2 17.5 5.8 22.5 11 24C16.2 22.5 20 17.5 20 12V4.5L11 1Z"
          stroke="#c9920a" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.circle
          cx="11" cy="9.5" r="2.5" fill="#c9920a"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 300 }}
        />
        <motion.path
          d="M6.5 19C6.5 15.5 8.5 13.5 11 13.5C13.5 13.5 15.5 15.5 15.5 19"
          stroke="#c9920a" strokeWidth="1.5" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut", delay: 1.15 }}
        />
      </motion.svg>
      <h1
        className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        AIC Aware
      </h1>
      <p className="text-white/70 text-lg leading-relaxed">
        A free, self-declared check against the same published standard AIC audits to.
      </p>
    </motion.div>
  );
}

function BeatStructure() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-lg w-full"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-aic-copper text-center mb-6">
        How it&apos;s structured
      </p>
      <div className="space-y-3">
        {categoryMeta.map((cat, i) => {
          const Icon = CATEGORY_ICON[cat.key];
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-4 bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4"
            >
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-aic-copper" />
              </div>
              <span className="text-sm font-medium text-white/90 flex-1 text-left">
                {CATEGORY_LABEL[cat.key]}
              </span>
              <span className="font-mono text-xs text-white/40 tabular-nums">
                {Math.round(cat.weight * 100)}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function BeatPrivacy({ onBegin }: { onBegin: () => void }) {
  const lines = [
    "No account needed to start",
    "Your answers stay on this session until you submit",
    "Listing is opt-in — only your name and date ever show",
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-lg text-center"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-aic-copper mb-6">
        Nothing published without your say-so
      </p>
      <div className="space-y-3 mb-9 text-left inline-block">
        {lines.map((line, i) => (
          <motion.div
            key={line}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.15, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <ShieldCheck className="w-4 h-4 text-aic-copper shrink-0" />
            <span className="text-sm text-white/75">{line}</span>
          </motion.div>
        ))}
      </div>
      <div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBegin();
          }}
          className="inline-flex items-center gap-2 bg-aic-copper hover:bg-[#b07d08] text-white px-8 py-4 rounded-full transition-all text-sm font-bold shadow-lg hover:-translate-y-0.5"
        >
          Let&apos;s go <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
