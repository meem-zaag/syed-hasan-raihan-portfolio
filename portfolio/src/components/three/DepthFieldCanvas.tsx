"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/useMediaQuery";

const DepthField = dynamic(() => import("./DepthField"), { ssr: false });

/**
 * Renders the WebGL node field, but only once we know the visitor doesn't
 * prefer reduced motion and isn't on a small/low-power viewport — those get
 * a cheap static gradient instead so the 3D scene is never forced on them.
 */
export function DepthFieldCanvas() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isSmall = useMediaQuery("(max-width: 767px)");

  if (reducedMotion || isSmall) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, var(--signal-glow), transparent 70%)",
        }}
      />
    );
  }

  return <DepthField />;
}
