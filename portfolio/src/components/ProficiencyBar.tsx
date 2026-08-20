"use client";

import { motion } from "motion/react";

export function ProficiencyBar({ name, proficiency }: { name: string; proficiency: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">{proficiency}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-brand-from to-brand-to"
        />
      </div>
    </div>
  );
}
