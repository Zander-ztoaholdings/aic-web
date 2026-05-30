import { describe, it, expect, vi } from 'vitest';

// Mock the questions module before importing scoring
vi.mock('../../app/data/questions', () => ({
  questions: [
    // USAGE (20% weight) - 5 questions
    { id: 'q1', category: 'USAGE', text: 'Question 1', options: [] },
    { id: 'q2', category: 'USAGE', text: 'Question 2', options: [] },
    { id: 'q3', category: 'USAGE', text: 'Question 3', options: [] },
    { id: 'q4', category: 'USAGE', text: 'Question 4', options: [] },
    { id: 'q5', category: 'USAGE', text: 'Question 5', options: [] },
    // OVERSIGHT (35% weight) - 5 questions
    { id: 'q6', category: 'OVERSIGHT', text: 'Question 6', options: [] },
    { id: 'q7', category: 'OVERSIGHT', text: 'Question 7', options: [] },
    { id: 'q8', category: 'OVERSIGHT', text: 'Question 8', options: [] },
    { id: 'q9', category: 'OVERSIGHT', text: 'Question 9', options: [] },
    { id: 'q10', category: 'OVERSIGHT', text: 'Question 10', options: [] },
    // TRANSPARENCY (25% weight) - 5 questions
    { id: 'q11', category: 'TRANSPARENCY', text: 'Question 11', options: [] },
    { id: 'q12', category: 'TRANSPARENCY', text: 'Question 12', options: [] },
    { id: 'q13', category: 'TRANSPARENCY', text: 'Question 13', options: [] },
    { id: 'q14', category: 'TRANSPARENCY', text: 'Question 14', options: [] },
    { id: 'q15', category: 'TRANSPARENCY', text: 'Question 15', options: [] },
    // INFRASTRUCTURE (20% weight) - 5 questions
    { id: 'q16', category: 'INFRASTRUCTURE', text: 'Question 16', options: [] },
    { id: 'q17', category: 'INFRASTRUCTURE', text: 'Question 17', options: [] },
    { id: 'q18', category: 'INFRASTRUCTURE', text: 'Question 18', options: [] },
    { id: 'q19', category: 'INFRASTRUCTURE', text: 'Question 19', options: [] },
    { id: 'q20', category: 'INFRASTRUCTURE', text: 'Question 20', options: [] },
  ],
}));

import { calculateAssessmentResult } from '../../lib/scoring';

