/**
 * The line every verify and register result carries when it shows a
 * certificate.
 *
 * October 2026 review: a reader checking a certificate is exactly the person
 * who might assume an accredited scheme behind it. AIC is not accredited, and
 * the place a certificate is checked is where that has to be plain. Kept out
 * of lib/registry.ts because that module is server-only and the register's
 * client component needs the same words.
 */
export const ACCREDITATION_NOTICE =
  "AIC is not accredited. This is a certificate under AIC's own published standard.";
