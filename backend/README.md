# Portfolio Backend

Spring Boot 3 / Java 21 API serving both the admin CMS and (later) the public Next.js portfolio site.
Built against the spec in `../docs/BACKEND_BRIEF.md` — read that for the full entity/API design.

## Requirements

- Java 21 (this repo was built/tested with Temurin 21.0.5 via SDKMAN — run `sdk use java 21.0.5-tem`
  if you have multiple JDKs installed)
- Maven (`~/.sdkman/candidates/maven/current/bin/mvn` or any Maven 3.9+)
- Docker + Docker Compose (for local Postgres)

## Running locally

```bash
# from the repo root
docker compose up -d postgres

# from backend/
mvn spring-boot:run
```

The app starts on `http://localhost:8080`. Flyway runs automatically on startup and seeds the database
on first run (`V1__init_schema.sql` + `V2__seed_initial_data.sql`).

- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Seeded admin login

```
username: admin
password: ChangeMe123!
```

**Change this password immediately after first login** — there's no self-registration endpoint, and no
"forgot password" flow. If you get locked out, update `admin_user.password_hash` directly with a fresh
BCrypt hash (or re-run migrations against a fresh database).

## Seed data

The seed migration (`V2__seed_initial_data.sql`) populates Profile, Pages/Sections, Skills, Experience,
Education, and Projects from `syed_hasan_raihan_cv_v7.pdf`. **The CV only lists a subset of real project
history** — additional past projects need to be added manually via the admin Projects manager. The
Dashboard screen in the admin app should surface this as a standing reminder.

## Configuration

Everything is environment-variable driven (see `src/main/resources/application.yml` for the full list
and dev defaults) — nothing is hardcoded. Key ones:

| Variable | Purpose | Dev default |
|---|---|---|
| `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` | Postgres connection | `jdbc:postgresql://localhost:5432/portfolio_db` / `portfolio` / `portfolio_dev_pw` |
| `JWT_SECRET` | HMAC signing key for access tokens | insecure dev default — **must** be overridden in any real deployment |
| `JWT_ACCESS_TOKEN_TTL_MINUTES` / `JWT_REFRESH_TOKEN_TTL_DAYS` | Token lifetimes | 15 / 7 |
| `STORAGE_BASE_PATH` | Where uploaded files live on disk | `./uploads` (relative to wherever the app is started from) |
| `STORAGE_PUBLIC_PATH` | URL prefix files are served under | `/uploads` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173,http://localhost:3000` |

## File storage

Uploads go to `${STORAGE_BASE_PATH}/yyyy/MM/<uuid>-<original-name>` on local disk and are served back
via a Spring resource handler at `${STORAGE_PUBLIC_PATH}/**`. This lives behind a `StorageService`
interface (`com.syedhasanraihan.portfolio.storage`) — swapping in S3/Cloudinary later means adding a new
implementation, not touching callers.

## Auth flow

`POST /api/auth/login` returns a short-lived JWT access token plus an opaque refresh token (stored
server-side only as a SHA-256 hash). `POST /api/auth/refresh` rotates the refresh token (old one is
revoked, a new pair is issued). All `/api/admin/**` routes require `Authorization: Bearer <accessToken>`;
`/api/public/**` and `/api/auth/**` are open.

## Verification performed during the initial build

- `mvn compile` — clean build.
- Fresh-database Flyway migration (`V1` + `V2`) — applies cleanly, `spring.jpa.hibernate.ddl-auto:
  validate` passes (entities match the migrated schema exactly).
- Smoke-tested via curl: login, refresh-token rotation, every public GET, admin CRUD round trips
  (profile, sections incl. reorder, projects incl. reorder + image attach/detach, experience, education,
  skills), media upload → static file fetch → delete → 404, contact form submission + admin inbox,
  401-vs-authenticated enforcement on `/api/admin/**`, and Swagger UI/OpenAPI doc generation.
- The dev database was reset to a clean seeded state after smoke testing (no leftover test data).
