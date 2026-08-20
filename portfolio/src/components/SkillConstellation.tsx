"use client";

import { motion } from "motion/react";
import type { SkillCategory } from "@/lib/types";

function sizeForProficiency(p: number) {
  if (p >= 85) return "text-base px-4 py-2";
  if (p >= 65) return "text-sm px-3.5 py-1.75";
  return "text-xs px-3 py-1.5";
}

export function SkillConstellation({ categories }: { categories: SkillCategory[] }) {
  return (
    <div className="space-y-14">
      {categories.map((category, ci) => (
        <div key={category.id}>
          <div className="mb-5 flex items-baseline gap-3">
            <span className="font-mono text-xs text-signal">
              {String(ci + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-lg font-medium text-foreground">
              {category.name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {category.skills.map((skill, si) => (
              <motion.span
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: si * 0.03 }}
                whileHover={{ y: -3, borderColor: "var(--signal)" }}
                className={`rounded-full border border-foreground/10 bg-card/70 font-mono text-foreground transition-colors ${sizeForProficiency(
                  skill.proficiency
                )}`}
                style={{ opacity: 0.55 + (skill.proficiency / 100) * 0.45 }}
              >
                {skill.name}
              </motion.span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
