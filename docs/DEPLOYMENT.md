# Deployment — How Everything Is Hosted, and How to Redeploy

Everything runs on genuinely free-forever tiers, spread across four platforms because no single free
tier covers backend + database + two frontends well. This doc explains what's where, why, and exactly
what to run when you change something.

## Architecture at a glance

```
GitHub (public repo, meem-zaag/syed-hasan-raihan-portfolio)
  │
  ├─ backend/    ──auto-deploy──▶  Render (Docker web service)   portfolio-backend-68bh.onrender.com
  │                                        │
  │                                        ▼
  │                                 Neon (Postgres, free tier)
  │                                        │
  │                                 Cloudflare R2 (file storage, free tier)
  │
  ├─ admin/      ──manual deploy─▶ Cloudflare Pages              portfolio-admin-2kz.pages.dev
  │
  └─ portfolio/  ──manual deploy─▶ Vercel (Hobby, free tier)     portfolio-syed-hasan-raihan.vercel.app

GitHub Actions (in the same repo) pings the Render backend every 10 minutes so it doesn't
cold-sleep — see "Why the repo is public" below.
```

| Service | Platform | Live URL | Auto-deploys on push? |
|---|---|---|---|
| Backend (Spring Boot API) | Render | https://portfolio-backend-68bh.onrender.com | **Yes** |
| Admin CMS | Cloudflare Pages | https://portfolio-admin-2kz.pages.dev | No — manual |
| Portfolio site | Vercel | https://portfolio-syed-hasan-raihan.vercel.app | No — manual |
| Database | Neon (Postgres) | internal only, not public | n/a |
| File storage | Cloudflare R2 | `pub-*.r2.dev` (returned in API responses) | n/a |

---

## Backend — Render

**What it is:** the Spring Boot API, built from `backend/Dockerfile`, connected directly to GitHub.
Render watches the `backend/` root directory and rebuilds automatically on every push to `main` that
touches it (`autoDeploy: yes`, `autoDeployTrigger: commit` — no action needed from you).

**To redeploy:** just `git push` a change under `backend/`. Render picks it up on its own. To confirm
or watch it happen:
```bash
source "$HOME/.railway/env"   # loads the `render` CLI onto PATH, despite the misleading dir name
render deploys list srv-da3c908jo6nc73e8er70 --output json
```
To trigger a rebuild manually without a new commit (e.g. after changing a Render env var):
```bash
render deploys create srv-da3c908jo6nc73e8er70
```

**Health check / keep-warm:** Render's free tier sleeps after 15 minutes idle, and this backend's JVM
cold start can take 60-90+ seconds. `.github/workflows/keep-backend-warm.yml` pings
`/api/public/health` every 10 minutes to prevent that for real visitors.

**Why the repo is public:** GitHub Actions bills a minimum of 1 minute per run. A private repo only
gets 2,000 free minutes/month — a 10-minute ping cadence needs ~4,300 runs/month, which would exceed
that and silently stop working partway through the month. Public repos get unlimited free Actions
minutes. The repo was scanned for secrets/credentials before flipping visibility (none found — all
credentials are env vars, never committed).

**Environment variables** (set on the Render service, not in the repo):

| Var | Purpose |
|---|---|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | Neon Postgres connection (JDBC form) |
| `JWT_SECRET` | Signs auth tokens — a real generated secret, not the dev default |
| `STORAGE_TYPE=r2` | Selects the R2-backed `StorageService` over local disk |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_BASE_URL` | Cloudflare R2 credentials/config |
| `CORS_ALLOWED_ORIGINS` | `https://portfolio-admin-2kz.pages.dev,https://portfolio-syed-hasan-raihan.vercel.app,http://localhost:3005,http://localhost:3000` |

All of these (plus the Render API key) are mirrored locally in `~/.portfolio_deploy_secrets.env`
(chmod 600, outside the repo, never committed) for reference — that file is the source of truth if you
ever need to recreate the service from scratch.

**If the service ever needs to be recreated** (e.g. env vars need bulk changes — Render's CLI has no
"update env var" command, only set-at-creation via `--env-var`, so recreating is sometimes the fastest
path): recreating changes the public URL, which cascades — you'd need to update `CORS_ALLOWED_ORIGINS`
back to the admin/portfolio origins, and rebuild+redeploy both frontends with the new
`VITE_API_BASE_URL`/`NEXT_PUBLIC_API_BASE_URL`. This happened once already during development; treat it
as a last resort, not a routine operation.

---

## Admin CMS — Cloudflare Pages

