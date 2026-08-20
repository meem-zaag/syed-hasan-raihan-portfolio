# Portfolio Site Implementation Brief — Next.js (Phase 2)

Authoritative spec for `/portfolio`, the public-facing site. The backend and admin CMS are already
live in production — this app is a pure consumer of the public API, zero new backend work.

**No design screenshots exist yet.** Build a tasteful, modern, motion-rich default design now
(explicitly approved by the user) using the mandated stack. Structure it so re-skinning
section-by-section later (once real screenshots arrive) is cheap — clean component boundaries per
section, no deeply nested one-off styling.

## 1. Live backend reference (already deployed, do not modify)

- Base URL: `https://portfolio-backend-p835.onrender.com/api`
- Full public API (no auth) — read the actual DTOs under
  `/home/sraihan/Documents/outsource/Syed_Hasan_Raihan_Protfolio/backend/src/main/java/com/syedhasanraihan/portfolio/controller/publicapi/`
  and their response DTOs before writing fetch/type code — this doc describes intent, the backend
  source is the contract:
  - `GET /public/profile` — name, title, tagline, bio, contact/social links, avatar/resume media
  - `GET /public/pages/{slug}` — page meta + its ordered, visible sections (heading/subheading/
    description/images) for slugs: `home`, `about`, `projects`, `experience`, `education`, `skills`,
    `contact`
  - `GET /public/projects?category=&featured=` — ordered project list; `GET /public/projects/{slug}`
    for detail
  - `GET /public/skills` — grouped by category, ordered
  - `GET /public/experience` / `GET /public/education` — ordered
  - `GET /public/settings` — SEO defaults (title/description), theme accent color
  - `POST /public/contact` — `{name, email, subject?, message}`, validated server-side too
- Media URLs returned by the API are already absolute (Cloudflare R2 public URLs) — use directly in
  `next/image` (configure `remotePatterns` for the R2 `*.r2.dev` host).

## 2. Stack (per root spec)

Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Magic UI components, Aceternity UI
components. **No antd, no React Query, no Zustand here** — those are admin-only. Data fetching is
native `fetch` in Server Components; the contact form is the only client-side mutation.

Magic UI and Aceternity UI are both copy-in component libraries (shadcn-style — components get added
to the repo as source, not installed as an opaque npm dependency). Pull in components via their
respective CLIs/registries as needed rather than hand-rolling equivalents:
- Aceternity UI: https://ui.aceternity.com (copy-paste or `shadcn` CLI registry commands)
- Magic UI: https://magicui.design (has its own CLI: `npx shadcn@latest add "https://magicui.design/r/{component}.json"`)

Use them purposefully, not decoratively — a few well-placed pieces (e.g. a spotlight/aurora hero
background, a bento-grid or hover-effect card layout for projects, a timeline component for
experience, a marquee or animated tech-stack strip for skills, sparkles/text-reveal for headings)
beats stacking every effect on one page.

## 3. Pages (map 1:1 to the seeded `Page` slugs)

- `/` (home) — hero (name, title/tagline, short bio excerpt, CTA to projects/contact, avatar), a
  featured-projects teaser, quick skills strip, CTA footer section. Pull hero copy from the `home`
  page's sections where present, falling back to `/public/profile` fields.
- `/about` — fuller bio, background, personal narrative section(s) from the `about` page's sections.
- `/projects` — full project grid/list with category filter (client-side, from already-fetched data —
  no need for query params/reload), each linking to a detail view.
- `/projects/[slug]` — project detail: gallery, description, tech stack tags, live/repo links,
  client/category/date.
- `/experience` — timeline of work history from `/public/experience`.
- `/education` — list from `/public/education`.
- `/skills` — grouped skill display from `/public/skills` (per category, with proficiency shown
  visually — bars/rings/tags, not raw numbers).
- `/contact` — contact form (name/email/subject/message) posting to `/public/contact`, plus profile
  contact/social info. Client component for the form; the rest of the page can stay a Server Component.

Shared layout: persistent nav (links to all pages, active-state styling) + footer (social links from
profile, copyright). Both read from `/public/profile` once at the layout level.

## 4. SEO

Use Next.js `generateMetadata` per route: prefer that page's own `metaTitle`/`metaDescription` from
`/public/pages/{slug}`, falling back to `/public/settings` site-wide defaults, falling back to a
sensible hardcoded default. Add basic Open Graph tags (title, description, and the profile avatar or a
project image as the OG image where sensible). Add a `sitemap.ts` and `robots.ts` (Next.js App Router
conventions) covering all the routes above.

## 5. Data freshness

Content is admin-editable and can change anytime. Use `fetch(..., { next: { revalidate: 60 } })` for
page/profile/project/skill/experience/education reads (ISR — fresh within a minute, still fast/cached
for a low-traffic personal site). The contact POST is obviously always a live client-side call, never
cached.

## 6. Non-functional

- Fully responsive (mobile-first), keyboard-navigable, reasonable color contrast even in a dark/motion
  -heavy design — don't sacrifice basic accessibility for visual flair.
- Loading states: use Next.js `loading.tsx`/Suspense boundaries or skeleton placeholders consistent
  with the motion-rich aesthetic (not jarring blank flashes).
- Handle empty states gracefully (e.g. a page with no sections yet, zero projects) — never render a
  broken-looking blank page; fall back to profile-derived content or a minimal placeholder.
- Contact form: client-side validation + clear success/error feedback (no antd — build a small toast/
  inline message with Tailwind + Framer Motion, or a minimal accessible custom component).
- `next/image` configured for the R2 public host; sensible `sizes`/`priority` usage on above-the-fold
  images.

## 7. Config

- `.env.local` (gitignored) + `.env.example` (committed): `NEXT_PUBLIC_API_BASE_URL` (client-safe,
  since Server Components can also read it directly) `=https://portfolio-backend-p835.onrender.com/api`
  for production; note in `.env.example` that local dev should point at `http://localhost:8080/api`.
- No secrets belong in this app — it only ever calls public, unauthenticated endpoints.

## 8. Deployment target: Vercel

- Hosted on Vercel (free Hobby tier, already being authenticated via `vercel login` in parallel with
  this build). Deploy via the Vercel CLI (`vercel --prod`) from `/portfolio` once the build is verified
  locally — don't wait on a GitHub integration for the first deploy, CLI deploy is sufficient.
- Set `NEXT_PUBLIC_API_BASE_URL` as a Vercel project environment variable pointing at the live Render
  backend URL above.
- Root directory for the Vercel project is `portfolio/` (monorepo — same pattern as the backend/admin
  services already set up on Render/Cloudflare).

## 9. Verification before declaring done

1. `npm run build` succeeds with zero errors.
2. `npm run dev`, click through every route in §3 confirming real seeded data renders (profile, 7
   pages'/sections' content, 4 seeded projects, 4 skill categories, 4 experience entries, 3 education
   entries) — this is hitting the **live production backend**, not a local one, so no backend setup
   needed for this step.
3. Submit the contact form for real against the live backend and confirm it succeeds (check
   `/api/admin/messages` afterward if you have a way to, or just confirm the client-side success state
   and a 201/200 response — don't worry about verifying the admin inbox side, that's already proven
   working).
4. Confirm responsive layout at a mobile width and a desktop width (browser resize or dev tools).
5. Write a short `portfolio/README.md`: how to configure `.env.local`, how to run, and a link back to
   this brief.
