"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The decline letter itself, marked up the way an assessor reads it.
 * Replaces the signing-hands clip: the section argues about a letter, so it
 * shows the letter, with each sentence tied to what it withholds.
 */
const LINES = [
  { text: "This decision was made in accordance with our internal credit policy.", note: "No reason" },
  { text: "We are unable to provide further detail regarding the specific factors involved.", note: "No factors" },
  { text: "This is an automated notification.", note: "No person" },
  { text: "Please do not reply to this message.", note: "No reply" },
];

export default function DeclineLetterArt() {
  const reduce = useReducedMotion();
  return (
    <figure className="relative rounded-xl bg-white shadow-[0_24px_48px_-24px_rgba(10,22,40,0.5)] ring-1 ring-[#e5e7eb] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#eef0f3] px-5 sm:px-7 py-3.5">
        <span className="text-[13px] text-[#5e6b7b]">Automated decline</span>
        <span className="text-[13px] text-[#9aa3ad]">Reply disabled</span>
      </div>
      <div className="px-5 sm:px-7 pt-6 pb-7">
        <p className="font-semibold text-[#0f1f3d] text-[15px]">Dear Applicant,</p>
        <ol className="mt-4 space-y-3.5">
          {LINES.map((l, i) => (
            <motion.li
              key={l.note}
              className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-4"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.18 }}
            >
              <span className="text-[15px] leading-[1.6] text-[#3d4a58] underline decoration-[#c9920a]/60 decoration-2 underline-offset-[5px]">
                {l.text}
              </span>
              <span className="order-first self-start sm:order-none sm:mt-0.5 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#a8772a]/10 px-2.5 py-1 text-[12.5px] font-semibold text-[#8a6114]">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-[#a8772a] text-[10px] text-white">{i + 1}</span>
                {l.note}
              </span>
            </motion.li>
          ))}
        </ol>
        <p className="mt-5 text-[14px] text-[#9aa3ad]">Customer Operations</p>
        <div className="mt-6 rounded-lg border border-dashed border-[#d4183d]/40 bg-[#d4183d]/[0.04] px-4 py-3">
          <p className="text-[13.5px] text-[#0f1f3d]">
            <span className="font-semibold">Missing entirely:</span> a named person who answers for it, and a route to challenge it.
          </p>
        </div>
      </div>
      <figcaption className="sr-only">
        A four-sentence automated decline letter: no reason, no factors, no person, no way to reply, and no route to challenge the decision.
      </figcaption>
    </figure>
  );
}
