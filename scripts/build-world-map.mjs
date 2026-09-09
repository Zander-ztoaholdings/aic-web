#!/usr/bin/env node
/**
 * Generates public/data/world-map.json — the world, already projected.
 *
 * The map used to fetch countries-50m.json (756KB, 236KB gzipped), then load
 * topojson-client and d3-geo in the browser, decode the topology, fit a
 * projection and generate 240-odd path strings, all after hydration. On a cold
 * cache that is most of a second of network followed by a chunk of main-thread
 * work before anything appears, and the reader is looking at "Loading map…"
 * for all of it.
 *
 * None of that work depends on anything only the browser knows. The projection
 * is fixed, the geometry is fixed, so it belongs at build time. What ships is
 * the finished path strings.
 *
 * Dropping the topojson decode also drops both libraries from the client
 * bundle, which is the larger half of the saving.
 *
 * Run: node scripts/build-world-map.mjs
 */
import fs from "node:fs";
import * as topojson from "topojson-client";
import * as d3 from "d3-geo";

const W = 960, H = 520;
// At world scale one unit is a little over one screen pixel, so this is
// sub-pixel there. It is deliberately finer than that needs: these same paths
// draw the countries AROUND whichever one the camera has zoomed into, and that
// can reach 160x for a city-state.
const TOL = 0.2;

const topo = JSON.parse(fs.readFileSync("data/countries-50m.json", "utf8"));
const geo = topojson.feature(topo, topo.objects.countries);
const proj = d3.geoNaturalEarth1().fitSize([W, H], geo);
const path = d3.geoPath(proj);

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

/** Split at the farthest vertex first — see build-country-detail.mjs. */
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

const r = (n) => Math.round(n * 10) / 10;

/**
 * The rings d3 actually draws, rather than each coordinate projected by hand.
 *
 * Projecting point by point skips the projection stream, and the stream is
 * what performs antimeridian cutting. A polygon crossing 180 degrees then
 * comes back as a single ring whose last vertex is at the far right of the map
 * and whose next is at the far left — which draws as a band straight across
 * the world. Russia did exactly that, three times over, and so did Fiji.
 *
 * Feeding geoPath a context collects the same coordinates it would have drawn,
 * already clipped and already cut into separate rings, which can then be
 * simplified like any other.
 */
function ringsOf(feature, projection) {
  const rings = [];
  let cur = null;
  const ctx = {
    beginPath() { cur = null; },
    moveTo(x, y) { cur = [[x, y]]; },
    lineTo(x, y) { if (cur) cur.push([x, y]); },
    closePath() { if (cur && cur.length > 2) rings.push(cur); cur = null; },
    arc() {},
  };
  d3.geoPath(projection, ctx)(feature);
  if (cur && cur.length > 2) rings.push(cur);
  return rings;
}

/**
 * Natural Earth ships two features for some ids — 036 is both Australia and
 * Ashmore and Cartier Is., an uninhabited sandbar. The map used to resolve this
 * in the browser by comparing projected areas; doing it here means the browser
 * never sees the collision, and cannot render hover or selection against the
 * wrong geometry.
 */
const best = new Map();
for (const f of geo.features) {
  const id = String(f.id ?? "");
  if (!id) continue;
  const a = d3.geoArea(f);
  const prev = best.get(id);
  if (!prev || a > prev.a) best.set(id, { f, a });
}

const countries = [];
let raw = 0;
for (const [id, { f }] of best) {
  const g = f.geometry;
  if (!g) continue;
  let d = "";
  for (const ring of ringsOf(f, proj)) {
    const s = rdpRing(ring, TOL);
    if (s.length < 4) continue;
    d += "M" + s.map((p) => r(p[0]) + " " + r(p[1])).join("L") + "Z";
  }
  if (!d) continue;
  raw += (path(f) ?? "").length;
  countries.push({ i: id, n: f.properties?.name ?? "Unknown", d });
}

countries.sort((a, b) => a.i.localeCompare(b.i));
const out = { w: W, h: H, countries };
fs.writeFileSync("public/data/world-map.json", JSON.stringify(out));
const size = fs.statSync("public/data/world-map.json").size;
console.log(`${countries.length} countries`);
console.log(`unsimplified paths would be ${(raw / 1024).toFixed(0)}KB; wrote ${(size / 1024).toFixed(0)}KB at tolerance ${TOL}`);
