"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CATEGORIES, INTEGRATIONS, type IntegrationCategory, type IntegrationStatus } from "@/app/data/integrations";

type StatusFilter = "all" | IntegrationStatus;

const STATUS_LABEL: Record<IntegrationStatus, string> = {
  live: "Live",
  built: "Built, awaiting first client",
};

const STATUS_TONE: Record<IntegrationStatus, string> = {
  live: "bg-[#2e7a57]/10 text-[#22603f]",
  built: "bg-[#eef1f5] text-[#3d4a58]",
};

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/**
 * A browsable library of the systems AIC reads: search, a category filter and
 * a status filter. Names only, no third-party logos.
 */
export default function IntegrationsLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<IntegrationCategory | "All">("All");
  const [status, setStatus] = useState<StatusFilter>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: INTEGRATIONS.length };
    for (const i of INTEGRATIONS) c[i.category] = (c[i.category] ?? 0) + 1;
    return c;
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INTEGRATIONS.filter(
      (i) =>
        (category === "All" || i.category === category) &&
        (status === "all" || i.status === status) &&
        (!q || i.name.toLowerCase().includes(q) || i.reads.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)),
    ).sort((a, b) => (a.status === b.status ? a.name.localeCompare(b.name) : a.status === "live" ? -1 : 1));
  }, [query, category, status]);

  const pill = (active: boolean) =>
    `inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[14px] font-medium transition-colors ${
      active ? "border-[#0e1b2c] bg-[#0e1b2c] text-white" : "border-[#dde2e8] bg-white text-[#0e1b2c] hover:border-[#a8772a]"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-sm">
          <span className="sr-only">Search integrations</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e6b7b]" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or what it reads"
            className="h-11 w-full rounded-full border border-[#dde2e8] bg-white pl-10 pr-4 text-[15px] text-[#0e1b2c] placeholder:text-[#7a8696] focus:border-[#0e1b2c] focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {(["all", "live", "built"] as StatusFilter[]).map((s) => (
            <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)} className={pill(status === s)}>
              {s === "all" ? "All statuses" : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={pill(category === c)}>
            {c}
            <span className={category === c ? "text-white/70" : "text-[#7a8696]"}>{counts[c] ?? 0}</span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-[14px] text-[#5e6b7b]" aria-live="polite">
        Showing {shown.length} of {INTEGRATIONS.length}
      </p>

      {shown.length === 0 ? (
        <div className="mt-4 rounded-xl border border-[#dde2e8] bg-white p-8 text-center">
          <p className="text-[16px] font-medium">Nothing matches that search.</p>
          <p className="mt-1 text-[15px] text-[#5e6b7b]">Try another name, or tell us which system you need below.</p>
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((i) => (
            <li key={i.name} className="flex flex-col rounded-xl border border-[#dde2e8] bg-white p-5">
              <div className="flex items-start gap-3">
                <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#0e1b2c] text-[14px] font-bold tracking-wide text-white">
                  {initials(i.name)}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[16.5px] font-bold leading-snug">{i.name}</h3>
                  <p className="text-[13.5px] text-[#5e6b7b]">{i.category}</p>
                </div>
              </div>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#2b3a4d]">{i.reads}</p>
              <span className={`mt-4 inline-flex w-fit rounded-full px-2.5 py-1 text-[12.5px] font-medium ${STATUS_TONE[i.status]}`}>{STATUS_LABEL[i.status]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
