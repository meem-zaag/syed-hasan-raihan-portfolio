import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const cover =
    project.images.find((i) => i.isCover)?.media ?? project.images[0]?.media ?? null;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/60 transition-colors hover:border-white/20"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-brand-from/20 to-brand-to/20">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.altText ?? project.title}
            fill
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-heading text-2xl font-semibold text-foreground/20">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        {project.status === "IN_PROGRESS" && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">
            In progress
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {project.title}
          </h3>
          <ArrowUpRight
            size={18}
            className="mt-1 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          />
        </div>
        {project.summary && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{project.summary}</p>
        )}
        {project.techStack.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.techStack.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
