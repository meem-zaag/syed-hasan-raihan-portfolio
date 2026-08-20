"use client";

import { useEffect, useRef } from "react";
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

  return <>{children}</>;
}
