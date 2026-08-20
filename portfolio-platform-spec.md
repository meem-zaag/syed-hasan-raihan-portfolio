# Portfolio Platform — Build Spec (Phase 1: Backend + Admin)

> **How to use this file:** Save as `CLAUDE.md` in your project root before running `claude`, or paste
> the whole thing as your first prompt. Either way, tell Claude Code to read
> `/home/sraihan/Documents/syed_hasan_raihan_cv_v7.pdf` as its first step — it has local file access
> and can extract seed data from it directly.

## 1. Project Summary

Build a personal portfolio platform for Syed Hasan Raihan, made of two applications sharing one backend:

1. **Portfolio site** — public-facing, built with Next.js. *(Phase 2 — see §11. Not built yet.)*
2. **Admin panel** — private CMS to manage every piece of content on the portfolio (personal info,
   page sections, projects, images). Built with React. *(Phase 1 — build now.)*
3. **Backend API** — Spring Boot, serves both apps. *(Phase 1 — build now.)*

Almost all content on the portfolio site (headings, subheadings, descriptions, images — per section,
per page) must be editable from the admin panel. Nothing should be hardcoded that a non-developer
would reasonably want to change.

## 2. Scope for This Phase

**Build now:** Spring Boot backend, React admin panel, database schema, auth, file uploads, seed data
from the CV.

