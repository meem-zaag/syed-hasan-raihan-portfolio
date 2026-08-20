# Admin App Implementation Brief — React CMS

Authoritative detailed spec for `/admin`. Read this alongside `docs/BACKEND_BRIEF.md`. **Before writing
any API-calling code, read the actual backend DTO/controller source under `/backend/src/main/java/.../
dto` and `.../controller`** for exact field names and endpoint paths — don't guess field names from this
doc, the backend is the source of truth for the contract; this doc governs UX/structure/behavior.

## 1. Project setup

- Vite + React 18 + TypeScript. `npm create vite@latest admin -- --template react-ts` (run from repo
  root so it lands in `/admin`), or hand-scaffold equivalently if that's cleaner.
- Dependencies: `antd` (v5), `tailwindcss` (v3, configured to coexist with antd — see §2), `@tanstack/
  react-query` (v5) + `@tanstack/react-query-devtools` (dev only), `zustand`, `react-router-dom` (v6),
  `axios`, `framer-motion`, `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` (drag-to-
  reorder), `dayjs` (antd's date lib), `react-quill-new` (rich text editor for section/project
  descriptions — a maintained React 18-compatible fork of react-quill).
- `.env` (gitignored) + `.env.example` (committed): `VITE_API_BASE_URL=http://localhost:8080/api`.
- `npm run build` and `npm run dev` must both work cleanly (no TS errors) before calling this done.

## 2. Tailwind + antd coexistence

