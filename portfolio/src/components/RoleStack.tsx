"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { MapPin } from "lucide-react";
import type { Experience } from "@/lib/types";

// Shared spring config so every card settles with the same weight - this is
// what actually makes the stack feel choreographed instead of each card
// snapping straight to its raw scroll-progress value.
const SPRING = { stiffness: 220, damping: 32, mass: 0.6 } as const;

function formatRange(start: string | null, end: string | null) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return `${start ? fmt(start) : "—"} — ${end ? fmt(end) : "Present"}`;
}

function RoleCard({
  exp,
  index,
  total,
}: {
  exp: Experience;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // A longer offset range (rather than a short "just entering" window) gives
  // the card more scroll distance to travel across, so the motion reads as a
  // gradual settle rather than a snap the instant it reaches the top.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88%", "start 20%"],
  });
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const rawOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const rawY = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const rawBlur = useTransform(scrollYProgress, [0, 1], [6, 0]);

  const scale = useSpring(rawScale, SPRING);
  const opacity = useSpring(rawOpacity, SPRING);
  const y = useSpring(rawY, SPRING);
  const blur = useSpring(rawBlur, SPRING);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  const lines = (exp.description ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top: `${96 + index * 18}px`, zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale, opacity, y, filter }}
        className="mb-6 rounded-2xl border border-foreground/10 bg-card/90 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {exp.companyLogo?.url ? (
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5">
                <Image
                  src={exp.companyLogo.url}
                  alt={exp.company}
                  fill
                  sizes="48px"
                  className="object-contain p-1.5"
                />
              </div>
            ) : (
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            )}
            <div>
              <h3 className="font-display text-xl font-medium text-foreground">
                {exp.role}
              </h3>
              <p className="text-sm text-signal">{exp.company}</p>
              {exp.location && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={12} /> {exp.location}
                </p>
              )}
            </div>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {formatRange(exp.startDate, exp.endDate)}
          </span>
        </div>

        {lines.length > 0 && (
          <ul className="mt-5 space-y-2.5 border-t border-foreground/10 pt-5">
            {lines.map((line, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-signal" />
                {line}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}

export function RoleStack({ experience }: { experience: Experience[] }) {
  return (
    <div className="relative">
      {experience.map((exp, i) => (
        <RoleCard key={exp.id} exp={exp} index={i} total={experience.length} />
      ))}
    </div>
  );
}
