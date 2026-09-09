#!/usr/bin/env node
/**
 * Generates app/data/country-frames.ts and app/data/country-detail.ts.
 *
 * The regulatory map draws the world from Natural Earth 1:50m, which is the
 * right trade at world scale and wrong at every other scale. Two things break
 * when the camera moves in:
 *
 *   Framing. The map frames a country from d3.geoPath.bounds() of the whole
 *   feature, so the United States is bounded by Alaska to the Aleutians and
 *   comes out 844 units wide of a 960-unit world. There is no zoom left to
 *   perform, and what you get is a smeared strip. Same for France (French
 *   Guiana), Norway (Svalbard), the Netherlands (the Caribbean).
 *
 *   Detail. At 1:50m Singapore is ONE PIXEL — its projected bounds are
 *   1.0 x 1.0 units. Israel, Rwanda and the UAE are barely better. Zooming
 *   into them shows a lozenge, which on a map about regulatory precision is
 *   the worst possible thing to show.
 *
 * So: trimmed framing bounds for all 28 mapped jurisdictions (tiny, imported
 * statically because the camera needs them the instant you click), and
 * high-detail outlines in the SAME world projection (larger, loaded on idle,
 * swapped in for the country being looked at).
 *
 * Run: node scripts/build-country-detail.mjs   (needs network)
 */
import fs from "node:fs";
import path from "node:path";
import * as topojson from "topojson-client";
import * as d3 from "d3-geo";

const DETAIL_SRC = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json";
const W = 960, H = 520;              // the map's viewBox, from RegulatoryMap
// These four MUST match frameFor() in app/components/RegulatoryMap.tsx. The
// tolerance each outline is simplified to is derived from the zoom it will be
// seen at, so a change here without a regenerate makes the detail wrong.
const STAGE_W = W * 0.74, STAGE_H = H * 0.84;
const MIN_SCALE = 1.8;
// High, because of city-states. Singapore is a single degree across: capped at
// 20x it occupied 2% of the canvas AND was simplified to a seven-sided lozenge,
// since the tolerance is derived from the cap. A country you cannot see is not
// a country you have mapped.
const MAX_SCALE = 200;

const IDS = ["840","124","484","076","250","276","380","724","528","616","372","826","756","578","710","404","566","646","784","682","376","156","392","410","702","356","036","554"];

// The projection has to be the one the map uses, or the detail outline lands
// somewhere other than the country it replaces. The map fits to the whole 50m
// collection, so fit to exactly that — then project 10m coordinates through it.
const world50 = JSON.parse(fs.readFileSync("data/countries-50m.json", "utf8"));
const geo50 = topojson.feature(world50, world50.objects.countries);
const proj = d3.geoNaturalEarth1().fitSize([W, H], geo50);

const topo10 = await fetch(DETAIL_SRC).then((r) => {
  if (!r.ok) throw new Error(`${DETAIL_SRC} -> HTTP ${r.status}`);
  return r.json();
});
const geo10 = topojson.feature(topo10, topo10.objects.countries);

