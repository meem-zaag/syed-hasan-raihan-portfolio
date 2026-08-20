# Portfolio Revision Brief — Round 2 Refinements

The Spatial/3D Playground *direction* from the last rebuild is approved and should stay — this is a
targeted refinement pass, not another full redesign. Five concrete, specific pieces of feedback to
address:

## 1. Replace the lime/green accent — warm coral/amber

User explicitly rejected the lime/acid-green accent. Replace it with a warm coral/amber accent across
the whole site. Starting direction (tune for actual contrast/accessibility in context, these are a
starting point not a hard spec): something like `#FF6B4A`–`#FF7A50` coral for dark mode (needs to pop
against a warm charcoal background), and a slightly deeper/more saturated variant (e.g. `#E85D3D`–
`#D9502F`) for light mode so it doesn't wash out against a light background. Audit every current use of
the old `--signal`/lime token (buttons, links, index numbers, glows, the hero particle field's color,
focus states, etc.) — this needs to be a real token swap, not a partial one.

## 2. Light theme + dark theme toggle

Currently dark-only. Add a real light theme and a toggle (navbar, accessible, persists choice). Use
`next-themes` (the standard for this in Next.js App Router — handles system-preference detection,
persisted choice, and no-flash-of-incorrect-theme via its script injection) rather than hand-rolling
theme state. This means designing an actual **light palette**, not just inverting the dark one —
background/foreground/card/border/muted tokens need real design attention in light mode (check
contrast, don't just flip black↔white and call it done). The existing CSS custom property setup
(check `globals.css` and `components.json` — this looks like it's already using CSS-variable-based
theming from a shadcn-style setup) should make this a matter of defining a second token set and
switching the root class, not a rewrite of every component.

Apply the coral/amber accent from §1 consistently across both themes (it can shift shade between
light/dark for contrast reasons, but should read as "the same accent," not two different colors).

## 3. Install Lenis smooth scroll

Add `lenis` (npm package `lenis`, the current name — not the old `@studio-freight/lenis`). Wrap the app
in a Lenis provider/instance so all scrolling gets that smooth/weighted feel. **Critical**: this needs
to correctly integrate with whatever drives the scroll-linked animations in §4 below —
- If staying with Framer Motion's `useScroll`, Lenis's scroll position needs to feed Framer Motion's
  scroll tracking correctly (Framer Motion's `useScroll` can target a custom scroll container/value —
  don't end up with two independent scroll systems fighting each other, which causes exactly the kind
  of janky transition being complained about in §4).
- If moving the experience section to GSAP ScrollTrigger (a legitimate choice for §4, see below), Lenis
  has a documented GSAP integration pattern: drive Lenis's RAF loop from `gsap.ticker` instead of
  Lenis's own internal RAF, and call `ScrollTrigger.update` on Lenis's `scroll` event. Get this right —
  a mismatched Lenis+ScrollTrigger setup is a common source of exactly the kind of stuttery scroll
  animation being complained about here.

## 4. Fix the Experience section transition — concept is good, execution isn't

User's own words: "the idea is good. the transition is not. let's make it more smooth with framer
motion or gsap." The current sticky-stacking-cards concept (`RoleStack.tsx` or wherever it currently
lives) should stay conceptually, but the actual motion needs to feel smooth and premium — not
discrete/jumpy. Diagnose what's actually causing the jank before just re-implementing blindly (check:
is it un-eased linear interpolation from `useTransform`? Missing spring/damping? A scroll-container
mismatch once Lenis is added? Are transforms happening on properties that aren't GPU-accelerated?).
GSAP ScrollTrigger with `scrub` is a genuinely strong fit for this exact "pin and reveal on scroll"
pattern if Framer Motion tuning doesn't get it smooth enough — use your judgment on which tool actually
delivers the smoothest result, the user explicitly said either is fine, they care about the outcome.

## 5. Redo the hero 3D scene — "they are just simple squares," want something more creative

The current particle field reads as default/unstyled — almost certainly `THREE.Points` with the
default square sprite (a very common Three.js beginner artifact: `PointsMaterial` without a custom
sprite texture renders flat squares). This needs real creative attention, not just a quick texture
swap, though that alone would already help. Consider (pick a direction and commit to it, don't
half-do several):
- **Soft glowing orbs**: circular/soft-edged sprite texture (radial gradient alpha) instead of hard
  squares, ideally with some bloom/glow post-processing (`@react-three/postprocessing`'s `Bloom` is the
  standard way to do this with R3F) for a premium feel.
- **A generative form instead of a flat particle field**: e.g. a noise-displaced/distorted sphere or
  blob that reacts to the cursor, or a flowing curve/ribbon system — something with actual sculptural
  presence rather than a cloud of dots.
- **Cursor-reactive distortion**: whatever the base form, make the cursor interaction feel more
  intentional than simple drift/parallax — real attraction/repulsion, velocity-based distortion, etc.

Whatever direction you pick, it still needs to respect the existing brief's performance requirements —
code-split via `next/dynamic({ssr:false})`, `prefers-reduced-motion` fallback, deliberate (probably
simplified or replaced) mobile treatment. Don't regress the JS payload work from the last round without
good reason.

## Scope boundaries (same as last time, still non-negotiable)

- Do NOT touch `/backend`, `/admin`, or any deployed infrastructure, git config, repo settings.
- Do NOT deploy to Vercel yourself, do NOT commit/push to git. Verify locally only
  (`npm run dev`/`npm run build`). I'll review and deploy to a **preview URL first** this round before
  touching production, given the last two rounds both needed revisions.
- Test against the live production backend from local dev, same as before — that's fine, it's
  read-only API consumption.

## Verification before declaring done

1. `npm run build` clean.
2. `npm run dev`, verify: the coral/amber accent is applied everywhere (no lime/green remnants
   anywhere), the theme toggle actually works and both themes look genuinely designed (not just
   inverted), Lenis is active and feels smooth, the experience section transition is visibly smoother
   (describe what you changed and why it's smoother, don't just assert it), the new hero scene loads
   and looks meaningfully more creative than flat squares.
3. Confirm real production data still renders on every route (should be unaffected, but confirm).
4. Confirm `prefers-reduced-motion` still has a real fallback for the new hero scene.
5. Rough JS payload sanity check, same as last round — report the number either way.

Report back concretely: what you changed for each of the 5 numbered items above and why, verification
results, the JS payload number, and any deviations from this brief and why.
