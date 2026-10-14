"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import type { Chip, Mock, Tone } from "@/app/data/capability-mocks";

/**
 * Draws one product scene from capability-mocks.ts. When the scene scrolls
 * into view its rows arrive one after another, and anything with a next state
 * (a status moving on, a pack sealing, an answer appearing) changes once, a
 * moment later, so a reader sees what the screen does rather than reads it.
 * With reduced motion the final state shows at once.
 */

const TONE: Record<Tone, string> = {
  good: "bg-[#e7f3ec] text-[#2e7a57]",
  warn: "bg-[#fdf1e3] text-[#b45309]",
  bad: "bg-[#f8e9e8] text-[#b23a35]",
  neutral: "bg-[#eef1f5] text-[#5e6b7b]",
  brass: "bg-[#f6eedf] text-[#8a6114]",
};

const BAR: Record<Tone, string> = {
  good: "bg-[#2e7a57]",
  warn: "bg-[#b45309]",
  bad: "bg-[#b23a35]",
  neutral: "bg-[#94a0ae]",
  brass: "bg-[#a8772a]",
};

function useStage(delay = 1300, eager = false) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const inView = eager || seen;
  const reduce = useReducedMotion();
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    if (reduce) {
      setMoved(true);
      return;
    }
    if (!inView) return;
    const t = setTimeout(() => setMoved(true), delay);
    return () => clearTimeout(t);
  }, [inView, reduce, delay]);
  return { ref, show: inView || !!reduce, moved, reduce: !!reduce };
}