// Natural Earth ships two features for id 036 (Australia and an uninhabited
// sandbar). Settle it on true spherical area, not projected area.
const best = {};
for (const f of geo10.features) {
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
 * A ring can't be simplified as one open polyline: its two ends are adjacent
 * coastline, so the baseline runs straight through the country, every vertex
 * reads as close to it, and Australia comes out a quadrilateral. Split at the
 * farthest vertex first and simplify the two arcs independently.
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
 * Which landmasses the camera should frame on.
 *
 * Distance from the mainland is the wrong test — it keeps Alaska, whose gap to
 * the lower 48 is small next to the width of the country it belongs to, and a
 * strict version of it throws away New Zealand's North Island. What actually
 * does the damage is a territory forcing the frame to span an area nobody is
 * looking at, so test for that, and let land area buy an exemption. Alaska
 * grows the US frame by 228% and is 21% of the land, so it is not framed on;
 * the North Island grows it as much but at 75% of the South Island it IS the
 * country.
 *
 * Note this decides FRAMING and what the detail outline draws. It does not
 * remove anything from the world map, which still draws every territory.
 */
function keepLandmasses(scored) {
  const sorted = [...scored].sort((x, y) => y.a - x.a);
  const maxA = sorted[0].a;
  const kept = [sorted[0]];
  let box = bboxOf(sorted[0].c), area = sorted[0].a;
  for (const s of sorted.slice(1)) {
    if (s.a < maxA * 0.003) continue;
    const nb = unite(box, bboxOf(s.c));
    if (boxArea(nb) / boxArea(box) - 1 > 0.30 && s.a / area < 0.35) continue;
    kept.push(s); box = nb; area += s.a;
  }
  return kept;
}

const r = (n) => Math.round(n * 100) / 100;

const frames = {}, detail = {}, report = [];
for (const id of IDS) {
  if (!best[id]) { console.warn("MISSING", id); continue; }
  const g = best[id].f.geometry;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  const scored = polys.map((c) => ({ c, a: Math.abs(d3.geoArea({ type: "Polygon", coordinates: c })) }));
  const kept = keepLandmasses(scored);

  // Project first, then decide tolerance from how far in the camera will go.
  const rings = [];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const { c } of kept) {
    for (const ring of c) {
      const pts = ring.slice(0, -1).map((p) => proj(p)).filter((p) => p && isFinite(p[0]) && isFinite(p[1]));
      if (pts.length < 4) continue;
      for (const p of pts) {
        if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
        if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
      }
      rings.push(pts);
    }
  }
  if (!rings.length) { console.warn("EMPTY", id); continue; }

  const bw = Math.max(x1 - x0, 1), bh = Math.max(y1 - y0, 1);
  const scale = Math.min(Math.max(Math.min(STAGE_W / bw, STAGE_H / bh), MIN_SCALE), MAX_SCALE);
  // Simplify to the precision this country will actually be SEEN at — about a
  // screen pixel once the camera has finished. A single global tolerance would
  // either shred Singapore at 20x or spend thousands of vertices on Canada.
  //
  // The cap is the second half of that. Precision-by-zoom alone still left
  // Canada at 2909 vertices, because its coastline is genuinely that
  // crenellated at 1:10m and no amount of it changes what anyone learns about
  // Canadian AI regulation. Ease off until it costs what the others cost.
  const build = (t) => {
    let out = "";
    for (const pts of rings) {
      const sp = rdpRing(pts, t);
      if (sp.length < 4) continue;
      out += "M" + sp.map((p) => r(p[0]) + " " + r(p[1])).join("L") + "Z";
    }
    return out;
  };
  let tol = 0.9 / scale;
  let d = build(tol), guard = 0;
  while ((d.match(/L/g) || []).length > 600 && guard++ < 12) { tol *= 1.4; d = build(tol); }
  frames[id] = [r(x0), r(y0), r(bw), r(bh)];
  detail[id] = d;
  report.push([id, kept.length + "/" + polys.length, scale.toFixed(1), tol.toFixed(3), (d.match(/L/g) || []).length]);
}

const head = (what) => `// GENERATED FILE — do not edit by hand.
// Regenerate with: node scripts/build-country-detail.mjs
//
// ${what}
// Source: Natural Earth 1:10m via world-atlas, projected with the SAME
// geoNaturalEarth1 fit the map uses (${W}x${H}, fitted to countries-50m.json).
// Keys are ISO 3166-1 numeric, matching regulatory-data.ts.
`;

fs.writeFileSync(
  path.join(process.cwd(), "app/data/country-frames.ts"),
  head("Framing bounds [x, y, width, height] per jurisdiction, computed on the\n// principal landmasses only — see keepLandmasses in the generator. Small\n// enough to import statically, which matters because the camera needs them\n// the moment a country is clicked.") +
  `\nexport const COUNTRY_FRAMES: Record<string, [number, number, number, number]> = ${JSON.stringify(frames, null, 0).replace(/\],"/g, '],\n  "').replace(/^\{"/, '{\n  "').replace(/\]\}$/, "],\n}")};\n`
);

fs.writeFileSync(
  path.join(process.cwd(), "app/data/country-detail.ts"),
  head("High-detail outlines, swapped in for the country the camera is looking\n// at. Loaded on idle rather than imported, because the world view never needs\n// them. Each is simplified to roughly half a screen pixel at the zoom that\n// country actually gets.") +
  `\nexport const COUNTRY_DETAIL: Record<string, string> = ${JSON.stringify(detail, null, 0).replace(/","/g, '",\n  "').replace(/^\{"/, '{\n  "').replace(/"\}$/, '",\n}')};\n`
);

const bytes = Object.values(detail).reduce((n, d) => n + d.length, 0);
console.log(`frames: 28 | detail: ${(bytes / 1024).toFixed(1)}KB`);
console.log("id   kept   scale    tol  verts");
for (const x of report) console.log(String(x[0]).padEnd(5), String(x[1]).padStart(6), String(x[2]).padStart(6), String(x[3]).padStart(6), String(x[4]).padStart(5));
