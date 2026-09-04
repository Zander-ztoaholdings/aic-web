"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { workshopIndustries } from "@/app/data/workshops-data";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * Workshop enquiry intake.
 *
 * The page previously ended on "tell us your industry and team size" above a
 * button to the general contact form, which asks for neither — so the two
 * facts needed to answer a workshop enquiry were the two we did not collect,
 * and every reply had to start by asking for them.
 *
 * Deliberately logistics only: industry, size, format, timing. Nothing here
 * asks what the organisation's AI governance looks like. Workshops teach and
 * do not assess, and an intake form that started profiling a prospect's
 * compliance posture would be the first crack in the firewall that keeps AIC
 * able to certify them later.
 *
 * Posts to /api/contact, so a workshop enquiry lands in the same durable path
 * as everything else — Postgres, then an email to a human, then Notion — and
 * reports success only if something durable accepted it.
 */

const TEAM_SIZES = ["Under 10", "10–25", "25–50", "50–150", "150+"];
const FORMATS = ["On-site", "Remote", "Either"];
const TIMEFRAMES = ["Within a month", "This quarter", "Next quarter", "Just exploring"];

export default function WorkshopIntake({ industrySlug }: { industrySlug: string }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    role: "",
    teamSize: "",
    format: "",
    timeframe: "",
    message: "",
  });
  const [industry, setIndustry] = useState(industrySlug);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  // Keeps following the tab selection until the visitor overrides it themselves.
  const [touchedIndustry, setTouchedIndustry] = useState(false);
  const effectiveIndustry = touchedIndustry ? industry : industrySlug;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const ready =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.organization.trim() &&
    form.teamSize;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready || state === "sending") return;
    setState("sending");
    setError("");

    const label =
      workshopIndustries.find((w) => w.slug === effectiveIndustry)?.label ??
      effectiveIndustry;

    // Workshop specifics travel in the message rather than as new columns:
    // they are the content of the enquiry, not a new kind of record.
    const message = [
      `Workshop enquiry — ${label}`,
      `Team size: ${form.teamSize}`,
      form.format && `Preferred format: ${form.format}`,
      form.timeframe && `Timing: ${form.timeframe}`,
      form.message && `\n${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          organization: form.organization,
          role: form.role,
          enquiryType: "Workshops & Training",
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) {
        throw new Error(
          data?.error ??
            "We couldn't record that. Please email zander@ztoaholdings.com directly."
        );
      }
      setState("sent");
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please email zander@ztoaholdings.com."
      );
    }
  }

  if (state === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.base, ease: EASE_OUT }}
        className="bg-white border border-[#e5e7eb] rounded-xl p-8 md:p-10 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-5">
          <Check className="w-6 h-6 text-[#0a7a54]" />
        </div>
        <h3
          className="text-2xl font-bold text-[#0f1f3d] mb-3"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          We have it
        </h3>
        <p className="text-[#6b7280] leading-relaxed max-w-md mx-auto">
          Your enquiry is recorded and a person has been notified — not a queue.
          You will hear from Zander directly, usually within two working days.
        </p>
      </motion.div>
    );
  }

  const fieldClass =
    "w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white text-[15px] text-[#0f1f3d] placeholder:text-[#9ca3af] focus:outline-none focus:border-aic-copper focus:ring-2 focus:ring-aic-copper/20 transition-all";
  const labelClass = "block text-sm font-medium text-[#0f1f3d] mb-1.5";

  function Choice({
    name,
    options,
    value,
    onPick,
  }: {
    name: string;
    options: string[];
    value: string;
    onPick: (v: string) => void;
  }) {
    return (
      <div className="flex flex-wrap gap-2" role="group" aria-label={name}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onPick(o)}
            className={`px-3.5 py-2 rounded-lg border text-sm transition-colors ${
              value === o
                ? "border-aic-copper bg-aic-copper/10 text-[#8a6607] font-medium"
                : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-aic-copper/40 hover:text-[#0f1f3d]"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-[#e5e7eb] rounded-xl p-6 md:p-8 space-y-6"
    >
      <div>
        <label className={labelClass} htmlFor="wi-industry">
          Which session
        </label>
        <select
          id="wi-industry"
          value={effectiveIndustry}
          onChange={(e) => {
            setTouchedIndustry(true);
            setIndustry(e.target.value);
          }}
          className={fieldClass}
        >
          {workshopIndustries.map((w) => (
            <option key={w.slug} value={w.slug}>
              {w.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className={labelClass}>
          How many people <span className="text-[#9ca3af] font-normal">· required</span>
        </span>
        <Choice
          name="Team size"
          options={TEAM_SIZES}
          value={form.teamSize}
          onPick={(v) => set("teamSize", v)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <span className={labelClass}>Format</span>
          <Choice
            name="Format"
            options={FORMATS}
            value={form.format}
            onPick={(v) => set("format", v)}
          />
        </div>
        <div>
          <span className={labelClass}>Timing</span>
          <Choice
            name="Timing"
            options={TIMEFRAMES}
            value={form.timeframe}
            onPick={(v) => set("timeframe", v)}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="wi-first">First name</label>
          <input id="wi-first" required value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="wi-last">Last name</label>
          <input id="wi-last" required value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="wi-email">Work email</label>
          <input id="wi-email" type="email" required value={form.email}
            onChange={(e) => set("email", e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="wi-org">Organisation</label>
          <input id="wi-org" required value={form.organization}
            onChange={(e) => set("organization", e.target.value)} className={fieldClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="wi-role">
          Your role <span className="text-[#9ca3af] font-normal">· optional</span>
        </label>
        <input id="wi-role" value={form.role}
          onChange={(e) => set("role", e.target.value)} className={fieldClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="wi-msg">
          Anything specific you want covered{" "}
          <span className="text-[#9ca3af] font-normal">· optional</span>
        </label>
        <textarea id="wi-msg" rows={3} value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className={`${fieldClass} resize-y`} />
      </div>

      {state === "error" && (
        <div className="flex items-start gap-2.5 text-sm text-[#a8281f] bg-[#a8281f]/5 border border-[#a8281f]/20 rounded-lg p-3.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={!ready || state === "sending"}
          className="inline-flex items-center justify-center gap-2 bg-aic-navy text-white px-7 py-3.5 rounded-lg font-semibold text-sm transition-all enabled:hover:bg-[#0f1f3d] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {state === "sending" && <Loader2 className="w-4 h-4 animate-spin" />}
          {state === "sending" ? "Sending" : "Send enquiry"}
        </button>
        <p className="text-xs text-[#9ca3af] leading-relaxed max-w-xs">
          Goes straight to Zander. We do not add you to a mailing list.
        </p>
      </div>
    </form>
  );
}
