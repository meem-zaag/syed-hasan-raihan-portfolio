"use client";

import { useEffect, useState } from "react";

/**
 * Resolves a CSS custom property (e.g. "--signal") to a concrete color
 * string Three.js can parse (THREE.Color understands rgb()/hex, but not
 * oklch() or var()). Re-resolves whenever the `<html>` class changes, so it
 * tracks the light/dark theme toggle.
 */
export function useThemeColor(varName: string, fallback: string) {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    const probe = document.createElement("span");
    probe.style.color = `var(${varName})`;
    probe.style.display = "none";
    document.body.appendChild(probe);

    const resolve = () => {
      const resolved = getComputedStyle(probe).color;
      if (resolved) setColor(resolved);
    };

    resolve();
    const observer = new MutationObserver(resolve);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      probe.remove();
    };
  }, [varName]);

  return color;
}
