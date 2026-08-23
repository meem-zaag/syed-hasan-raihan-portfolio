"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { frame, cancelFrame } from "motion-dom";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * Drives Lenis off Motion's own frame loop (rather than a second
 * requestAnimationFrame) so Framer Motion's scroll-linked values
 * (useScroll/useTransform) and Lenis's smoothing never fight over which one
 * "owns" the scroll position for a given frame - that mismatch is what
 * causes stutter when you bolt a smooth-scroll library on top of
 * scroll-driven animations without wiring them together.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });
    lenisRef.current = lenis;

    function update(frameData: { timestamp: number }) {
      lenis.raf(frameData.timestamp);
    }
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Lenis is mounted once here in the root layout and stays alive across
  // client-side route changes (a <Link> navigation doesn't remount this
  // provider), so its cached scroll-height limit keeps whatever the
  // PREVIOUS page measured. Navigating to a taller page left Lenis capping
  // scroll at the old page's height - scroll would stop partway down (e.g.
  // mid-way through the experience card stack) until a hard refresh
  // reinitialized Lenis against the new page. Re-measuring on every route
  // change fixes that without needing to tear Lenis down and rebuild it.
  useEffect(() => {
    const raf = requestAnimationFrame(() => lenisRef.current?.resize());
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return <>{children}</>;
}
