# Syed Hasan Raihan — Portfolio Platform

Personal portfolio platform: a Spring Boot API, a React (Vite) admin CMS, and (later) a Next.js public
site, all sharing one backend and database.

- `backend/` — Spring Boot 3 / Java 21 API. See `backend/README.md`.
- `admin/` — React admin CMS (Vite + TS + Tailwind + antd + React Query + Zustand). See
  `admin/README.md`.
- `portfolio/` — Next.js public site. **Not built yet** (Phase 2, pending design screenshots).
- `docs/BACKEND_BRIEF.md` / `docs/ADMIN_BRIEF.md` — the detailed build specs each app was implemented
  against.
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
