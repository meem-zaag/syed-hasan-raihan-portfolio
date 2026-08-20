# Syed Hasan Raihan — Portfolio Platform

Personal portfolio platform: a Spring Boot API, a React (Vite) admin CMS, and a Next.js public site,
all sharing one backend and database. All three are built and live.

- **Live sites:** portfolio at [portfolio-syed-hasan-raihan.vercel.app](https://portfolio-syed-hasan-raihan.vercel.app),
  admin at [portfolio-admin-2kz.pages.dev](https://portfolio-admin-2kz.pages.dev), backend API at
  [portfolio-backend-68bh.onrender.com](https://portfolio-backend-68bh.onrender.com).
- `backend/` — Spring Boot 3 / Java 21 API. See `backend/README.md`.
- `admin/` — React admin CMS (Vite + TS + Tailwind + antd + React Query + Zustand). See
  `admin/README.md`.
- `portfolio/` — Next.js public site (Tailwind, Framer Motion, Three.js). See `portfolio/README.md`.
- `docs/DEPLOYMENT.md` — **how everything is hosted and how to redeploy each app** — read this before
  touching production.
- `docs/BACKEND_BRIEF.md` / `docs/ADMIN_BRIEF.md` / `docs/PORTFOLIO_BRIEF.md` /
  `docs/PORTFOLIO_REDESIGN_BRIEF.md` / `docs/PORTFOLIO_REVISION_BRIEF.md` — the build/design specs each
  app or revision was implemented against.
- `portfolio-platform-spec.md` — the original high-level product spec.
- `docker-compose.yml` — local Postgres for development.

## Quick start (local dev)

```bash
docker compose up -d postgres
cd backend && ./mvnw spring-boot:run    # or: mvn spring-boot:run
cd admin && npm install && npm run dev
```

Then open the admin app (Vite will print the local URL, typically http://localhost:5173) and log in
with the seeded admin credentials documented in `backend/README.md` — **change that password
immediately** after first login.