function Pill({ chip, moved }: { chip: Chip; moved: boolean }) {
  const next = moved && chip.to;
  const label = next ? chip.to! : chip.from;
  const tone = next ? chip.toTone ?? chip.tone : chip.tone;
  return (
    <motion.span
      key={label}
      initial={next ? { opacity: 0, y: 4 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium ${TONE[tone]}`}
    >
      {next && (tone === "good" || tone === "brass") && <Check className="h-3 w-3" aria-hidden="true" />}
      {label}
    </motion.span>
  );
}

const row = (i: number, show: boolean, reduce: boolean) => ({
  initial: reduce ? false : { opacity: 0, y: 8 },
  animate: show ? { opacity: 1, y: 0 } : undefined,
  transition: { delay: 0.12 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
});

function Frame({ title, children, sample = true }: { title: string; children: React.ReactNode; sample?: boolean }) {
  return (
    <div className="rounded-2xl border border-[#dde2e8] bg-white shadow-[0_24px_48px_-28px_rgba(10,22,40,0.35)] overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[#eef1f5] px-4 sm:px-5 py-3">
        <p className="text-[14px] font-semibold text-[#0e1b2c] truncate">{title}</p>
        {sample && <p className="shrink-0 text-[11px] text-[#94a0ae]">Sample data</p>}
      </div>
      <div className="px-4 sm:px-5 py-3">{children}</div>
    </div>
  );
}

export default function MockScene({ mock, compact = false, eager = false }: { mock: Mock; compact?: boolean; eager?: boolean }) {
  const { ref, show, moved, reduce } = useStage(mock.kind === "seal" ? 2200 : 1300, eager);

  return (
    <div ref={ref} className={`min-w-0 ${compact ? "text-[13px]" : ""}`}>
      {mock.kind === "table" && (
        <Frame title={mock.title}>
          <div className="hidden sm:grid gap-3 border-b border-[#eef1f5] pb-2 text-[12px] text-[#94a0ae]" style={{ gridTemplateColumns: `minmax(0,1.6fr) repeat(${mock.cols.length - 2}, minmax(0,1fr)) auto` }}>
            {mock.cols.map((c) => <span key={c}>{c}</span>)}
          </div>
          <ul>
            {mock.rows.map((r, i) => (
              <motion.li
                key={r.cells[0]}
                {...row(i, show, reduce)}
                className="grid gap-x-3 gap-y-1 items-center border-b border-[#eef1f5] last:border-0 py-2.5 text-[13.5px] grid-cols-[minmax(0,1fr)_auto] sm:[grid-template-columns:var(--cols)]"
                style={{ ["--cols" as string]: `minmax(0,1.6fr) repeat(${mock.cols.length - 2}, minmax(0,1fr)) auto` }}
              >
                <span className="font-medium text-[#0e1b2c] truncate">{r.cells[0]}</span>
                {r.cells.slice(1).map((c) => (
                  <span key={c} className="hidden sm:block text-[#5e6b7b] truncate">{c}</span>
                ))}
                {r.chip ? <Pill chip={r.chip} moved={moved} /> : <span />}
              </motion.li>
            ))}
          </ul>
        </Frame>
      )}

      {mock.kind === "list" && (
        <Frame title={mock.title}>
          {mock.note && <p className="text-[12px] text-[#94a0ae] -mt-1 mb-1">{mock.note}</p>}
          <ul>
            {mock.items.map((it, i) => (
              <motion.li key={it.label} {...row(i, show, reduce)} className="flex items-center justify-between gap-3 border-b border-[#eef1f5] last:border-0 py-2.5">
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-medium text-[#0e1b2c]">{it.label}</span>
                  {it.sub && <span className="block text-[12px] text-[#5e6b7b]">{it.sub}</span>}
                </span>
                <Pill chip={{ ...it.chip }} moved={moved && i !== -1} />
              </motion.li>
            ))}
          </ul>
        </Frame>
      )}

      {mock.kind === "detail" && (
        <Frame title={mock.title}>
          {mock.sub && <p className="text-[12px] text-[#5e6b7b] -mt-1 mb-2">{mock.sub}</p>}
          <dl>
            {mock.fields.map(([k, v], i) => (
              <motion.div key={k} {...row(i, show, reduce)} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-3 border-b border-[#eef1f5] py-2 text-[13.5px]">
                <dt className="text-[#5e6b7b]">{k}</dt>
                <dd className="font-medium text-[#0e1b2c]">{v}</dd>
              </motion.div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            {mock.actions ? (
              <div className="flex gap-2">
                {mock.actions.map((a, i) => (
                  <span
                    key={a}
                    className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors duration-500 ${
                      i === mock.actions!.length - 1 && moved ? "bg-[#0e1b2c] text-white" : "border border-[#dde2e8] text-[#0e1b2c]"
                    }`}
                  >
                    {a}
                  </span>
                ))}
              </div>
            ) : <span />}
            {mock.chip && <Pill chip={mock.chip} moved={moved} />}
          </div>
        </Frame>
      )}

      {mock.kind === "meter" && (
        <Frame title={mock.title}>
          <ul className="space-y-3 py-1">
            {mock.bars.map((b, i) => (
              <li key={b.label}>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#5e6b7b]">{b.label}</span>
                  <span className="font-semibold text-[#0e1b2c] tabular-nums">{b.display}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-[#eef1f5] overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${BAR[b.tone]}`}
                    initial={reduce ? false : { width: 0 }}
                    animate={show ? { width: `${Math.max(b.value, 1.5)}%` } : undefined}
                    style={reduce ? { width: `${Math.max(b.value, 1.5)}%` } : undefined}
                    transition={{ delay: 0.15 * i + 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </li>
            ))}
          </ul>
          {mock.note && <p className="mt-3 text-[12px] text-[#94a0ae]">{mock.note}</p>}
        </Frame>
      )}

      {mock.kind === "seal" && (
        <Frame title={mock.title}>
          <ul>
            {mock.items.map((it, i) => (
              <motion.li key={it} {...row(i, show, reduce)} className="flex items-center gap-2.5 py-1.5 text-[13.5px] text-[#0e1b2c]">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-[#e7f3ec] text-[#2e7a57]"><Check className="h-3 w-3" aria-hidden="true" /></span>
                {it}
              </motion.li>
            ))}
          </ul>
          <div className="mt-3 rounded-xl bg-[#0a1628] px-4 py-3 text-white">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold">
                <Lock className="h-3.5 w-3.5 text-[#c9920a]" aria-hidden="true" />
                {moved ? "Sealed" : "Sealing"}
              </span>
              <span className="text-[11px] text-white/50">SHA-256</span>
            </div>
            <p className="mt-1.5 break-all text-[11.5px] leading-relaxed text-white/75 font-[ui-monospace,monospace]">
              {moved ? mock.hash : "Fingerprinting the contents…"}
            </p>
          </div>
        </Frame>
      )}

      {mock.kind === "log" && (
        <Frame title={mock.title}>
          <ol className="relative py-1">
            {mock.entries.map((e, i) => (
              <motion.li key={e.text} {...row(i * 2, show, reduce)} className="relative grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 py-2 text-[13.5px]">
                <span className="text-[#94a0ae] text-[12px] pt-0.5">{e.when}</span>
                <span className="relative pl-4 text-[#0e1b2c]">
                  <span className={`absolute left-0 top-[7px] h-2 w-2 rounded-full ${i === mock.entries.length - 1 ? "bg-[#a8772a]" : "bg-[#c9ced6]"}`} />
                  {e.text}
                </span>
              </motion.li>
            ))}
          </ol>
        </Frame>
      )}

      {mock.kind === "chat" && (
        <Frame title={mock.title}>
          <div className="space-y-3 py-1">
            <motion.p {...row(0, show, reduce)} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#0e1b2c] px-4 py-2.5 text-[13.5px] text-white w-fit">
              {mock.question}
            </motion.p>
            <motion.p {...row(3, show, reduce)} className="text-[12px] text-[#94a0ae]">Used {mock.tool}</motion.p>
            <motion.div {...row(5, show, reduce)} className="max-w-[90%] rounded-2xl rounded-bl-md bg-[#f5f7f9] px-4 py-2.5 text-[13.5px] text-[#0e1b2c] space-y-0.5">
              {mock.answer.map((a) => <p key={a}>{a}</p>)}
            </motion.div>
          </div>
        </Frame>
      )}

      {mock.kind === "code" && (
        <Frame title={mock.title}>
          <pre className="overflow-x-auto rounded-xl bg-[#0a1628] p-4 text-[12px] leading-[1.6] text-white/85 font-[ui-monospace,monospace]">
            {mock.request.join("\n")}
          </pre>
          <div className="mt-3 flex items-center justify-between gap-3">
            <motion.pre
              initial={reduce ? false : { opacity: 0 }}
              animate={moved ? { opacity: 1 } : undefined}
              className="min-w-0 overflow-x-auto text-[12px] leading-[1.6] text-[#5e6b7b] font-[ui-monospace,monospace]"
            >
              {mock.response.join("\n")}
            </motion.pre>
            <Pill chip={mock.status} moved={moved} />
          </div>
        </Frame>
      )}

      {mock.kind === "page" && (
        <Frame title={mock.title}>
          <div className="space-y-3 py-1">
            {mock.sections.map((s, i) => (
              <motion.section key={s.label} {...row(i * 2, show, reduce)}>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${TONE[s.tone]}`}>{s.label}</span>
                <ul className="mt-1.5 space-y-1">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-[13.5px] text-[#0e1b2c]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a8772a]" aria-hidden="true" />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.section>
            ))}
          </div>
        </Frame>
      )}
    </div>
  );
}
