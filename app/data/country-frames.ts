// GENERATED FILE — do not edit by hand.
// Regenerate with: node scripts/build-country-detail.mjs
//
// Framing bounds [x, y, width, height] per jurisdiction, computed on the
// principal landmasses only — see keepLandmasses in the generator. Small
// enough to import statically, which matters because the camera needs them
// the moment a country is clicked.
// Source: Natural Earth 1:10m via world-atlas, projected with the SAME
// geoNaturalEarth1 fit the map uses (960x520, fitted to countries-50m.json).
// Keys are ISO 3166-1 numeric, matching regulatory-data.ts.

export const COUNTRY_FRAMES: Record<string, [number, number, number, number]> = {
  "124":[169.04,12.15,203.04,113.36],
  "156":[663.8,89.25,139.71,110.01],
  "250":[468.58,96.66,35,29.8],
  "276":[493.75,85.29,21.51,22.95],
  "356":[659.12,144.81,73.98,86.04],
  "372":[455.54,83.88,10.54,11.7],
  "376":[568.17,151.37,3.69,12.32],
  "380":[496.05,108.81,30.04,32.37],
  "392":[813.38,125.9,23.62,27.66],
  "404":[571.48,240.37,21.5,30.32],
  "410":[798.08,135.01,10.23,17.02],
  "484":[179.73,153.55,71.03,57.06],
  "528":[487.86,89.57,8.84,8.12],
  "554":[882.46,363.9,46.54,40.05],
  "566":[487.19,212.7,32.14,30.04],
  "578":[490.78,40.17,52.31,36.12],
  "616":[512.72,85.49,24.12,17.49],
  "646":[557.87,259.39,5.49,5.52],
  "682":[569.84,155.42,56.95,49.48],
  "702":[759.75,251.56,1,1],
  "710":[522.73,325.32,43.04,39.91],
  "724":[457.17,118.93,31.5,24.28],
  "756":[494.39,106.62,10.85,6.07],
  "784":[615.33,174.43,12.4,10.86],
  "826":[461.2,68.7,22.92,31.36],
  "840":[170.46,101.85,146.52,75.58],
  "076":[280.72,239.63,105.59,122.21],
  "036":[773.04,289.47,107.41,103.28],
};