**Do NOT build yet:** the Next.js portfolio site itself, Magic UI / Aceternity UI integration, or any
final visual design. Design screenshots are coming later — scaffold the Next.js app skeleton only if
it's trivial to do alongside the API work; otherwise skip it entirely for now.

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.x, Java 21, Spring Data JPA, Spring Security (JWT), Bean Validation |
| Database | PostgreSQL (default assumption — flag if you'd prefer MySQL) |
| Migrations | Flyway |
| API docs | springdoc-openapi (Swagger UI) |
| Admin app | React 18 + TypeScript, Vite |
| Admin styling | Tailwind CSS + Ant Design (antd) |
| Admin server state | TanStack React Query |
| Admin client state | Zustand |
| Admin routing | React Router |
| Admin HTTP client | Axios |
| Portfolio (Phase 2) | Next.js, Tailwind CSS, Magic UI, Aceternity UI, Framer Motion |

## 4. Data Model

Design JPA entities (and matching Flyway migrations) for:

| Entity | Key fields |
|---|---|
| `AdminUser` | username, hashed password, role |
| `Profile` | name, title/tagline, bio, email, phone, location, social links, resume file, avatar image |
| `Page` | slug (home, about, projects, contact...), title, meta info |
| `Section` | belongs to `Page`; heading, subheading, description (rich text), order index, image(s), section type |
| `Project` | title, summary, description, tech stack (tags), gallery images, live URL, repo URL, category, featured flag, order index |
| `SkillCategory` / `Skill` | category name; skill name, proficiency/level, icon |
| `Experience` | company, role, start/end date, description, location |
| `Education` | institution, degree, field, start/end date |
| `Media` | uploaded file metadata: url/path, alt text, linked entity type + id |
| `ContactMessage` | name, email, subject, message, read flag, createdAt |
| `SiteSettings` | SEO defaults, theme accent color, misc global toggles (optional, keep minimal) |

Keep `Section` generic enough that new page sections can be added without new entity types — this is
what makes the site "almost everything dynamic."

## 5. API Design

Split every resource into a public read path and an admin-protected write path.

```
Auth
  POST   /api/auth/login
  POST   /api/auth/refresh

Public (read-only, no auth)
  GET    /api/public/profile
  GET    /api/public/pages/{slug}
  GET    /api/public/projects
  GET    /api/public/projects/{id}
  GET    /api/public/skills
  GET    /api/public/experience
  GET    /api/public/education
  POST   /api/public/contact

Admin (JWT required)
  PUT    /api/admin/profile
  CRUD   /api/admin/pages/{pageId}/sections
  CRUD   /api/admin/projects
  CRUD   /api/admin/skills
  CRUD   /api/admin/experience
  CRUD   /api/admin/education
  POST   /api/admin/media/upload
  DELETE /api/admin/media/{id}
  GET    /api/admin/messages
  PATCH  /api/admin/messages/{id}/read
  DELETE /api/admin/messages/{id}
```

Document all endpoints via springdoc/Swagger UI.

## 6. Admin Panel Features

- **Login** — JWT auth, protected route wrapper, token refresh handling.
- **Dashboard** — quick overview (unread messages count, project count, last edited section, etc.)
- **Profile editor** — antd Form for all personal info fields + avatar/resume upload.
- **Page & Section builder** — per page, list sections with drag-to-reorder, add/edit/delete, each with
  heading/subheading/description/image fields. This is the core CMS screen.
- **Projects manager** — CRUD with multi-image gallery upload, tech-stack tag input, reordering,
  featured toggle.
- **Skills / Experience / Education managers** — simple CRUD list-and-form screens.
- **Media library** — browse/search all uploaded images, reuse across entities, delete unused files.
- **Contact inbox** — list messages, mark read/unread, delete.
- **Settings** — SEO defaults, theme accent color (optional, low priority).

## 7. Admin UI/UX Requirements

- Modern, clean, uncluttered — antd components for structure (Table, Form, Modal, Drawer, Upload),
  Tailwind utility classes for custom spacing/layout on top.
- Sidebar + topbar layout, responsive down to tablet width.
- Smooth transitions: page/route transitions, modal/drawer open-close, list item add/remove
  (framer-motion is fine to use in the admin too, even though the mandated stack is antd/Tailwind).
- Toast/notification feedback (antd `message`/`notification`) for every create/update/delete/error.
- Loading skeletons instead of spinners where reasonable.

## 8. State & Data-Fetching Conventions

- **React Query** owns all server state — every API call goes through a query/mutation hook, with
  proper cache invalidation on mutations.
- **Zustand** owns only client/UI state — auth token, sidebar collapsed state, active filters, form
  drafts. Never duplicate server data into Zustand.
- Centralize the Axios instance with interceptors for auth headers and 401 handling.

## 9. Non-Functional Requirements

- Validate input on both frontend (antd Form rules) and backend (Bean Validation).
- File upload: restrict type/size, store via a swappable storage abstraction (default: local disk
  under a configurable path; structure the code so swapping to S3/Cloudinary later is a small change,
  not a rewrite).
- JWT access + refresh token flow; passwords hashed (BCrypt).
- `.env` / `application.yml` based config for both apps — no hardcoded secrets or URLs.
- Sensible global error handling (backend: `@ControllerAdvice`; admin: React Query error boundaries).

## 10. Suggested Project Structure

```
/backend        Spring Boot app
/admin          React admin app
/portfolio      Next.js app (Phase 2 — create later, or empty scaffold if trivial now)
```

## 11. Execution Order

1. Scaffold Spring Boot project with all dependencies.
2. Model entities + Flyway migrations.
3. Implement JWT auth for admin.
4. Implement all CRUD REST APIs (§5).
5. Implement media upload/storage handling.
6. Implement public contact-form endpoint.
7. Wire up Swagger/OpenAPI docs.
8. Scaffold admin app (Vite + React + TS + antd + Tailwind + React Query + Zustand + React Router).
9. Build auth flow + protected routing in admin.
10. Build shared layout (sidebar, topbar, route transitions).
11. Build Profile editor screen.
12. Build Page/Section builder screen.
13. Build Projects manager (with gallery upload).
14. Build Skills/Experience/Education managers.
15. Build Contact inbox screen.
16. Read the CV PDF and seed the database with initial Profile/Experience/Education/Skills/Project data.
17. Leave clear TODO markers or an admin note indicating where additional past projects (not in the CV)
    should be added manually later.
18. Smoke-test all flows end to end.

## 12. Explicitly Out of Scope This Phase

- Next.js portfolio site UI/pages
- Magic UI / Aceternity UI integration
- Final visual design / branding (screenshots pending from user)

## 13. Open Decisions (defaults given — override anytime with one line)

- **Database:** PostgreSQL (default) vs MySQL
- **Image storage:** local disk now, abstracted for later S3/Cloudinary swap
- **Java/Spring Boot versions:** Java 21 / Spring Boot 3.x (default)
- **Deployment target:** not addressed yet, out of scope for this phase
