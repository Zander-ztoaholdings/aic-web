import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Constant-time check of a presented token against an expected secret.
 * Both sides are hashed first so the comparison length never depends on the
 * secret. Returns false whenever the expected secret is unset or empty.
 */
export function tokenMatches(presented: string | null | undefined, expected: string | undefined): boolean {
  if (!expected || !presented) return false;
  const a = createHash("sha256").update(presented).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
