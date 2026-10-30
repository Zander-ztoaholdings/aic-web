# Staging and releases

Two copies of each app run in Coolify: **production** (deploys from `main`) and
**staging** (deploys from `staging`). Every change is checked on staging before
it reaches production, and every production release is tagged.

## Branches

| Branch | Lives | Deploys to | Changed by |
|---|---|---|---|
| `main` | Always | Production | Pull request from `staging` only |
| `staging` | Always | Staging | Pull requests from task branches |
| `o1/agent-queue` and so on | One task | Nowhere | Commits while the task is worked on |

A task branch is named after the objective it serves and the task:
`o<objective number>/<short-task-name>`, for example `o1/agent-queue` or
`o2/cems-onboarding`. Work that belongs to no objective uses `fix/<name>` or
`chore/<name>`. One task, one branch. A branch lives only as long as its task;
if a task would take more than a few days, split it.

## The flow for one task

1. **Branch** from the latest `staging`:
   ```
   git checkout staging && git pull
   git checkout -b o1/agent-queue
   ```
2. **Work and commit** on the branch. Push it: `git push -u origin o1/agent-queue`.
3. **Open a pull request into `staging`.** Fill in the template: the vault task,
   what changed, and the migrations it needs. CI runs on the pull request.
4. **Merge when CI is green.** Coolify deploys staging.
5. **Run any migration on the staging database**, then check the change on staging:
   - website: https://staging.aiccertified.cloud
   - platform: https://staging-app.aiccertified.cloud
6. **If it is wrong**, fix it on a new branch from `staging` and repeat. Nothing
   reaches production until step 7.

A task may merge before its objective is finished, so each merge must leave the
app working. An unfinished feature stays out of the menu, or behind a setting,
until its last task lands.

## Releasing to production

7. **Run any migration on production first** (docs/DATABASE.md says how), and
   tick it in the pull request.
8. **Open a pull request from `staging` into `main`** and merge it when CI is
   green. Production deploys from `main`.
9. **Tag the release** on `main`, with the date and what went out:
   ```
   git checkout main && git pull
   git tag -a v2026.11.06 -m "Agent queue (O1). Migrations: 031."
   git push origin v2026.11.06
   ```
   Two releases on one day: `v2026.11.06.2`.
10. **Check production** (`/api/health`, and the change itself).

## Going back

To return production to the last good release, redeploy its tag in Coolify, or
open a pull request that reverts the bad merge. Migrations are additive, so the
older code still runs against the newer database.

## Staging settings (Coolify, staging apps only)

| Variable | Value |
|---|---|
| `AIC_ENV` | `staging` (adds a noindex header to every response) |
| `DATABASE_URL` | the staging database, never production |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | different from production |
| `AUTH_URL` / `NEXTAUTH_URL` | `https://staging-app.aiccertified.cloud` |
| `AIC_WEB_INTERNAL_URL` | the staging website's internal address |
| `PLATFORM_INTERNAL_URL` | the staging platform's internal address |
| `NEXT_PUBLIC_PLATFORM_URL` | `https://staging-app.aiccertified.cloud` |
| `NEXT_PUBLIC_WEB_URL` | `https://staging.aiccertified.cloud` |
| `RESEND_API_KEY` | a separate key, or unset so no email is sent |

Turn on Coolify's basic-auth protection for both staging apps as well; the
noindex header is the backstop if it is ever switched off.

## Data

The staging database holds schema and test data only. Never copy production
client data into it.
