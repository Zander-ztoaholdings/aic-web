# Development

## Set up a laptop

1. Install Node 22 (`nvm use` reads `.nvmrc`).
2. `cp .env.example .env.local`, and fill in what you need. Nothing is required to start the site; `DATABASE_URL` and `NOTION_API_KEY` light up the register, verification, forms and news.
3. `npm ci`
4. `npm run dev`, then open http://localhost:3000.

For a local database, point `DATABASE_URL` at a Postgres of your own and apply the migrations with `node scripts/migrate.mjs`. Never point a laptop at production.

## Checks before you commit

CI runs these on every push and pull request (type check, tests, production build); run them first.

```bash
npm run type-check
npm run lint
npm test
npm run build
```

## House rules

- **Every page sets its metadata** with `pageMetadata()` from `lib/seo.ts`, and is added to `app/sitemap.ts` if it should be found.
- **API routes validate input** (`lib/validation.ts`) and are rate limited (`lib/rate-limit.ts`). Tokens are compared with `lib/secure-compare.ts`.
- **No raw personal data where a hash will do**: IPs are hashed before storage.
- **Content that changes often lives in Notion**; reference content lives in `app/data/` as typed data, not in page markup.
- **Generated data is generated**: edit `scripts/build-*.mjs` or `data/`, then re-run the script; do not hand-edit `app/data/country-*.ts` or `public/data/world-map.json`.
- **Write the test with the change** in `__tests__/`.
- **Independence wording**: AIC records and tracks; it never consults and never certifies its own tools' output.

## Branches and releases

`staging` first, then `main`. See [STAGING.md](STAGING.md).
