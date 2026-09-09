#!/usr/bin/env node
/**
 * Generates app/data/country-shapes.ts — one simplified silhouette per mapped
 * jurisdiction, as an SVG path in a 512x512 box.
 *
 * These exist so a country can travel from the map to its own page as a single
 * continuous object. The map's own paths cannot do that job: they are
 * geoNaturalEarth1, fitted to the whole world, so an isolated country carries
 * the projection's global shear and sits wherever the world put it. A
 * silhouette needs its own frame.
 *
 * Run: node scripts/build-country-shapes.mjs
 * Requires network (Natural Earth via jsDelivr). Re-run only when the
 * jurisdiction list changes; the output is committed.
 */
import fs from "node:fs";
import path from "node:path";
import * as topojson from "topojson-client";
import * as d3 from "d3-geo";

const SRC = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json";
const TOL = 1.4;   // px of allowed deviation in the 512 box
const CAP = 480;   // per-country vertex ceiling
const BOX = 512;

// ISO 3166-1 numeric, matching the keys in app/data/regulatory-data.ts.
const IDS = ["840","124","484","076","250","276","380","724","528","616","372","826","756","578","710","404","566","646","784","682","376","156","392","410","702","356","036","554"];

const topo = await fetch(SRC).then((r) => {
  if (!r.ok) throw new Error(`${SRC} -> HTTP ${r.status}`);
  return r.json();
});
const geo = topojson.feature(topo, topo.objects.countries);

// Natural Earth ships more than one feature for some ids — 036 is both
// Australia and Ashmore and Cartier Is., an uninhabited sandbar. Pick the
// larger by TRUE spherical area. Comparing projected area after fitSize is
// meaningless: fitSize normalises every feature into the same box, so they all
// come out roughly equal and the sandbar can win.
const best = {};
for (const f of geo.features) {
  const id = String(f.id ?? "");
  if (!IDS.includes(id)) continue;
  const a = d3.geoArea(f);
  if (!best[id] || a > best[id].a) best[id] = { f, a };
}

function rdpOpen(pts, eps) {
  if (pts.length < 3) return pts;
  let dmax = 0, idx = 0;
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
    if (d > dmax) { dmax = d; idx = i; }
  }
  if (dmax <= eps) return [pts[0], pts[pts.length - 1]];
  return [...rdpOpen(pts.slice(0, idx + 1), eps).slice(0, -1), ...rdpOpen(pts.slice(idx), eps)];
}

/**
 * A ring cannot be simplified as one open polyline: its two ends are adjacent
 * coastline, so the baseline RDP measures against is a hair's width and runs
 * straight through the country. Every vertex then reads as "close to the line"
 * and Australia comes out a quadrilateral. Split at the farthest vertex first
 * and simplify the two arcs independently.
 */
function rdpRing(pts, eps) {
  if (pts.length < 5) return pts;
  const [ax, ay] = pts[0];
  let far = 0, fd = -1;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - ax, pts[i][1] - ay);
    if (d > fd) { fd = d; far = i; }
  }
  return [...rdpOpen(pts.slice(0, far + 1), eps).slice(0, -1), ...rdpOpen(pts.slice(far), eps)];
}

