"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { KIND_LABEL, type NewsItem, type NewsKind } from "@/lib/news-shared";

type KindFilter = "all" | NewsKind;

function fmt(iso: string) {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * The list on /news, /articles and /policy. Every item is a real link (no
 * client-only routing), so crawlers follow them all. Topics are taken from the
 * items, so no filter leads to an empty list; the previous page offered seven
 * hard-coded categories, five of which had nothing in them.
 */
export default function NewsList({ items, initialKind = "all", lockKind = false, unavailable = false }: {
  items: NewsItem[];
  initialKind?: KindFilter;
  lockKind?: boolean;
  unavailable?: boolean;
}) {
  const [kind, setKind] = useState<KindFilter>(initialKind);
  const [topic, setTopic] = useState<string>("All topics");

  // /news?kind=policy from a breadcrumb. Read on the client so the page stays
  // statically cached.
  useEffect(() => {
    if (lockKind) return;
    const k = new URLSearchParams(window.location.search).get("kind");
    if (k === "article" || k === "policy") setKind(k);
  }, [lockKind]);

  const byKind = useMemo(() => items.filter((i) => kind === "all" || i.kind === kind), [items, kind]);
  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    byKind.forEach((i) => counts.set(i.topic, (counts.get(i.topic) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [byKind]);
  const shown = byKind.filter((i) => topic === "All topics" || i.topic === topic);
  const [lead, ...rest] = shown;

  const counts = { all: items.length, article: items.filter((i) => i.kind === "article").length, policy: items.filter((i) => i.kind === "policy").length };

  return (
    <div>
      {!lockKind && (
        <div role="tablist" aria-label="Kind" className="flex flex-wrap gap-2">
          {(["all", "policy", "article"] as const).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={kind === k}
              onClick={() => { setKind(k); setTopic("All topics"); }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${kind === k ? "bg-[#0e1b2c] text-white" : "bg-white text-[#0e1b2c] border border-[#dde2e8] hover:border-[#a8772a]"}`}>
              {k === "all" ? "Everything" : k === "policy" ? "Policy updates" : "Analysis"} <span className={kind === k ? "text-white/60" : "text-[#5e6b7b]"}>{counts[k]}</span>
            </button>
          ))}
        </div>
      )}

      {topics.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Topic">
          {[["All topics", byKind.length] as [string, number], ...topics].map(([t, n]) => (
            <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${topic === t ? "bg-[#a8772a]/15 text-[#0e1b2c] font-semibold" : "text-[#5e6b7b] hover:text-[#0e1b2c]"}`}>
              {t} <span className="text-[#5e6b7b]">{n}</span>
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#dde2e8] bg-white p-10 text-center">
          <p className="font-semibold text-[#0e1b2c]">{unavailable ? "We can't load the news right now." : "Nothing published here yet."}</p>
          <p className="mt-2 text-sm text-[#5e6b7b] max-w-md mx-auto leading-relaxed">
            In the meantime the <Link href="/guides" className="text-[#8a6114] underline underline-offset-2">guides</Link> answer the questions we are asked most, and the{" "}
            <Link href="/regulatory-map" className="text-[#8a6114] underline underline-offset-2">regulatory map</Link> shows where AI law stands by country.
          </p>
        </div>
      ) : (
        <>
          {lead && (
            <Link href={lead.href} className="group mt-8 block rounded-xl bg-aic-navy text-white p-7 md:p-10 hover:bg-[#0e1f36] transition-colors">
              <p className="text-sm text-[#e0b85a]">{KIND_LABEL[lead.kind]}, {lead.topic}</p>
              <h2 className="mt-3 text-2xl md:text-[2.1rem] font-bold leading-[1.15] max-w-3xl group-hover:underline decoration-[#c9920a] underline-offset-4" style={{ fontFamily: "'Merriweather', serif" }}>{lead.title}</h2>
              {lead.summary && <p className="mt-4 text-white/75 leading-relaxed max-w-3xl">{lead.summary}</p>}
              <p className="mt-5 text-sm text-white/60">{[lead.author, fmt(lead.date)].filter(Boolean).join(", ")}</p>
            </Link>
          )}
          {rest.length > 0 && (
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {rest.map((i) => (
                <li key={`${i.kind}:${i.slug}`}>
                  <Link href={i.href} className="group flex h-full flex-col rounded-xl border border-[#dde2e8] bg-white p-6 hover:border-[#a8772a] transition-colors">
                    <p className="text-sm text-[#8a6114]">{KIND_LABEL[i.kind]}, {i.topic}</p>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-[#0e1b2c] group-hover:underline decoration-[#a8772a] underline-offset-4" style={{ fontFamily: "'Merriweather', serif" }}>{i.title}</h3>
                    {i.summary && <p className="mt-2 text-[15px] text-[#5e6b7b] leading-relaxed line-clamp-3">{i.summary}</p>}
                    <p className="mt-auto pt-4 text-sm text-[#5e6b7b]">
                      {[i.author, fmt(i.date)].filter(Boolean).join(", ")}
                      {i.jurisdictions.length > 0 && <span>{` for ${i.jurisdictions.slice(0, 3).join(", ")}`}</span>}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

/** Email sign-up for new posts. Stored on our own database through
 *  /api/subscribers; the reader is told plainly if it did not go through. */
export function NewsSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("sending");
    try {
      const res = await fetch("/api/subscribers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "news" }) });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="rounded-xl border border-[#dde2e8] bg-white p-7 md:p-9">
      <h2 className="text-xl md:text-2xl font-bold text-[#0e1b2c]" style={{ fontFamily: "'Merriweather', serif" }}>Get new updates by email</h2>
      <p className="mt-2 text-[#5e6b7b] leading-relaxed max-w-2xl">
        One email when we publish a policy update or a piece of analysis. No marketing sequence, and you can
        leave with one click. Prefer a feed reader? Use the <a href="/news/feed.xml" className="text-[#8a6114] underline underline-offset-2">RSS feed</a>.
      </p>
      {state === "done" ? (
        <p className="mt-5 text-[#0e1b2c] font-semibold" role="status">Thank you. You are on the list.</p>
      ) : (
        <form onSubmit={submit} className="mt-5 flex flex-col sm:flex-row gap-3 max-w-xl">
          <label htmlFor="news-email" className="sr-only">Email address</label>
          <input id="news-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.co.za"
            className="flex-1 rounded-lg border border-[#dde2e8] px-4 py-3 text-[15px] text-[#0e1b2c] focus:outline-none focus:border-[#a8772a]" />
          <button type="submit" disabled={state === "sending"}
            className="rounded-lg bg-[#c9920a] px-6 py-3 text-[15px] font-semibold text-[#0e1b2c] hover:bg-[#dcae4c] disabled:opacity-60 transition-colors">
            {state === "sending" ? "Adding you" : "Sign up"}
          </button>
        </form>
      )}
      {state === "error" && <p className="mt-3 text-sm text-[#b42318]" role="alert">That did not go through. Please try again, or email us and we will add you.</p>}
    </section>
  );
}
