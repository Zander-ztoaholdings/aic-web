import { LOGOS, LOCAL_LOGOS } from "@/app/data/integration-logos";

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/**
 * A vendor's mark on a white tile: the Simple Icons path where there is one,
 * an official file from public/logos where one has been added, otherwise the
 * vendor's initials. Decorative: the vendor's name is always shown beside it.
 */
export default function IntegrationLogo({ name, size = 44 }: { name: string; size?: number }) {
  const mark = LOGOS[name];
  const file = LOCAL_LOGOS[name];
  const box = { width: size, height: size };
  if (mark) {
    return (
      <span aria-hidden="true" style={box} className="grid shrink-0 place-items-center rounded-lg border border-[#e6eaef] bg-white">
        <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill={mark.hex} role="img" aria-hidden="true">
          <path d={mark.path} />
        </svg>
      </span>
    );
  }
  if (file) {
    return (
      <span aria-hidden="true" style={box} className="grid shrink-0 place-items-center rounded-lg border border-[#e6eaef] bg-white p-1.5">
        <img src={`/logos/${file}`} alt="" className="max-h-full max-w-full object-contain" />
      </span>
    );
  }
  return (
    <span aria-hidden="true" style={box} className="grid shrink-0 place-items-center rounded-lg bg-[#0e1b2c] text-[14px] font-bold tracking-wide text-white">
      {initials(name)}
    </span>
  );
}
