"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

const DepthField = dynamic(() => import("./DepthField"), { ssr: false });

const FALLBACK_GRADIENT = (
  <div
    className="absolute inset-0"
    style={{
      background:
        "radial-gradient(60% 50% at 50% 40%, var(--signal-glow), transparent 70%)",
    }}
  />
);

/**
 * Renders the WebGL node field, but only once we know the visitor doesn't
 * prefer reduced motion and isn't on a small/low-power viewport — those get
 * a cheap static gradient instead so the 3D scene is never forced on them.
 *
 * The Canvas's render loop runs every frame for as long as it's mounted, so
 * it's gated behind an IntersectionObserver too — otherwise it keeps
 * animating (and running Bloom post-processing) for the rest of the session
 * even after the hero has scrolled out of view, competing with the page's
 * own scroll/animation work for the same frame budget.
 */
export function DepthFieldCanvas() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isSmall = useMediaQuery("(max-width: 767px)");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      // Rendering resumes a little before the hero re-enters the viewport
      // (scrolling back up) so it isn't visibly popping in.
      { rootMargin: "200px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (reducedMotion || isSmall) {
    return FALLBACK_GRADIENT;
  }

  return (
    <div ref={wrapperRef} className="absolute inset-0">
      {inView ? <DepthField /> : null}
    </div>
  );
}
