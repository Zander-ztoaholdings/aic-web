import { describe, it, expect } from 'vitest';
import { analyseAware, indicateDivision } from '@/lib/aware-analysis';
import { questions } from '@/app/data/questions';
import { requirements, requirementsForDivision } from '@/app/data/requirements-data';

const codes = new Set(requirements.map((r) => r.code));

/** Answer every question with the given value. */
function uniform(value: number): Record<string, number> {
  return Object.fromEntries(questions.map((q) => [q.id, value]));
}

describe('question bank integrity', () => {
  it('every requirement code cited by a question exists in the published standard', () => {
    const bad: string[] = [];
    for (const q of questions) {
      for (const code of q.requirements ?? []) {
        if (!codes.has(code)) bad.push(`${q.id} -> ${code}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('every question carries a rationale', () => {
    const missing = questions.filter((q) => !q.rationale?.trim()).map((q) => q.id);
    expect(missing).toEqual([]);
  });

  it('USAGE questions are not used to raise findings', () => {
    // The Division-setting questions must never produce gaps: a high-risk
    // profile is a fact about the organisation, not a failing.
    const usageIds = new Set(questions.filter((q) => q.category === 'USAGE').map((q) => q.id));
    const answers = uniform(4);
    for (const id of usageIds) answers[id] = 0;
    const before = analyseAware(uniform(4)).gaps.length;
    const after = analyseAware(answers).gaps.length;
    // Zeroing only USAGE answers may change the Division (and so the
    // applicable set), but must not itself introduce findings from those
    // questions — every gap raised must trace to a control question.
    const controlTexts = new Set(
      questions.filter((q) => q.category !== 'USAGE').map((q) => q.text)
    );
    for (const gap of analyseAware(answers).gaps) {
      for (const t of gap.triggeredBy) expect(controlTexts.has(t)).toBe(true);
    }
    expect(typeof before).toBe('number');
    expect(typeof after).toBe('number');
  });
});

describe('indicateDivision', () => {
  it('routes builders to Division 5 regardless of internal use', () => {
    const answers = { ...uniform(4), q21: 1 };
    expect(indicateDivision(answers).division).toBe(5);
    expect(indicateDivision(answers).caveat).toBeTruthy();
  });

  it('routes organisations with no AI systems to Division 1', () => {
    const answers = { ...uniform(4), q1: 0 };
    expect(indicateDivision(answers).division).toBe(1);
  });

  it('routes human-decides-every-case to Division 2', () => {
    const answers = { ...uniform(4), q1: 3, q2: 2 };
    expect(indicateDivision(answers).division).toBe(2);
  });

  it('separates Division 3 from 4 on whether a case-level review process exists', () => {
    const reviewed = { ...uniform(4), q1: 3, q2: 0, q6: 3 };
    const monitored = { ...uniform(4), q1: 3, q2: 0, q6: 0 };
    expect(indicateDivision(reviewed).division).toBe(3);
    expect(indicateDivision(monitored).division).toBe(4);
  });

  it('always returns a real Division with a name and rationale', () => {
    for (const v of [0, 1, 2, 3, 4]) {
      const ind = indicateDivision(uniform(v));
      expect([1, 2, 3, 4, 5]).toContain(ind.division);
      expect(ind.name).toBeTruthy();
      expect(ind.rationale.length).toBeGreaterThan(20);
    }
  });
});

describe('analyseAware', () => {
  it('raises no gaps when every control answer is full marks', () => {
    expect(analyseAware(uniform(4)).gaps).toEqual([]);
  });

  it('raises gaps when control answers are weak', () => {
    const result = analyseAware(uniform(0));
    expect(result.gaps.length).toBeGreaterThan(0);
  });

  it('only ever raises requirements that apply to the indicated Division', () => {
    const result = analyseAware(uniform(0));
    const applicable = new Set(
      requirementsForDivision(result.indication.division).map((r) => r.code)
    );
    for (const gap of result.gaps) expect(applicable.has(gap.requirement.code)).toBe(true);
  });

  it('never reports a requirement as both a gap and consistent', () => {
    for (const v of [0, 1, 2, 3, 4]) {
      const result = analyseAware(uniform(v));
      const gapCodes = new Set(result.gaps.map((g) => g.requirement.code));
      for (const c of result.consistent) expect(gapCodes.has(c.requirement.code)).toBe(false);
    }
  });

  it('counts gaps by right consistently with the gap list', () => {
    const result = analyseAware(uniform(0));
    const total = Object.values(result.gapsByRight).reduce((a, b) => a + b, 0);
    expect(total).toBe(result.gaps.length);
  });

  it('surfaces flagship requirements as a subset of the gaps', () => {
    const result = analyseAware(uniform(0));
    for (const f of result.flagshipGaps) {
      expect(f.requirement.flagship).toBe(true);
      expect(result.gaps).toContainEqual(f);
    }
  });

  it('reports the applicable requirement count for the indicated Division', () => {
    const result = analyseAware(uniform(0));
    expect(result.applicableCount).toBe(
      requirementsForDivision(result.indication.division).length
    );
    expect(result.applicableCount).toBeGreaterThan(0);
  });
});
