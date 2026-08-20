import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { DotPattern } from "@/components/ui/dot-pattern";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Reveal } from "@/components/Reveal";
import type { Profile } from "@/lib/types";

export function Hero({
  profile,
  heading,
  subheading,
  description,
}: {
  profile: Profile | null;
  heading: string;
  subheading: string | null;
  description: string | null;
}) {
  return (
    <section className="relative overflow-hidden">
      <Spotlight />
      <DotPattern
        glow
        className="absolute inset-0 -z-10 [mask-image:radial-gradient(650px_circle_at_center,white,transparent)] opacity-60"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-28 text-center sm:py-36">
        <Reveal>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <AnimatedShinyText className="text-xs font-medium">
              Available for new opportunities
            </AnimatedShinyText>
          </div>
        </Reveal>

        {profile?.avatar?.url && (
          <Reveal delay={0.05} className="mb-8">
            <div className="relative size-24 overflow-hidden rounded-full border-2 border-white/10 shadow-[0_0_40px_-10px_var(--brand-from)] sm:size-28">
              <Image
                src={profile.avatar.url}
                alt={profile.avatar.altText ?? profile.fullName}
                fill
                sizes="112px"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            {heading}
          </h1>
        </Reveal>

        {subheading && (
          <div className="mt-5 max-w-2xl">
            <TextGenerateEffect
              words={subheading}
              className="text-base font-normal text-muted-foreground sm:text-lg"
              duration={0.4}
            />
          </div>
        )}

        {description && (
          <Reveal delay={0.3}>
            <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.4} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/projects"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-from to-brand-to px-6 py-3 text-sm font-medium text-white shadow-[0_0_30px_-8px_var(--brand-to)] transition-transform hover:scale-[1.03]"
          >
            View my work
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>

          {profile?.resume?.url ? (
            <a
              href={profile.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
            >
              <Download size={16} /> Resume
            </a>
          ) : (
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
            >
              Get in touch
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
