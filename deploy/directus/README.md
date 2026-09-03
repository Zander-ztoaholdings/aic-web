# Directus on Coolify — deployment runbook

Directus is the admin interface for the AIC certification register. It does not
own the data: it introspects the same Postgres the website already uses. That is
why it was chosen — see `AIC - CMS & Registry Data Decision` in the vault.

Everything below is written so that **no secret ever passes through a chat, a
commit, or a file**. Generate each one on your own machine, paste it straight
into Coolify.

---

## Step 0 — Apply for the Open Innovation Grant first

Do this before anything else. It is free, approval is immediate, and skipping it
puts the deployment on a countdown from day one.

Directus v12 changed the licence. An unregistered self-hosted instance runs on
the **core tier**, which is capped at:

| | Core (no key) | Open Innovation Grant |
|---|---|---|
| Studio seats | 3 | unlimited |
| Registered collections | 25 | unlimited |
| Flows | 5 | unlimited |
| Activity log / revision retention | 30 days | unlimited |
| SSO, custom access policies | no | yes |

The register schema has 45 application tables. Even registering a deliberate
subset of them, the 25-collection cap is the one that bites, and the custom
access policies in step 6 are a grant feature — on the core tier you cannot
build the restricted `Registry Operator` role at all.

Exceeding a cap does not break immediately: you get 30 days of normal operation
with a nag screen, then the instance is **locked down** — `/items` endpoints
blocked, GraphQL and WebSockets disabled, and `/login` refused for everyone
except admins. Recoverable, but not something to discover in month two.

**Eligibility is under $5M annual recurring revenue and fewer than 50
employees.** AIC is comfortably inside both.

Apply at `directus.com/oig`. You get a key back; it goes in as `LICENSE_KEY` in
step 4. Answer the form accurately — Directus reserves the right to revoke keys
obtained on false information, and a revoked key on a certification body's
register is not a problem worth inviting.

---

## Before you start — three things worth knowing

**1. Directus will add 33 tables to the register database, and you choose
which of yours it sees.**
The 33 are all prefixed `directus_` and are its own bookkeeping (users, roles,
permissions, revisions, activity). Your 45 application tables are not touched.
If Directus is ever removed, those 33 are dropped and the register is exactly as
it was.

Crucially, a table in the database is invisible to Directus until you
*register* it as a collection. Register only what the register actually needs —
`organizations`, `issued_certifications`, `audit_documents`, `conflict_checks`,
`audit_ledger`, `incidents`, `scheduled_audits`, and a small number of
supporting lookups. Leave `api_keys`, `password_reset_tokens`, `revoked_tokens`,
`login_attempts` and `users` unregistered. There is no reason to put a table of
credentials behind an internet-facing admin panel, and unregistered tables also
do not count toward the collection limit.

**2. There will be two separate user systems, and they do not talk to each
other.** `directus_users` is who can log into the admin panel.
`users` — the application table with the `AUDITOR` / `COMPLIANCE_OFFICER` role
enum — is who can log into the platform. A person who needs both needs two
accounts. This is a real ongoing cost and it is worth being deliberate about it:
keep the Directus user list *short*.

**3. Git owns the schema. Directus owns rows only.**
Directus can alter tables from its Data Model screen. Do not let it. The schema
lives in `lib/db/schema.ts` and is applied by `scripts/migrate.mjs`; if someone
adds a column in the Directus UI, the next migration run will not know about it
and the two will drift. The lockdown in step 6 turns this off for everyone
except the admin, and the admin should treat it as read-only.

---

## Step 1 — Generate the secrets (on your machine)

```bash
openssl rand -base64 32   # DIRECTUS_KEY
openssl rand -base64 32   # DIRECTUS_SECRET
openssl rand -base64 24   # ADMIN_PASSWORD  (temporary, first boot only)
```

Run it three times, keep the three values in your password manager. Do not
reuse the website's `ENCRYPTION_KEY` or `CONTACT_IP_SALT`.

## Step 2 — Get the database's internal hostname

In Coolify, open the existing Postgres resource. You want the hostname it
advertises on the **internal Docker network** — not `localhost`, not the
server's public IP, and not the connection string with the public port in it.
Recall that port 5432 is firewalled from outside, which is correct and should
stay that way; Directus reaches Postgres over the internal network instead.

Note the database name and user as well. They are the same ones behind the
website's `DATABASE_URL`.

## Step 3 — Create the Coolify resource

- **+ New Resource → Docker Compose**
- Point it at this repository, path `deploy/directus/docker-compose.yml`
- Make sure it lands in the **same Coolify project** as the Postgres, and that
  "Connect to Predefined Network" is enabled — otherwise the two containers
  cannot see each other and you will get `ENOTFOUND` on the DB host.

