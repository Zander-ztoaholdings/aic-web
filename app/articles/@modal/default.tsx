// Nothing rendered in the modal slot unless an intercepting route fills it.
// Next.js requires this file for the slot to resolve on routes that do not
// match an interception — without it, a hard navigation to /articles 404s.
export default function Default() {
  return null;
}
