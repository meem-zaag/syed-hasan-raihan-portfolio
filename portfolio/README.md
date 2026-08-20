# Portfolio — Spatial/3D Playground

Public portfolio site for Syed Hasan Raihan. Next.js (App Router) + TypeScript + Tailwind CSS +
Framer Motion + Three.js (`@react-three/fiber` / `@react-three/drei`), pulling Aceternity UI /
Magic UI-style techniques (tilt cards, index headings, scroll-driven reveals) hand-built for this
design rather than pasted in verbatim. Design brief: `../docs/PORTFOLIO_REDESIGN_BRIEF.md`.

Pure frontend — all content comes from the live public API of the Spring Boot backend
(`../backend`), managed through the admin CMS (`../admin`). Nothing here needs a local backend to
develop against; `.env.local` already points at the production API by default.

## Getting started

Requires **Node.js 20.9+** (Next.js 16 refuses to run on older versions — use `nvm use 22` or
similar if your default Node is older).

```bash
npm install
npm run dev
```

Open http://localhost:3000. Note: the live backend's `CORS_ALLOWED_ORIGINS` only allows
`localhost:3000` and `localhost:3005` for local dev — running on another port will fail contact-form
submissions and any other API call with a CORS error.

## Environment

- `.env.local` (gitignored): `NEXT_PUBLIC_API_BASE_URL` — defaults to the production backend so you
  can develop against real content immediately. Point it at `http://localhost:8080/api` if you're
  also running the backend locally.
- `.env.example` documents both.

## Design notes

- **3D layer**: `src/components/three/DepthField.tsx` is the actual WebGL scene (a cursor-reactive
  particle field), lazy-loaded via `next/dynamic({ ssr: false })` through
  `src/components/three/DepthFieldCanvas.tsx` so it never blocks initial content paint. It's swapped
  for a static CSS gradient when the visitor prefers reduced motion or is on a narrow (<768px)
  viewport — see `src/lib/useMediaQuery.ts` (uses `useSyncExternalStore`, not effect+setState, to
  satisfy React's purity/immutability lint rules under Next 16 / React 19).
- **Spatial tilt**: `src/components/TiltCard.tsx` is the reusable CSS-3D tilt wrapper used for
  project cards and the homepage index tiles — real `perspective`/`rotateX`/`rotateY` driven by
  cursor position via Framer Motion springs, not a WebGL cost per card.
- **Experience page**: `src/components/RoleStack.tsx` implements a scroll-driven sticky-stacking
  card layout instead of a classic vertical timeline.
- Palette/type tokens live in `src/app/globals.css` (`--signal` = the acid-lime accent, `--ember` =
  the secondary warm accent, `--font-display` = Bricolage Grotesque, `--font-mono` = Geist Mono for
  labels/meta text).

## Build

```bash
npm run build   # requires Node 20.9+
npm run lint
```
