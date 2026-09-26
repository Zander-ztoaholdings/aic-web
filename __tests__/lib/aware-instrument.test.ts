import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getAwareInstrument, validateAnswers } from "@/lib/aware-instrument";
import { questions } from "@/app/data/questions";
import { normaliseBadgeCode, BADGE_CODE_RE } from "@/lib/aware-platform";

describe("the published AIC Aware instrument", () => {
  const inst = getAwareInstrument();

  it("carries every question in the bank, with a stable content version", () => {
    expect(inst.questions).toHaveLength(questions.length);
    expect(inst.version).toMatch(/^[0-9a-f]{12}$/);
    expect(getAwareInstrument().version).toBe(inst.version);
  });

  it("validates a complete answer set and flags gaps and junk", () => {
    const complete = Object.fromEntries(inst.questions.map((q) => [q.id, q.options[0].value]));
    expect(validateAnswers(complete, inst)).toEqual([]);
    const { [inst.questions[0].id]: _drop, ...missing } = complete;
    void _drop;
    expect(validateAnswers(missing, inst).length).toBeGreaterThan(0);
    expect(validateAnswers({ ...complete, [inst.questions[0].id]: 999 }, inst).length).toBeGreaterThan(0);
    expect(validateAnswers("nope", inst).length).toBeGreaterThan(0);
  });
});

describe("badge codes as the website reads them", () => {
  it("normalises typed codes and rejects company slugs", () => {
    expect(normaliseBadgeCode("awr-ab1o-il23")).toBe("AWR-AB10-1123");
    expect(normaliseBadgeCode("acme-corp")).toBeNull();
    expect("AWR-7K2M-9XQ4").toMatch(BADGE_CODE_RE);
  });
});
