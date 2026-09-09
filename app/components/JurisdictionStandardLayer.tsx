"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import type { CountryRegulation } from "@/app/data/regulatory-data";
import { DIVISION_PROFILES } from "@/app/data/divisions";
import {
  RIGHTS,
  requirementsForDivision,
  countByRight,
  STANDARD_VERSION,
  STANDARD_ISSUED,
  type RightCode,
} from "@/app/data/requirements-data";

const RIGHT_ORDER: RightCode[] = ["HU", "EX", "EM", "CO", "TR"];

/**
 * What AIC's own standard asks of an organisation operating in this
 * jurisdiction.
 *
 * WHY THIS IS THE STANDARD AND NOT THE SECTOR REGULATION.
 *
 * The obvious thing to put beside a country is "what the law requires of banks
 * here, of hospitals here, of insurers here". AIC has not done that research
 * for any of the twenty-eight jurisdictions on the map, and a body whose entire
 * position is that unbacked claims should be catchable cannot be the one
 * publishing them. What AIC does own, in full and in public, is its own
 * requirement matrix — forty-four requirements across five Divisions, already
 * published at /standard.
 *
 * So this answers a question that is genuinely answerable: given how your
 * organisation actually uses AI, this is what certification would ask of you,
 * and over there is what the law separately requires. The two are deliberately
 * kept apart. Certification is not compliance, and the disclaimer at the bottom
 * is not boilerplate — it is the distinction the whole scheme rests on.
 */
export default function JurisdictionStandardLayer({
  j,
}: {
  j: CountryRegulation;
}) {
  // Division 3 (Reviewed) is the default because it is the most common shape
  // of the problem — an AI making operational decisions with humans reviewing
  // patterns — not because it is a recommendation.
  const [division, setDivision] = useState(3);

  const profile = DIVISION_PROFILES.find((d) => d.division === division);
  const applicable = useMemo(() => requirementsForDivision(division), [division]);
  const byRight = useMemo(() => countByRight(division), [division]);
  const flagships = useMemo(
    () => applicable.filter((r) => r.flagship),
    [applicable]
  );

  if (!profile) return null;

  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
        What AIC would ask of you here
      </span>
      <p className="text-[#6b7280] leading-[1.65] mt-3 mb-5">
        {j.framework} is what the law says. This is what the AIC standard says —
        a separate question, and one that does not change at the border. What
        changes is which Division your organisation is in, and that depends on
        how much human judgement sits between your AI and the decision.
      </p>

      {/* The selector is the sector view, honestly labelled. A Division is a
          mode of operation, not an industry, and the examples underneath are
          how AIC describes where each mode shows up in practice. */}
      <div
        className="flex flex-wrap gap-2 mb-6"
        role="tablist"
        aria-label="AIC Division"
      >
        {DIVISION_PROFILES.map((d) => {
          const active = d.division === division;
          return (
            <button
              key={d.division}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setDivision(d.division)}
              className={`text-left px-3.5 py-2 rounded-lg border text-sm transition-colors ${
                active
                  ? "border-aic-copper bg-aic-copper/10 text-aic-copper font-semibold"
                  : "border-[#e5e7eb] bg-white text-[#0f1f3d] hover:border-aic-copper/40"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-wide opacity-60 block">
                D{d.division}
              </span>
              {d.name}
            </button>
          );
        })}
      </div>

      <div className="border border-[#e5e7eb] rounded-xl bg-white overflow-hidden">
        <div className="p-6 border-b border-[#f1f1f0]">
          <p
            className="text-lg text-[#0f1f3d] font-bold leading-[1.3] mb-2"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            &ldquo;{profile.tagline}&rdquo;
          </p>
          <p className="text-sm text-[#6b7280] leading-[1.65]">{profile.who}</p>
        </div>

        {profile.examples && (
          <div className="p-6 border-b border-[#f1f1f0] bg-[#f0f4f8]/60">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] block mb-2">
              Where this shows up
            </span>
            <p className="text-sm text-[#0f1f3d] leading-[1.7]">
              {profile.examples}
            </p>
          </div>
        )}

        <div className="p-6 border-b border-[#f1f1f0]">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-[#0f1f3d] tabular-nums">
              {applicable.length}
            </span>
            <span className="text-sm text-[#6b7280]">
              of 44 requirements apply to a Division {division} organisation
            </span>
          </div>
          <div className="space-y-2">
            {RIGHT_ORDER.map((code) => {
              const n = byRight[code];
              const pct = (n / applicable.length) * 100;
              return (
                <div key={code} className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-wide text-[#9ca3af] w-4 shrink-0">
                    {code}
                  </span>
                  <span className="text-sm text-[#0f1f3d] w-28 shrink-0">
                    {RIGHTS[code].name}
                  </span>
                  <span
                    className="h-1.5 rounded-full bg-aic-copper/70 shrink-0"
                    style={{ width: `${Math.max(pct, 2)}%` }}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-[#6b7280] tabular-nums">{n}</span>
                </div>
              );
            })}
          </div>
        </div>

        {flagships.length > 0 && (
          <div className="p-6 border-b border-[#f1f1f0]">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] block mb-3">
              The ones that are hard to fake
            </span>
            <ul className="space-y-3">
              {flagships.map((r) => (
                <li key={r.code} className="flex gap-3">
                  <Star className="w-3.5 h-3.5 text-aic-copper shrink-0 mt-1" />
                  <span className="text-sm text-[#0f1f3d] leading-[1.6]">
                    <span className="font-mono text-[11px] text-[#9ca3af] mr-2">
                      {r.code}
                    </span>
                    {r.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-6 text-sm text-[#6b7280] leading-[1.65]">
          <p className="mb-3">
            <strong className="text-[#0f1f3d]">Measured by:</strong> {profile.kpi}
          </p>
          {profile.note && <p className="mb-3">{profile.note}</p>}
          <p>
            Standard {STANDARD_VERSION}, issued {STANDARD_ISSUED}.{" "}
            <Link href="/standard" className="text-aic-copper hover:underline">
              Read all 44 requirements
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Said plainly, next to the law rather than in a footer, because this is
          exactly the confusion the map is most likely to create. */}
      <p className="text-xs text-[#9ca3af] leading-[1.7] mt-4">
        AIC certification is not {j.name} compliance and does not establish it.
        A certified organisation has been assessed against the standard above;
        whether it satisfies {j.framework} is a separate question for {j.authority}
        , and neither answer substitutes for the other.
      </p>
    </div>
  );
}