const bboxOf = (cc) => { const b = d3.geoBounds({ type: "Polygon", coordinates: cc }); return [b[0][0], b[0][1], b[1][0], b[1][1]]; };
const unite = (a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
const boxArea = (b) => Math.max(b[2] - b[0], 0.05) * Math.max(b[3] - b[1], 0.05);

/**
 * Which landmasses belong in a national silhouette?
 *
 * Distance from the mainland is the wrong test. It keeps Svalbard, only a few
 * degrees beyond an already-elongated Norway, and Alaska, whose gap to the
 * lower 48 is small next to the width of the country it belongs to — while a
 * strict version of the same test throws away New Zealand's North Island.
 *
 * The actual harm a far-flung territory does is that it forces the projection
 * to span an area nobody is looking at, shrinking the part that matters to a
 * speck. So test for exactly that, and let land area buy an exemption: Alaska
 * grows the US frame by 228% and is 21% of the land, so it goes; New Zealand's
 * North Island grows the frame just as much but at 75% of the South Island it
 * IS the country, so it stays.
 */
function keepLandmasses(scored) {
  const sorted = [...scored].sort((x, y) => y.a - x.a);
  const maxA = sorted[0].a;
  const kept = [sorted[0]];
  let box = bboxOf(sorted[0].c), area = sorted[0].a;
  for (const s of sorted.slice(1)) {
    if (s.a < maxA * 0.003) continue;                 // below the ink threshold at this size
    const nb = unite(box, bboxOf(s.c));
    const growth = boxArea(nb) / boxArea(box) - 1;
    if (growth > 0.30 && s.a / area < 0.35) continue;  // expands the frame, isn't the country
    kept.push(s); box = nb; area += s.a;
  }
  return kept;
}

const r = (n) => Math.round(n * 10) / 10;

function build(kept, proj, tol) {
  let d = "";
  for (const { c } of kept) {
    for (const ring of c) {
      const open = ring.slice(0, -1).map((p) => proj(p)).filter((p) => p && isFinite(p[0]) && isFinite(p[1]));
      if (open.length < 4) continue;
      const s = rdpRing(open, tol);
      if (s.length < 4) continue;
      d += "M" + s.map((p) => r(p[0]) + " " + r(p[1])).join("L") + "Z";
    }
  }
  return d;
}

const out = {};
const bounds = {};
const report = [];
for (const id of IDS) {
  if (!best[id]) { console.warn("MISSING", id); continue; }
  const f = best[id].f;
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  const scored = polys.map((c) => ({ c, a: Math.abs(d3.geoArea({ type: "Polygon", coordinates: c })) }));
  const kept = keepLandmasses(scored);
  // Fit to the TRIMMED geometry. Fitting to the whole feature lets the
  // territories we just dropped set the frame anyway.
  const trimmed = { type: "Feature", properties: {}, geometry: { type: "MultiPolygon", coordinates: kept.map((s) => s.c) } };
  const proj = d3.geoMercator().fitSize([BOX, BOX], trimmed);

  // A single global tolerance is the wrong unit of cost. Canada's arctic
  // archipelago and Norway's fjords are genuinely more crenellated than
  // anything else here, so a tolerance tuned to keep Poland honest leaves them
  // at 1662 and 1033 vertices — a quarter of the whole payload for two shapes
  // nobody reads more closely than the rest. Ease off until they cost what
  // everyone else costs. A silhouette is an identifier, not a basemap.
  let tol = TOL, d = build(kept, proj, tol), guard = 0;
  while ((d.match(/L/g) || []).length > CAP && guard++ < 12) { tol *= 1.35; d = build(kept, proj, tol); }
  if (!d) { console.warn("EMPTY", id); continue; }
  out[id] = d;

  // The tight box the shape actually occupies. fitSize centres each country
  // inside a square, which means a wide country like the United States uses a
  // band across the middle and leaves a third of the height empty above and
  // below. Rendered into a square slot on the page that reads as the US being
  // drawn small. Emitting real bounds lets the page give each country a slot
  // shaped like the country.
  const nums = d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    if (nums[i] < x0) x0 = nums[i];
    if (nums[i] > x1) x1 = nums[i];
    if (nums[i + 1] < y0) y0 = nums[i + 1];
    if (nums[i + 1] > y1) y1 = nums[i + 1];
  }
  const pad = 2; // room for the stroke, which is drawn centred on the edge
  bounds[id] = [
    r(x0 - pad), r(y0 - pad), r(x1 - x0 + pad * 2), r(y1 - y0 + pad * 2),
  ];
  report.push([id, kept.length, (d.match(/L/g) || []).length, tol.toFixed(2)]);
}

const header = `// GENERATED FILE — do not edit by hand.
// Regenerate with: node scripts/build-country-shapes.mjs
//
// One silhouette per mapped jurisdiction, as an SVG path in a ${BOX}x${BOX} box,
// Mercator-projected and fitted per country. Source: Natural Earth 1:10m via
// world-atlas. Keys are ISO 3166-1 numeric, matching regulatory-data.ts.
//
// Simplified to ~${TOL}px of deviation, capped at ${CAP} vertices per country. These
// are identifiers, not basemaps: do not use them to make any claim about a
// border. Where Natural Earth draws a disputed or near-zero-width boundary,
// this reproduces it faithfully rather than tidying it — South Africa's
// Kgalagadi strip really does come through as a needle.

export const COUNTRY_SHAPES: Record<string, string> = ${JSON.stringify(out, null, 0).replace(/","/g, '",\n  "').replace(/^\{"/, '{\n  "').replace(/"\}$/, '",\n}')};

/**
 * Tight [x, y, width, height] of each shape inside the ${BOX}-box above — use it
 * as the SVG viewBox, and size the slot to width/height so the country is
 * drawn as large as its own proportions allow.
 */
export const COUNTRY_BOUNDS: Record<string, [number, number, number, number]> = ${JSON.stringify(bounds, null, 0).replace(/\],"/g, "],\n  \"").replace(/^\{"/, '{\n  "').replace(/\]\}$/, "],\n}")};
`;

const dest = path.join(process.cwd(), "app/data/country-shapes.ts");
fs.writeFileSync(dest, header);
const bytes = Object.values(out).reduce((n, d) => n + d.length, 0);
console.log(`wrote ${dest}`);
console.log(`${Object.keys(out).length} countries, ${(bytes / 1024).toFixed(1)}KB of path data`);
console.log("id   kept verts   tol");
for (const x of report) console.log(String(x[0]).padEnd(5), String(x[1]).padStart(4), String(x[2]).padStart(5), String(x[3]).padStart(6));
