/**
 * A seal-style badge for a law or framework, drawn by AIC. It deliberately
 * uses no regulator's or standards body's own mark: ISO and public bodies
 * restrict use of their logos, and an official mark beside AIC's name would
 * suggest an endorsement or accreditation AIC does not hold.
 */
export default function RuleBadge({ id, top, bottom, ring }: { id: string; top: string; bottom: string; ring: string }) {
  const pathId = `rule-ring-${id}`;
  return (
    <svg viewBox="0 0 100 100" className="h-[76px] w-[76px] shrink-0" aria-hidden="true" focusable="false">
      <defs>
        <path id={pathId} d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
      </defs>
      <circle cx="50" cy="50" r="48" fill="#0e1b2c" />
      <circle cx="50" cy="50" r="31" fill="#ffffff" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="#a8772a" strokeWidth="1" />
      <text fontSize="9" fontWeight="600" letterSpacing="1" fill="#ffffff" fontFamily="'Public Sans', system-ui, sans-serif">
        <textPath href={`#${pathId}`} startOffset="25%" textAnchor="middle">{ring}</textPath>
      </text>
      <text x="50" y="49" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0e1b2c" fontFamily="'Public Sans', system-ui, sans-serif">{top}</text>
      <text x="50" y="62" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#8a6114" fontFamily="'Public Sans', system-ui, sans-serif">{bottom}</text>
    </svg>
  );
}
