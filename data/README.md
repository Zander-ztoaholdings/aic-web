# data

Raw source data, read by the build scripts and not by the running site.

- `countries-50m.json`: world country shapes (TopoJSON, 1:50m). `scripts/build-world-map.mjs` turns it into `public/data/world-map.json`.

Keep raw inputs here and generated outputs in `public/data/` or `app/data/`.
