/**
 * Input validation utilities for API routes.
 * Used at system boundaries to sanitize and validate user input.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_SHORT_TEXT = 200;
const MAX_LONG_TEXT = 5000;

export function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length <= MAX_EMAIL_LENGTH && EMAIL_RE.test(email);
}

export function isNonEmptyString(value: unknown, maxLength = MAX_SHORT_TEXT): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

export function isValidLongText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= MAX_LONG_TEXT;
}

export function isValidTier(tier: unknown): tier is string {
  return typeof tier === 'string' && ['TIER_1', 'TIER_2', 'TIER_3'].includes(tier);
}

export function isValidScore(score: unknown): score is number {
  return typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= 100;
}

/**
 * Safely parse JSON from a Request body.
 * Returns null if the body is not valid JSON.
 */
export async function safeParseJSON(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    if (body && typeof body === 'object' && !Array.isArray(body)) {
      return body as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}