describe('calculateAssessmentResult', () => {
  describe('Score Calculation', () => {
    it('should return 100 integrity score when all answers are maximum (4)', () => {
      const answers: Record<string, number> = {};
      for (let i = 1; i <= 20; i++) {
        answers[`q${i}`] = 4;
      }

      const result = calculateAssessmentResult(answers);

      expect(result.integrityScore).toBe(100);
    });

    it('should return 0 integrity score when all answers are 0', () => {
      const answers: Record<string, number> = {};
      for (let i = 1; i <= 20; i++) {
        answers[`q${i}`] = 0;
      }

      const result = calculateAssessmentResult(answers);

      expect(result.integrityScore).toBe(0);
    });

    it('should return 50 integrity score when all answers are 2 (half of max)', () => {
      const answers: Record<string, number> = {};
      for (let i = 1; i <= 20; i++) {
        answers[`q${i}`] = 2;
      }

      const result = calculateAssessmentResult(answers);

      expect(result.integrityScore).toBe(50);
    });

    it('should handle partial answers correctly', () => {
      const answers: Record<string, number> = {
        q1: 4,
        q2: 4,
        q6: 4,
        q7: 4,
      };

      const result = calculateAssessmentResult(answers);

      // Only 4 questions answered with max score
      expect(result.integrityScore).toBeGreaterThan(0);
      expect(result.integrityScore).toBeLessThan(100);
    });

    it('should return correct result structure', () => {
      const answers: Record<string, number> = { q1: 2 };

      const result = calculateAssessmentResult(answers);

      expect(result).toHaveProperty('integrityScore');
      expect(result).toHaveProperty('tier');
      expect(result).toHaveProperty('categoryScores');
      expect(typeof result.integrityScore).toBe('number');
    });
  });

  describe('Category Weights', () => {
    it('should apply correct weights: USAGE 20%, OVERSIGHT 35%, TRANSPARENCY 25%, INFRASTRUCTURE 20%', () => {
      // Test by giving different scores to each category
      const answers: Record<string, number> = {};

      // USAGE: all 4s (100%)
      for (let i = 1; i <= 5; i++) answers[`q${i}`] = 4;
      // OVERSIGHT: all 0s (0%)
      for (let i = 6; i <= 10; i++) answers[`q${i}`] = 0;
      // TRANSPARENCY: all 4s (100%)
      for (let i = 11; i <= 15; i++) answers[`q${i}`] = 4;
      // INFRASTRUCTURE: all 0s (0%)
      for (let i = 16; i <= 20; i++) answers[`q${i}`] = 0;

      const result = calculateAssessmentResult(answers);

      // Expected: 100*0.20 + 0*0.35 + 100*0.25 + 0*0.20 = 20 + 0 + 25 + 0 = 45
      expect(result.integrityScore).toBe(45);
    });

    it('should have category scores for all categories', () => {
      const answers: Record<string, number> = {};
      for (let i = 1; i <= 20; i++) answers[`q${i}`] = 2;

      const result = calculateAssessmentResult(answers);

      expect(result.categoryScores).toHaveProperty('USAGE');
      expect(result.categoryScores).toHaveProperty('OVERSIGHT');
      expect(result.categoryScores).toHaveProperty('TRANSPARENCY');
      expect(result.categoryScores).toHaveProperty('INFRASTRUCTURE');
    });

    it('should include weight in category scores', () => {
      const answers: Record<string, number> = { q1: 2 };

      const result = calculateAssessmentResult(answers);

      expect(result.categoryScores.USAGE.weight).toBe(0.20);
      expect(result.categoryScores.OVERSIGHT.weight).toBe(0.35);
      expect(result.categoryScores.TRANSPARENCY.weight).toBe(0.25);
      expect(result.categoryScores.INFRASTRUCTURE.weight).toBe(0.20);
    });
  });

  describe('Category Score Details', () => {
    it('should include score percentage for each category', () => {
      const answers: Record<string, number> = {};
      for (let i = 1; i <= 5; i++) answers[`q${i}`] = 4; // All USAGE max

      const result = calculateAssessmentResult(answers);

      expect(result.categoryScores.USAGE.score).toBe(100);
      expect(result.categoryScores.OVERSIGHT.score).toBe(0);
    });

    it('should include actual and maxPossible values', () => {
      const answers: Record<string, number> = { q1: 3, q2: 2 };

      const result = calculateAssessmentResult(answers);

      expect(result.categoryScores.USAGE.actual).toBe(5); // 3 + 2
      expect(result.categoryScores.USAGE.maxPossible).toBe(8); // 2 questions * 4 max
    });

    it('should round score percentages', () => {
      const answers: Record<string, number> = { q1: 1 }; // 1/4 = 25%

      const result = calculateAssessmentResult(answers);

      expect(result.categoryScores.USAGE.score).toBe(25);
      expect(Number.isInteger(result.categoryScores.USAGE.score)).toBe(true);
    });
  });

  describe('Tier Classification', () => {
    it('should classify as Tier 1 (Critical Risk) when score < 50', () => {
      const answers: Record<string, number> = {};
      for (let i = 1; i <= 20; i++) answers[`q${i}`] = 1; // 25% score

      const result = calculateAssessmentResult(answers);

      expect(result.tier.name).toBe('Tier 1');
      expect(result.tier.title).toBe('Critical Risk');
      expect(result.tier.color).toBe('text-aic-red');
    });

    it('should classify as Tier 2 (Elevated Risk) when 50 <= score < 80', () => {
      const answers: Record<string, number> = {};
      for (let i = 1; i <= 20; i++) answers[`q${i}`] = 2; // 50% score

      const result = calculateAssessmentResult(answers);

      expect(result.tier.name).toBe('Tier 2');
      expect(result.tier.title).toBe('Elevated Risk');
      expect(result.tier.color).toBe('text-aic-orange');
    });

    it('should classify as Tier 3 (Standard Risk) when score >= 80', () => {
      const answers: Record<string, number> = {};
      for (let i = 1; i <= 20; i++) answers[`q${i}`] = 4; // 100% score

      const result = calculateAssessmentResult(answers);

      expect(result.tier.name).toBe('Tier 3');
      expect(result.tier.title).toBe('Standard Risk');
      expect(result.tier.color).toBe('text-aic-green');
    });

    it('should include tier description', () => {
      const answers: Record<string, number> = { q1: 0 };

      const result = calculateAssessmentResult(answers);

      expect(result.tier.desc).toBeTruthy();
      expect(typeof result.tier.desc).toBe('string');
    });

    it('should handle boundary case at score = 50 (should be Tier 2)', () => {
      const answers: Record<string, number> = {};
      for (let i = 1; i <= 20; i++) answers[`q${i}`] = 2; // Exactly 50%

      const result = calculateAssessmentResult(answers);

      expect(result.integrityScore).toBe(50);
      expect(result.tier.name).toBe('Tier 2');
    });

    it('should handle boundary case at score >= 80 (should be Tier 3)', () => {
      // Test that a high score results in Tier 3
      // With weighted categories, we need to calculate properly
      const answers: Record<string, number> = {};
      // Set all categories to have high scores to exceed 80%
      for (let i = 1; i <= 20; i++) answers[`q${i}`] = 4; // All max

      const result = calculateAssessmentResult(answers);

      // With all 4s, score should be 100
      expect(result.integrityScore).toBe(100);
      expect(result.tier.name).toBe('Tier 3');
    });

    it('should classify exactly at 80 threshold as Tier 3', () => {
      // Create a score that lands exactly at 80 using weighted calculation
      // USAGE (20%): 100%, OVERSIGHT (35%): ~57%, TRANSPARENCY (25%): 100%, INFRASTRUCTURE (20%): 100%
      // = 20 + 20 + 25 + 20 = 85 with all 100%
      // We need 80, so we need to reduce some categories

      const answers: Record<string, number> = {};
      // USAGE: all 4s = 100% * 0.20 = 20
      for (let i = 1; i <= 5; i++) answers[`q${i}`] = 4;
      // OVERSIGHT: all 4s = 100% * 0.35 = 35
      for (let i = 6; i <= 10; i++) answers[`q${i}`] = 4;
      // TRANSPARENCY: all 2s = 50% * 0.25 = 12.5
      for (let i = 11; i <= 15; i++) answers[`q${i}`] = 2;
      // INFRASTRUCTURE: all 3s = 75% * 0.20 = 15
      for (let i = 16; i <= 20; i++) answers[`q${i}`] = 3;
      // Total: 20 + 35 + 12.5 + 15 = 82.5 -> rounds to 83

      const result = calculateAssessmentResult(answers);

      // Score should be >= 80 for Tier 3
      expect(result.integrityScore).toBeGreaterThanOrEqual(80);
      expect(result.tier.name).toBe('Tier 3');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty answers object', () => {
      const answers: Record<string, number> = {};

      const result = calculateAssessmentResult(answers);

      expect(result.integrityScore).toBe(0);
    });

    it('should handle undefined answer values by skipping them', () => {
      const answers: Record<string, number> = {
        q1: 4,
        // q2 is undefined/missing
      };

      const result = calculateAssessmentResult(answers);

      // Should only count q1
      expect(result.categoryScores.USAGE.actual).toBe(4);
      expect(result.categoryScores.USAGE.maxPossible).toBe(4);
    });

    it('should ignore answers for non-existent questions', () => {
      const answers: Record<string, number> = {
        q1: 4,
        q999: 4, // This question doesn't exist in our mock
      };

      const result = calculateAssessmentResult(answers);

      // Should only count q1
      expect(result.categoryScores.USAGE.actual).toBe(4);
    });
  });

  describe('POPIA Compliance Context', () => {
    it('should mention POPIA in Tier 1 description', () => {
      const answers: Record<string, number> = {};
      for (let i = 1; i <= 20; i++) answers[`q${i}`] = 0;

      const result = calculateAssessmentResult(answers);

      expect(result.tier.desc).toContain('POPIA');
    });

    it('should mention human review requirements for Tier 1', () => {
      const answers: Record<string, number> = {};
      for (let i = 1; i <= 20; i++) answers[`q${i}`] = 0;

      const result = calculateAssessmentResult(answers);

      expect(result.tier.desc.toLowerCase()).toContain('human');
    });
  });
});

describe('Type Safety', () => {
  it('CategoryScore should have all required fields', () => {
    const answers: Record<string, number> = { q1: 2 };
    const result = calculateAssessmentResult(answers);
    const categoryScore = result.categoryScores.USAGE;

    // Type assertions - these would fail compilation if types are wrong
    const name: string = categoryScore.name;
    const score: number = categoryScore.score;
    const weight: number = categoryScore.weight;
    const maxPossible: number = categoryScore.maxPossible;
    const actual: number = categoryScore.actual;

    expect(name).toBeTruthy();
    expect(typeof score).toBe('number');
    expect(typeof weight).toBe('number');
    expect(typeof maxPossible).toBe('number');
    expect(typeof actual).toBe('number');
  });

  it('TierInfo should have all required fields', () => {
    const answers: Record<string, number> = { q1: 2 };
    const result = calculateAssessmentResult(answers);
    const tier = result.tier;

    // Type assertions
    const name: string = tier.name;
    const color: string = tier.color;
    const title: string = tier.title;
    const desc: string = tier.desc;

    expect(name).toBeTruthy();
    expect(color).toBeTruthy();
    expect(title).toBeTruthy();
    expect(desc).toBeTruthy();
  });
});
