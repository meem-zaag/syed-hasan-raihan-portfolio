# Portfolio Redesign Brief — Spatial/3D Playground Direction

This **replaces** the first attempt at `/portfolio` (still in git history if ever needed — do not
worry about preserving its code, just don't feel bound by its structure or component choices). The
user rejected it on every axis: too generic/templatey, animations felt bolted-on rather than
choreographed, the layout structure itself, and the color/mood. Read that as full creative license to
rebuild, not a small iteration.

## 1. Direction: Spatial / 3D Playground

The user picked this explicitly, described as: "WebGL/Three.js elements, cursor-reactive scenes,
physics-ish draggable project cards, depth + parallax. The most experimental/awwwards-style option."
This is the ambitious, higher-risk-higher-reward direction — lean into that. Concrete ideas (use
judgment on which combination actually works well together, don't force every single one in):
- A hero with a real 3D scene (react-three-fiber + drei is the standard, well-supported way to do
  Three.js in React/Next.js) that reacts to cursor movement — parallax layers, an object that tracks
  the pointer, or a particle field that responds to mouse velocity.
- Project cards that feel spatial/tactile — depth via layered shadows/perspective transforms and/or
  actual 3D card meshes, draggable or tilt-on-hover (e.g. a tilt/3D-hover effect keyed to cursor
  position, not just a flat `scale` hover).
- Scroll-driven camera/scene movement (moving through a 3D space as the user scrolls) is a strong
  "innovative" signal if it can be done smoothly — but only if performance holds up, see §4.
- This person is a real frontend/motion engineer (GSAP + Framer Motion background per their own CV) —
  the site should read as a demonstration of that skill, not a generic template with a 3D hero bolted
  onto otherwise ordinary sections. Carry the spatial/depth language through multiple sections, not
  just the hero.

## 2. What to fix from the rejected attempt (explicit avoid-list)

- **Too generic/templatey**: avoid the "dark hero + gradient CTA pill + card grid" look entirely —
  that was the exact complaint. Don't reach for the most common Aceternity/Magic UI combinations
  (Spotlight hero, generic bento grid) as a crutch.
- **Motion felt bolted-on**: every animation should feel choreographed and intentional — coordinated
  timing/easing across elements, not independent fade-ins scattered per component. Consider a shared
  motion/easing system (consistent spring config, staggered reveal timing) rather than ad-hoc
  `whileInView` fades everywhere.
- **Layout structure itself was wrong**: don't just re-skin the same hero → featured-projects →
  timeline → skills-marquee → contact page flow with new colors. Rethink the actual structure and
  pacing of the page, section-by-section — a spatial/3D-driven site earns a different structural
  rhythm than a standard SaaS-landing-page flow.
- **Color/mood wrong**: move away from the indigo/purple gradient-on-black look. Pick a genuinely
  considered palette for the new direction (could still be dark-mode-first given the 3D/experimental
  direction usually reads better dark, but choose specific, intentional colors — not a generic
  purple-to-pink gradient).

## 3. What stays the same (don't rebuild this part)

- Backend integration: same live public API (`https://portfolio-backend-68bh.onrender.com/api`), same
  pages/routes mapped to the same `Page` slugs, same data-fetching contract. Reuse or rewrite the
  `api`/`types` layer as needed but there's no reason to change what data is fetched or from where —
  read the current implementation under `portfolio/src` for the existing fetch functions/types before
  deciding what to keep vs. rewrite.
- Stack: still Next.js (App Router) + TypeScript + Tailwind. Add `three`, `@react-three/fiber`,
  `@react-three/drei` (and `@react-three/rapier` or similar only if actually doing physics — don't add
  it speculatively). Framer Motion still owns 2D/DOM motion; Three.js/R3F owns the 3D layer.
- All 7 pages still need to exist: home, about, projects (+ detail), experience, education, skills,
  contact (contact form still posts to `/api/public/contact` — this was verified working, don't break
  it).
- SEO setup (`generateMetadata`, sitemap, robots) — keep this working, it's orthogonal to the visual
  redesign.

## 4. Performance — this is not optional, it's the other half of why this brief exists

The user's other complaint this round was that the deployed site felt slow. Two real causes were
diagnosed: (a) the free-tier backend's cold start (now mitigated separately via a keep-warm ping — not
your concern), and (b) ~788KB of client JS on the homepage contributing to slow hydration/interaction.
A 3D-heavy redesign makes (b) *worse* by default unless you're deliberate:
- **Code-split the 3D scene.** Use `next/dynamic` with `ssr: false` to lazy-load the Three.js/R3F
  canvas so it never blocks initial HTML/content paint — the page's real content (name, title, nav)
  should be visible immediately even before the 3D layer finishes loading.
- **Respect `prefers-reduced-motion`** and provide a real fallback (a static/lightly-animated version)
  for that case and for low-end devices — don't force a heavy 3D scene on everyone unconditionally.
- **Keep the Three.js scene itself lean** — reasonable geometry complexity, don't import a huge GLTF
  model as a placeholder-quality asset; procedural/primitive-based scenes (particles, simple geometry,
  shader-driven backgrounds) are usually both more performant and more "unique" than a stock 3D model.
- **Parallelize data fetching.** Check the current implementation for sequential/waterfalled `fetch`
  calls (e.g. profile fetched in layout, then each page fetching its own data separately in sequence)
  and use `Promise.all`/parallel fetches wherever multiple independent API calls happen on one page.
- Re-run a rough JS payload check before calling this done (see §6) — the goal isn't a specific byte
  target, but don't regress further than necessary for what the 3D direction actually requires.

## 5. Scope boundaries — read this carefully, it matters

The previous portfolio-build agent went outside its mandate last time: it deleted and recreated the
production Render backend service and cascaded redeploys to fix a CORS issue, without authorization.
That must not happen again.

- **Do NOT touch `/backend`, `/admin`, or any deployed infrastructure.** CORS is already correctly
  configured on the live backend for `http://localhost:3000` and `http://localhost:3005` (local dev)
  and the production admin/portfolio origins — you should not need any backend changes at all. If you
  genuinely believe a backend change is needed, STOP and report back instead of making it yourself.
- **Do NOT deploy to Vercel yourself, and do NOT run any Vercel CLI commands.** Verify locally via
  `npm run dev`/`npm run build` only. Deployment is handled separately, after this build is reviewed.
- **Do NOT touch git config, repo visibility, or any account/service settings.**
- **Do NOT commit or push to git.** Leave that for review.
- You may and should test against the live production backend from your local dev server (that's the
  existing, working pattern) — this is read-only API consumption, not an infrastructure change.

## 6. Verification before declaring done

1. `npm run build` succeeds with zero errors.
2. `npm run dev`, click through every route confirming real production data still renders correctly.
3. Confirm the contact form still submits successfully against production (then let me know so I can
   clean up the test message, or clean it up yourself the same way — read `docs/PORTFOLIO_BRIEF.md`
   §9's original verification approach if you need the pattern).
4. Check the homepage's approximate JS payload isn't wildly larger than necessary (rough sanity check,
   not a hard gate — flag the number in your report either way).
5. Confirm `prefers-reduced-motion` fallback actually works (emulate it in dev tools).
6. Check responsive behavior at mobile width — a 3D scene needs a deliberate mobile treatment (simplify
   or replace it, don't just let a desktop-tuned WebGL scene run unmodified on a phone).
7. Update `portfolio/README.md` if the setup/run instructions changed at all.

Report back concretely: what the new design actually is (section by section), which 3D/motion
techniques you used and why, the verification results, the JS payload finding, and any deviations from
this brief and why. Skip routine narration.
