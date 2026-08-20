import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { TiltCard } from "./TiltCard";

export function ProjectCard({ project, index }: { project: Project; index?: number }) {
  const cover =
    project.images.find((i) => i.isCover)?.media ?? project.images[0]?.media ?? null;

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <TiltCard
        maxTilt={7}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/70"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.altText ?? project.title}
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-3xl font-medium text-foreground/15">
                {project.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          {typeof index === "number" && (
            <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-background/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground backdrop-blur">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          {project.status === "IN_PROGRESS" && (
            <span className="absolute right-3 top-3 rounded-full bg-ember px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-background">
              In progress
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-medium text-foreground">
              {project.title}
            </h3>
            <ArrowUpRight
              size={18}
              className="mt-1 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
            />
          </div>
          {project.summary && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{project.summary}</p>
          )}
          {project.techStack.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2 font-mono">
              {project.techStack.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </TiltCard>
    </Link>
  );
}
