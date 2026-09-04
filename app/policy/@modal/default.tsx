// Nothing renders in the modal slot unless an intercepting route fills it.
// Next.js needs this file for the slot to resolve on routes that do not match
// an interception — without it, a hard navigation to /policy 404s.
export default function Default() {
  return null;
}