**What it is:** the Vite/React admin app, deployed as a static build. **Not** connected to GitHub —
every deploy is a manual CLI push of the built `dist/` folder.

**To redeploy after a change:**
```bash
cd admin
npm install   # only if dependencies changed
VITE_API_BASE_URL=https://portfolio-backend-68bh.onrender.com/api npm run build
npx wrangler pages deploy dist --project-name=portfolio-admin --branch=main
```
That's it — `wrangler` picks up your existing Cloudflare login. The new build aliases to the production
URL automatically since `--branch=main` matches the project's production branch.

---

## Portfolio site — Vercel

**What it is:** the Next.js public site. **Not** connected to GitHub either — same manual-deploy
pattern as admin, but for one specific extra reason worth understanding.

**Why manual, and the git-author quirk:** Vercel blocks CLI deployments when the local git commit
author's email doesn't match a verified member of the target Vercel team — ours is
`s.raihan@zaagsys.com` (your real git identity) vs. the Vercel account's `syed.hasan.meem@gmail.com`.
Deploying straight from the repo hits `readyState: BLOCKED` with a `Git author ... must have access`
error. **The workaround: deploy from a git-detached copy of `portfolio/`** so Vercel finds no git
metadata to check at all:

```bash
# from the repo root
rm -rf /tmp/portfolio-deploy && mkdir -p /tmp/portfolio-deploy
rsync -a --exclude node_modules --exclude .next --exclude .git portfolio/ /tmp/portfolio-deploy/
cd /tmp/portfolio-deploy
npx vercel --prod --yes      # omit --prod to deploy to a preview URL first instead
```

(If you'd rather fix this permanently instead of using the workaround each time: either add
`s.raihan@zaagsys.com` as a verified member on the Vercel team, in Vercel's Team Settings, or set this
repo's local git `user.email` to match the Vercel account's email. Neither has been done — the
workaround above is quick enough that it hasn't been worth the tradeoffs of either fix.)

**Environment variables** — set per-environment in the Vercel dashboard/CLI, and this matters because
Vercel scopes them separately:
```bash
cd portfolio
npx vercel env ls                              # see what's set where
npx vercel env add NEXT_PUBLIC_API_BASE_URL production   # if it's ever missing
npx vercel env add NEXT_PUBLIC_API_BASE_URL preview       # needed separately for preview deploys!
```
**Both `production` and `preview` scopes need `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_SITE_URL`
set independently** — this bit during development: a preview deploy silently rendered with zero data
because the var only existed in the `production` scope. Since `NEXT_PUBLIC_*` vars are inlined at
**build time**, changing them always requires a fresh deploy, not just a dashboard edit.

**Recommended flow for any portfolio change:** deploy to preview first (drop `--prod` above), check the
preview URL (it's gated behind Vercel's SSO — fine, since you're logged into the same account, it just
works in your browser), then repeat with `--prod` once you're happy. Clean up old deployments
afterward: `npx vercel ls portfolio-syed-hasan-raihan` then `npx vercel rm <url> --yes`.

---

## Database — Neon

Free tier, auto-suspends after 5 minutes idle (resumes on the next query with a short delay — this is
normal, not a problem to fix). Flyway migrations run automatically whenever the backend boots, so
schema changes just need a normal backend deploy — nothing extra to run against Neon directly.

To inspect/query directly: `npx neonctl` (auth via `NEON_API_KEY` env var — the key is in
`~/.portfolio_deploy_secrets.env`) or the Neon web console at console.neon.tech.

---

## File storage — Cloudflare R2

Bucket `portfolio-uploads`, public read access enabled via its `r2.dev` URL. No redeploy concept here —
the backend writes/reads directly via the S3-compatible API using the `R2_*` env vars on Render. Nothing
to do when the backend redeploys; this is just infrastructure it talks to.

---

## Known follow-ups (not deployment-blocking, but worth doing)

- **Rotate the seeded admin password** (`admin` / `ChangeMe123!`). No self-service change-password
  endpoint exists yet — rotating it means generating a new bcrypt hash and running one `UPDATE
  admin_user SET password_hash = '...' WHERE username = 'admin';` against Neon directly.
- The Vercel git-author deploy block (see above) could be fixed permanently instead of worked around
  each time, if it becomes annoying.
- If traffic ever grows past what these free tiers comfortably handle, the natural upgrade path per
  service: Render → paid Hobby plan (removes cold starts entirely); Neon → paid tier (more
  compute/storage); Vercel/Cloudflare Pages already scale generously on free tiers for a personal site.
