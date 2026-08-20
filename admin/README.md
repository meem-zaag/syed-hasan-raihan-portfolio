# Portfolio Admin

React (Vite + TypeScript) admin CMS for the portfolio platform. Built against the Spring Boot API in
`/backend` — see `../docs/ADMIN_BRIEF.md` for the full design spec this app was implemented against.

## Stack

React 18, TypeScript, Tailwind CSS + Ant Design (antd), TanStack React Query, Zustand, React Router 6,
Axios, Framer Motion, dnd-kit (drag-to-reorder), react-quill-new (rich text).

## Setup

```bash
npm install
cp .env.example .env   # defaults to http://localhost:8080/api — adjust if your backend runs elsewhere
npm run dev
```

Requires the backend running (see `../backend/README.md`) and reachable at `VITE_API_BASE_URL`. Log in
with the seeded admin credentials from the backend README, then change the password via a real change
flow before deploying anywhere public (no self-service password change screen exists yet — the seeded
account is meant to be replaced/rotated manually for now).

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — type-check (`tsc -b`) + production build
- `npm run lint` — ESLint
- `npm run preview` — preview the production build locally

## Structure

```
src/
  api/          axios instance + one module per backend resource, plus the React Query client config
  hooks/        React Query hooks (queries + mutations) per resource — the only place server state lives
  store/        Zustand stores — authStore (tokens/user), uiStore (sidebar collapsed) — UI state only
  components/
    layout/     AppLayout, Sidebar, Topbar, ProtectedRoute
    common/     ImageUploader, GalleryUploader, RichTextField, DragSortList, PageHeaderBar, EmptyState,
                ConfirmDeleteButton, ErrorBoundary
  pages/        One folder per screen: Login, Dashboard, ProfileEditor, PagesSections, Projects, Skills,
                Experience, Education, Media, Messages, Settings
  types/api.ts  TypeScript types mirroring the backend DTOs exactly (source of truth: the backend code)
  router.tsx    Route table
```

## Notes / known caveats

- Auth: JWT access + refresh tokens held in `authStore` (persisted to localStorage). The Axios response
  interceptor transparently refreshes on a 401 once, then hard-redirects to `/login` if that also fails.
- The `Section.description` / `Project.description` rich text fields store HTML (from the Quill editor)
  — sanitize/escape appropriately wherever this is rendered on the public portfolio site later.
- Reordering: sections and projects have dedicated backend reorder endpoints. Skills/skill-categories and
  experience/education don't have bulk-reorder endpoints, so the admin issues one `PUT` per moved row
  instead — fine at this data scale, but worth a dedicated endpoint if these lists grow large.
- "Set as cover" on a project gallery image works by detaching and re-attaching that image (the backend
  has no dedicated set-cover endpoint) — functionally correct, but the `ProjectImage` row's `id` changes
  when you do this.
