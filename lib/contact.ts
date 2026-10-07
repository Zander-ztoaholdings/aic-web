/**
 * The addresses the site publishes, in one place.
 *
 * Set NEXT_PUBLIC_CONTACT_EMAIL (and, if different, NEXT_PUBLIC_PARTNERS_EMAIL)
 * to switch every published address at once, for example to
 * info@aiccertified.cloud. Do that only once mail to the new address is
 * actually delivered: as of October 2026 aiccertified.cloud has no MX record,
 * so anything sent to an @aiccertified.cloud address bounces.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "zander@ztoaholdings.com";
export const GENERAL_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "albert@ztoaholdings.com";
export const PARTNERS_EMAIL = process.env.NEXT_PUBLIC_PARTNERS_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "zander@ztoaholdings.com";
