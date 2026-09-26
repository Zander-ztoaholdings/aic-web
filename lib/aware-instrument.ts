// The AIC Aware instrument as the platform consumes it.
//
// AIC Aware badges are now issued only from a platform account (see
// app/aware/AwareResults.tsx). The platform runs the assessment itself, but it
// does not keep its own copy of the questions: this site owns the question
// bank and the scoring, exactly as it owns the published standard, and the
// platform fetches both. One question bank, one scorer — a badge can never be
// issued against a set of questions that differs from the one published here.
//
// `version` is a content hash, so it changes whenever a question, an option or
// a weight changes, and the platform pins it on every submitted assessment.

import { createHash } from "crypto";
import { questions, categoryMeta, type Category } from "@/app/data/questions";

export interface InstrumentOption {
  text: string;
  value: number;
}

export interface InstrumentQuestion {
  id: string;
  category: Category;
  text: string;
  rationale: string | null;
  requirements: string[];
  options: InstrumentOption[];
}

export interface AwareInstrument {
  version: string;
  questions: InstrumentQuestion[];
  categories: { key: Category; name: string; weight: number; purpose: string; rights: string[] }[];
}

function build(): AwareInstrument {
  const qs: InstrumentQuestion[] = questions.map((q) => ({
    id: q.id,
    category: q.category,
    text: q.text,
    rationale: q.rationale ?? null,
    requirements: q.requirements ?? [],
    // tierSignal is scoring internals; the platform never needs it.
    options: q.options.map((o) => ({ text: o.text, value: o.value })),
  }));
  const categories = categoryMeta.map((c) => ({
    key: c.key,
    name: c.name,
    weight: c.weight,
    purpose: c.purpose,
    rights: c.rights,
  }));
  const version = createHash("sha256")
    .update(JSON.stringify({ qs, categories, scoring: questions.map((q) => q.options.map((o) => o.tierSignal ?? null)) }))
    .digest("hex")
    .slice(0, 12);
  return { version, questions: qs, categories };
}

let cached: AwareInstrument | null = null;

export function getAwareInstrument(): AwareInstrument {
  if (!cached) cached = build();
  return cached;
}

/**
 * Every question answered, with a value one of its options actually has.
 * Returns the problems in plain words; an empty list means complete and valid.
 */
export function validateAnswers(answers: unknown, instrument: AwareInstrument = getAwareInstrument()): string[] {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) return ["Answers must be an object keyed by question id."];
  const a = answers as Record<string, unknown>;
  const problems: string[] = [];
  const known = new Set(instrument.questions.map((q) => q.id));
  for (const q of instrument.questions) {
    const v = a[q.id];
    if (v === undefined) {
      problems.push(`${q.id} is unanswered`);
    } else if (typeof v !== "number" || !q.options.some((o) => o.value === v)) {
      problems.push(`${q.id} has a value that is not one of its options`);
    }
  }
  for (const key of Object.keys(a)) {
    if (!known.has(key)) problems.push(`${key} is not a question in this instrument`);
  }
  return problems;
}
