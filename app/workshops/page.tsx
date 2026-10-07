"use client";

import { useState } from "react";
import Link from "next/link";
import { workshopIndustries } from "@/app/data/workshops-data";
import WorkshopIntake from "./WorkshopIntake";

/**
 * /workshops, redone October 2026.
 *
 * Reads as a prospectus rather than a landing page: pick your industry, see
 * the whole syllabus at once, see how a session runs, and see the line AIC
 * keeps between teaching and assessing. The auto-rotating topic carousel is
 * gone; motion nobody asked for was dimming four-fifths of the syllabus at any
 * moment. The page also sat on a 1,600px container with a 16px gutter, which
 * is what put text against the edge of the screen on laptops.
 */

const HOW = [
  { title: "Scoped to the room", text: "Sessions are built for one industry and one team, on site or remote, and sized to the number of people attending." },
  { title: "Ends where you are", text: "Every session closes on South African regulation, with POPIA section 71 and what it asks of automated decisions." },
  { title: "Teaching, not advice", text: "We teach how the framework works. We do not look at your systems, score your organisation or tell you what to change." },
];

export default function WorkshopsPage() {
  const [activeSlug, setActiveSlug] = useState(workshopIndustries[0].slug);
  const active = workshopIndustries.find((w) => w.slug === activeSlug) ?? workshopIndustries[0];

  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm text-white/60 mb-4">Workshops</p>
            <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: "'Merriweather', serif" }}>
              We teach the framework. We do not consult on it.
            </h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">
              Sessions for leadership, risk and engineering teams on how AI decisioning maps onto the
              safety and governance frameworks your industry already runs on.
            </p>
            <a href="#enquire" className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#c9920a] px-6 py-3 text-[15px] font-semibold text-[#0e1b2c] hover:bg-[#dcae4c] transition-colors">
              Ask about a session for your team
            </a>
          </div>
        </div>
      </section>

      {/* The syllabus */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>
          Choose your industry
        </h2>
        <div role="tablist" aria-label="Industry" className="mt-5 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {workshopIndustries.map((w) => {
            const on = w.slug === activeSlug;
            return (
              <button
                key={w.slug}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActiveSlug(w.slug)}
                className={`shrink-0 rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${on ? "bg-[#0e1b2c] text-white" : "bg-white border border-[#dde2e8] text-[#0e1b2c] hover:border-[#a8772a]"}`}
              >
                {w.label}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="mt-8 grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-8 lg:gap-14 items-start">
          <div>
            <p className="text-lg leading-[1.6]" style={{ fontFamily: "'Merriweather', serif" }}>{active.summary}</p>
            <Link href={`/frameworks/${active.frameworkSlug}`} className="mt-4 inline-block text-[15px] font-semibold text-[#8a6114] underline-offset-2 hover:underline">
              Read the framework mapping this session teaches
            </Link>
          </div>
          <div className="bg-white border border-[#dde2e8] rounded-xl">
            <p className="px-5 md:px-6 pt-5 text-sm text-[#5e6b7b]">What the session covers</p>
            <ol className="divide-y divide-[#dde2e8]">
              {active.topics.map((t, i) => (
                <li key={t} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 px-5 md:px-6 py-4">
                  <span className="text-[#8a6114] font-semibold tabular-nums">{i + 1}</span>
                  <span className="text-[16px] leading-[1.6]">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* How a session runs */}
      <section className="bg-white border-y border-[#dde2e8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
          <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>How a session runs</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            {HOW.map((h) => (
              <div key={h.title} className="border-t-2 border-[#a8772a] pt-4">
                <h3 className="font-semibold">{h.title}</h3>
                <p className="text-[15px] text-[#5e6b7b] leading-[1.65] mt-2">{h.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-[70ch] text-[15px] text-[#5e6b7b] leading-[1.7]">
            Attending a workshop is not a step towards certification and has no bearing on the outcome
            of one. AIC never certifies an organisation it has advised, and keeping workshops to
            teaching is what lets it certify yours later.{" "}
            <Link href="/impartiality" className="font-semibold text-[#8a6114] underline-offset-2 hover:underline">The impartiality statement</Link>
          </p>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="scroll-mt-24 max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-8 lg:gap-14 items-start">
        <div className="lg:sticky lg:top-32">
          <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>
            Bring a session to your team
          </h2>
          <p className="text-[#5e6b7b] leading-[1.7] mt-3">
            Tell us the industry and how many people, and you get a straight answer on format, length
            and cost rather than a discovery call.
          </p>
          <p className="text-sm text-[#5e6b7b] leading-[1.7] mt-3">
            We ask nothing about your AI governance here, on purpose: workshops teach and do not assess.
          </p>
        </div>
        <WorkshopIntake industrySlug={active.slug} />
      </section>
    </div>
  );
}
