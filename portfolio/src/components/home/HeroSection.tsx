"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { DepthFieldCanvas } from "@/components/three/DepthFieldCanvas";

export function HeroSection({
  heading,
  subheading,
  description,
}: {
  heading: string;
  subheading: string | null;
  description: string | null;
}) {
  return (
    <section className="relative flex min-h-[92vh] flex-col overflow-hidden">
      <div className="absolute inset-0">
        <DepthFieldCanvas />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-card/60 px-3.5 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
          </span>
          Available for new opportunities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="font-display max-w-4xl text-6xl font-medium leading-[0.98] tracking-tight text-balance text-foreground sm:text-7xl lg:text-8xl"
        >
          {heading}
        </motion.h1>

        {subheading && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl font-mono text-sm text-signal"
          >
            {subheading}
          </motion.p>
        )}

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground"
          >
            {description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-medium text-signal-foreground transition-transform hover:scale-[1.03]"
          >
            View my work
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-white/30"
          >
            Get in touch
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative mx-auto mb-8 hidden items-center gap-2 font-mono text-[11px] text-muted-foreground sm:flex"
      >
        <ArrowDown size={12} className="animate-bounce" />
        scroll
      </motion.div>
    </section>
  );
}
