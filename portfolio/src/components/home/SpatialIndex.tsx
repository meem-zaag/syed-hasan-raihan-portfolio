import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/TiltCard";
import { Reveal } from "@/components/Reveal";

const TILES = [
  {
    href: "/projects",
    index: "01",
    title: "Projects",
    description: "Products and platforms I've helped build and ship.",
  },
  {
    href: "/experience",
    index: "02",
    title: "Experience",
    description: "Where I've worked, and what I actually did there.",
  },
  {
    href: "/skills",
    index: "03",
    title: "Skills",
    description: "The tools and languages I reach for day to day.",
  },
  {
    href: "/about",
    index: "04",
    title: "About",
    description: "A bit more about who I am beyond the résumé.",
  },
  {
    href: "/education",
    index: "05",
    title: "Education",
    description: "Formal background, for what it's worth.",
  },
  {
    href: "/contact",
    index: "06",
    title: "Contact",
    description: "Have a project in mind? Let's talk about it.",
  },
];

export function SpatialIndex() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-12 flex items-baseline gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Index
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((tile, i) => (
            <Reveal key={tile.href} delay={i * 0.05}>
              <Link href={tile.href} className="group block h-full">
                <TiltCard
                  maxTilt={6}
                  className="flex h-full flex-col justify-between gap-8 rounded-2xl border border-white/10 bg-card/60 p-6 transition-colors group-hover:border-signal/40"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs text-signal">{tile.index}</span>
                    <ArrowUpRight
                      size={16}
                      className="text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-medium text-foreground">
                      {tile.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {tile.description}
                    </p>
                  </div>
                </TiltCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