## Step 4 — Environment variables

Set these in Coolify's Environment Variables tab. Mark every one of them
**Build Variable: off**, and use Coolify's secret/locked setting for the four
marked 🔒 so they are not echoed back in the UI.

| Variable | Value |
|---|---|
| `DB_HOST` | internal hostname from step 2 |
| `DB_PORT` | `5432` |
| `DB_DATABASE` | the register database name |
| `DB_USER` | the database user |
| `DB_PASSWORD` 🔒 | the database password |
| `DIRECTUS_KEY` 🔒 | first `openssl` value |
| `DIRECTUS_SECRET` 🔒 | second `openssl` value |
| `ADMIN_EMAIL` | your address |
| `ADMIN_PASSWORD` 🔒 | third `openssl` value — temporary |
| `PUBLIC_URL` | `https://cms.aiccertified.cloud` |
| `LICENSE_KEY` | the Open Innovation Grant key from step 0 |

`PUBLIC_URL` must match the domain Coolify routes here, character for
character, `https://` included.

## Step 5 — Domain and first boot

Set the domain to `cms.aiccertified.cloud` in Coolify (it will issue the
certificate), add the matching DNS record at Hostinger, and deploy.

First boot takes a minute or two: Directus creates its 33 tables and then
introspects the 45 existing ones. Watch the logs. When it settles, log in with
`ADMIN_EMAIL` / `ADMIN_PASSWORD`.

**Immediately:** change the admin password from inside Directus, enable 2FA on
the account, then go back to Coolify and blank `ADMIN_PASSWORD`. It is only read
when `directus_users` is empty, so leaving it set does nothing except keep a
live credential sitting in the environment.

## Step 6 — Lock it down before anyone else gets an account

Out of the box, an admin role in Directus can delete any row in any table. Two
of those tables must never lose rows:

- `audit_ledger` and `audit_signatures` — the integrity trail.
- `issued_certifications` — PRD D7: status history is never silently deleted.
  A revoked certificate is *marked* revoked; the row stays.

So, in **Settings → Access Policies**, before creating any second account:

1. Create a `Registry Operator` policy — this is what actual day-to-day users
   get. Grant it create/read/update on `organizations`,
   `issued_certifications`, `audit_documents`, `conflict_checks`. Grant it
   **no delete anywhere**, and **no access at all** to `users`, `api_keys`,
   `password_reset_tokens`, `revoked_tokens`, `login_attempts`.
2. Deny that policy access to the Data Model / schema screens, per point 3
   above.
3. Keep the full admin role to yourself.

`conflict_checks` deserves a note: it is where the Arthur Andersen Rule lives —
AIC never certifies an organisation it has advised. Whoever can edit that table
can quietly erase the record of a conflict. Operators should be able to *add*
conflict checks and read them; only you should be able to change one.

## Step 7 — Verify, then tell the site nothing

Check `https://cms.aiccertified.cloud/server/health` returns ok, and confirm
the register tables appear under Content with real column names.

The website does **not** need to know Directus exists. It reads Postgres
directly through `lib/registry.ts`, which is also where the no-numeric-scores
rule (D6) is enforced by the type system. Nothing about this deployment changes
that, and nothing should be re-routed through the Directus API — doing so would
route around D6.

---

## What Directus's revision log is, and what it is not

Directus records who changed which field, when, with a before/after value. That
is genuinely useful and it is one of the reasons it was chosen.

It is **not** the compliance record. The compliance record is `audit_ledger` and
`audit_signatures` in the application schema, written by the platform, and
Directus is merely another client writing rows near it. Two consequences:

- A change made in the Directus UI lands in `directus_revisions`, not in
  `audit_ledger`. If an action needs to be in the ledger, it must go through the
  platform, not through the admin panel. Direct row edits are for correcting
  data, not for performing certification decisions.
- On the core tier, revision history is discarded after 30 days. Under the grant
  it is unlimited — another reason step 0 is not optional.

## A note on seats

Seats count **Studio users only** — anyone with a policy granting App or Admin
access. The `users` table in the application schema is irrelevant to this: ten
thousand platform users consume zero Directus seats. So the seat count is simply
how many people log into this panel, which should stay small regardless of what
the licence allows.

## What this changes about backups

Before Directus, losing the Postgres meant losing the register. That is still
true, and Coolify backups for it are still deferred and still the largest single
gap.

Directus adds a second thing to lose: the `directus-uploads` volume, which will
hold audit evidence documents. Rows in `audit_documents` will point at files
that no longer exist if only the database is backed up. When you do turn
backups on, turn them on for both.

## If you want to walk away from it

```
Delete the Coolify resource, then:
  DROP TABLE <the 33 directus_* tables> CASCADE;
```
The register is untouched. That reversibility was the point.