Both are mandated. Convention: **antd owns components** (Form, Table, Modal, Drawer, Upload, Button,
etc. — don't rebuild what antd already provides well); **Tailwind owns layout/spacing/custom bits**
(page containers, flex/grid scaffolding, custom cards, one-off utility styling). Configure Tailwind's
`corePlugins.preflight: false` (or scope resets carefully) so it doesn't fight antd's base styles.
Use antd's `ConfigProvider` for a shared theme token (primary color, border radius, font) so both
systems visually agree.

## 3. App structure

```
admin/src/
  api/            axios instance (client.ts) + one file per resource (authApi.ts, profileApi.ts,
                  pagesApi.ts, projectsApi.ts, skillsApi.ts, experienceApi.ts, educationApi.ts,
                  mediaApi.ts, messagesApi.ts, settingsApi.ts, dashboardApi.ts)
  hooks/          one file per resource with React Query hooks (queries + mutations), e.g.
                  useProjects.ts exporting useProjectsQuery, useCreateProject, useUpdateProject,
                  useDeleteProject, useReorderProjects
  store/          authStore.ts (zustand + persist: accessToken, refreshToken, user, login/logout
                  actions), uiStore.ts (sidebar collapsed, active theme, etc. — UI-only state)
  components/     layout/ (AppLayout, Sidebar, Topbar, ProtectedRoute), common/ (ImageUploader,
                  GalleryUploader, RichTextField, DragSortList, PageHeader, EmptyState,
                  ConfirmDeleteButton, LoadingSkeletons)
  pages/          Login, Dashboard, ProfileEditor, PagesSections, Projects, Skills, Experience,
                  Education, Media, Messages, Settings — one folder per screen, colocate
                  screen-specific subcomponents
  types/          TS interfaces mirroring backend DTOs (derive from actual backend source, see above)
  router.tsx, App.tsx, main.tsx
```

## 4. Auth & data-fetching conventions (non-negotiable, matches root spec §8)

- Centralized Axios instance: request interceptor attaches `Authorization: Bearer <accessToken>` from
  the Zustand auth store; response interceptor catches 401, attempts one silent refresh via
  `/api/auth/refresh`, retries the original request once, and if refresh also fails, clears the store
  and hard-redirects to `/login`.
- React Query owns **all** server state — every resource above gets query/mutation hooks; every
  mutation invalidates the relevant query key(s) on success (e.g. creating a section invalidates that
  page's sections list; uploading media invalidates the media library list).
- Zustand owns **only** client/UI state — auth tokens + user, sidebar collapsed, active table
  filters, in-progress form drafts if needed. Never mirror server data into Zustand.
- Wrap the app in a `QueryClientProvider`; set a `QueryCache`/`MutationCache` `onError` that fires an
  antd `notification.error` for any otherwise-unhandled query/mutation error, so no failure is silent.

## 5. Layout & motion

- Sidebar (collapsible antd `Menu`, icons from `@ant-design/icons`) + Topbar (breadcrumb reflecting
  current section, admin username, logout dropdown). Responsive: sidebar collapses to icon-only below
  ~1024px, and to an off-canvas Drawer below tablet width.
- Route transitions: wrap the routed `Outlet` in framer-motion `AnimatePresence`/`motion.div` (fade +
  slight vertical slide, ~150–200ms) keyed by route path.
- List add/remove (section cards, project cards, gallery thumbnails): animate with framer-motion
  `AnimatePresence` + `layout` prop so items smoothly reflow on add/delete/reorder.
- Modals/Drawers: antd's built-in transitions are enough — don't fight them with framer-motion.
- Every create/update/delete and every error surfaces an antd `message` or `notification`. Use
  `Skeleton` (antd) for loading states on lists/tables/detail panels instead of spinners, wherever a
  reasonable skeleton shape applies.

## 6. Screens

1. **Login** — centered antd `Form` (username, password), subtle animated background, submits to
   `/api/auth/login`, on success populates the auth store and redirects to `/dashboard`. Show a clear
   error message on 401.
2. **Dashboard** — antd `Statistic` cards from `/api/admin/dashboard/summary` (unread messages, total
   projects, total sections, total media), a "last edited section" card linking straight into the
   Page/Section builder for that page, and a persistent info card: *"Your CV only lists a subset of
   your projects — add the rest here."* linking to the Projects screen (this satisfies the seed-data
   TODO called out in the backend brief — it's admin chrome, not fabricated portfolio content).
3. **Profile editor** — one antd `Form` for every `Profile` field (name, title, tagline, bio as
   `RichTextField` or `TextArea`, email, phone, location, social URLs with icon prefixes), plus an
   `ImageUploader` for avatar and a file `Upload` for resume (PDF). Autosave is not required — explicit
   Save button, disabled while pristine.
4. **Page & Section builder (core CMS screen)** — a page selector (antd `Tabs` or `Segmented`, one per
   `Page` slug) driving a `DragSortList` (dnd-kit) of that page's `Section`s. Each section row shows
   heading/order/visible-toggle/edit/delete. Editing opens a Drawer form: heading, subheading,
   description (`RichTextField`), section type select, visible switch, and a `GalleryUploader` for the
   section's images. Reordering persists via the reorder endpoint (optimistic update + rollback on
   error is a nice touch, not required).
5. **Projects manager** — antd `Table` or responsive card grid, with search + category filter + a
   featured-only toggle. Row actions: edit (Drawer/Modal form: title, auto-slugging from title with a
   manual-override field, summary, description as `RichTextField`, client name, category, status
   select, repo/live URLs, tech-stack tags via `Select mode="tags"`, start/end `DatePicker`s with an
   "ongoing" checkbox that clears end date, featured `Switch`), delete (confirm), reorder (drag handle
   or a numeric order field), and a `GalleryUploader` supporting multiple images + "set as cover".
6. **Skills manager** — two-level UI: manage `SkillCategory` rows (name, order) and, nested under each,
   its `Skill` rows (name, proficiency as an antd `Slider` 0–100, icon as a text input, order). Support
   drag reorder within a category and reordering categories themselves.
7. **Experience manager** — list + Drawer form: company, role, location, start/end `DatePicker` (a
   "currently working here" checkbox clears end date), description as a multi-line textarea (one bullet
   per line — render as a bullet list on the public site later), optional company logo `ImageUploader`,
   reorder.
8. **Education manager** — list + Drawer form: institution, degree, field, start/end dates (respect
   `date_precision` — offer a "year only" toggle that switches the picker to a year-only mode),
   optional description, reorder.
9. **Media library** — responsive thumbnail grid of all `Media`, search box, content-type filter, an
   "Unused" badge when `linkedEntityType`/`linkedEntityId` is null, delete with a confirm that warns if
   the item is currently referenced somewhere. Drag-and-drop upload zone at the top.
10. **Contact inbox** — antd `Table`/`List` of `ContactMessage`s (name, email, subject, snippet, unread
    bold/badge), row click opens a Drawer with the full message and mark-read/unread + delete actions.
    Support an "unread only" filter.
11. **Settings** — SEO defaults form (default title/description) + theme accent color via antd
    `ColorPicker`. Lowest priority — fine to keep minimal.

## 7. Non-functional

- Validate every form with antd `Form` `rules` mirroring the backend's Bean Validation constraints
  (required fields, email format, max lengths, URL format where applicable) — don't rely on backend
  validation alone.
- Add a small React error boundary around the routed content so a render error shows a friendly fallback
  instead of a blank screen.
- Keep this admin app entirely decoupled from any future Next.js portfolio styling — it has its own
  identity (modern SaaS-dashboard aesthetic), not a preview of the public site.

## 8. Verification before declaring done

1. `npm install`, `npm run build` succeeds with no TypeScript errors.
2. `npm run dev`, confirm the login screen renders.
3. With the backend running and seeded, log in with the seeded admin credentials from
   `backend/README.md`, and click through every screen in §6 confirming data loads (dashboard numbers,
   profile fields, sections per page, seeded projects/skills/experience/education, empty media/messages
   states render sensibly).
4. Exercise at least one full create → edit → delete round trip on one resource (e.g. a Section) end to
   end against the real backend, confirming toasts fire and lists update without a manual refresh.
5. Write a short `admin/README.md`: how to configure `.env`, how to run, and a link back to this brief.
