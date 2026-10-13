/**
 * Artwork from the AIC seal: seven arcs, one per certification stage, drawn
 * as open outlines. Decoration only, so no arc is filled: on the platform a
 * filled arc means a stage reached, and the site never implies one.
 */
export default function SealArt({ className = "" }: { className?: string }) {
  const arcs = Array.from({ length: 7 }, (_, i) => 60 + i * 26);
  return (
    <svg viewBox="0 0 440 440" className={className} aria-hidden="true" focusable="false">
      {arcs.map((r, i) => (
        <circle
          key={r}
          cx="220"
          cy="220"
          r={r}
          fill="none"
          stroke={i === 6 ? "#c9920a" : "#a8772a"}
          strokeOpacity={0.18 + i * 0.07}
          strokeWidth={i === 6 ? 2 : 1.25}
          strokeLinecap="round"
          strokeDasharray={`${(2 * Math.PI * r * (0.52 + i * 0.05)).toFixed(1)} ${(2 * Math.PI * r).toFixed(1)}`}
          transform={`rotate(${-90 + i * 9} 220 220)`}
        />
      ))}
    </svg>
  );
}
