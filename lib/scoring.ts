import { questions } from '../app/data/questions';

export interface CategoryScore {
    name: string;
    score: number;
    weight: number;
    maxPossible: number;
    actual: number;
}

export interface TierInfo {
    name: string;
    color: string;
    title: string;
    desc: string;
}

export interface AssessmentResult {
    integrityScore: number;
    tier: TierInfo;
    categoryScores: Record<string, CategoryScore>;
}

const CATEGORY_WEIGHTS: Record<string, number> = {
    USAGE: 0.20,
    OVERSIGHT: 0.35,
    TRANSPARENCY: 0.25,
    INFRASTRUCTURE: 0.20
};

export function calculateAssessmentResult(answers: Record<string, number>): AssessmentResult {
    const categoryResults: Record<string, { actual: number; max: number }> = {
        USAGE: { actual: 0, max: 0 },
        OVERSIGHT: { actual: 0, max: 0 },
        TRANSPARENCY: { actual: 0, max: 0 },
        INFRASTRUCTURE: { actual: 0, max: 0 }
    };

    // Calculate actual vs max for each category
    questions.forEach(q => {
        const answer = answers[q.id];
        if (answer !== undefined) {
            categoryResults[q.category].actual += answer;
            categoryResults[q.category].max += 4; // Each question max score is 4
        }
    });

    const categoryScores: Record<string, CategoryScore> = {};
    let totalWeightedScore = 0;

    Object.keys(CATEGORY_WEIGHTS).forEach(cat => {
        const { actual, max } = categoryResults[cat];
        const weight = CATEGORY_WEIGHTS[cat];
        const scorePercentage = max > 0 ? (actual / max) * 100 : 0;
        
        categoryScores[cat] = {
            name: cat,
            score: Math.round(scorePercentage),
            weight: weight,
            maxPossible: max,
            actual: actual
        };

        totalWeightedScore += scorePercentage * weight;
    });

    const integrityScore = Math.round(totalWeightedScore);

    let tier: TierInfo;
    if (integrityScore < 50) {
        tier = { 
            name: 'Tier 1', 
            color: 'text-aic-red', 
            title: 'Critical Risk', 
            desc: 'Your infrastructure does not match your risk profile. POPIA Section 71 mandates 100% human review for these systems.' 
        };
    } else if (integrityScore < 80) {
        tier = { 
            name: 'Tier 2', 
            color: 'text-aic-orange', 
            title: 'Elevated Risk', 
            desc: 'Good foundation, but gaps in transparency and oversight mechanisms. Human supervision with override capability is required.' 
        };
    } else {
        tier = { 
            name: 'Tier 3', 
            color: 'text-aic-green', 
            title: 'Standard Risk', 
            desc: 'You are likely compliant for low-stakes AI. Focus on clear disclosure and periodic monitoring.' 
        };
    }

    return {
        integrityScore,
        tier,
        categoryScores
    };
}
