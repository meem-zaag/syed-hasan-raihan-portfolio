import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, Briefcase } from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { getProject } from "@/lib/api";
import { Reveal } from "@/components/Reveal";

async function loadProject(slug: string) {
  try {
    return await getProject(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary ?? undefined,
  };
}

function formatDate(date: string | null) {
  if (!date) return "Present";
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) notFound();

  const cover =
    project.images.find((i) => i.isCover)?.media ?? project.images[0]?.media ?? null;
  const gallery = project.images.filter((i) => i.media.id !== cover?.id);

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Reveal>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} /> All projects
        </Link>
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          {project.category && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              {project.category}
            </span>
          )}
          {project.status === "IN_PROGRESS" && (
            <span className="rounded-full bg-amber-400/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">
              In progress
            </span>
          )}
        </div>
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        {project.summary && (
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">{project.summary}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          {project.clientName && (
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} /> {project.clientName}
            </span>
          )}
          {(project.startDate || project.endDate) && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(project.startDate)} —{" "}
              {formatDate(project.endDate)}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <ExternalLink size={15} /> Live site
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
            >
              <GithubIcon size={15} /> Source
            </a>
          )}
        </div>
      </Reveal>

      {cover && (
        <Reveal delay={0.1} className="relative mt-12 aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
          <Image src={cover.url} alt={cover.altText ?? project.title} fill sizes="800px" className="object-cover" priority />
        </Reveal>
      )}

      {project.description && (
        <Reveal delay={0.15} className="mt-10 space-y-4">
          {project.description.split("\n").filter(Boolean).map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </Reveal>
      )}

      {project.techStack.length > 0 && (
        <Reveal delay={0.2} className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
            Tech stack
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.techStack.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      )}

      {gallery.length > 0 && (
        <Reveal delay={0.25} className="mt-10 grid grid-cols-2 gap-4">
          {gallery.map((img) => (
            <div
              key={img.id}
              className="relative aspect-video overflow-hidden rounded-xl border border-white/10"
            >
              <Image
                src={img.media.url}
                alt={img.media.altText ?? project.title}
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
          ))}
        </Reveal>
      )}
    </div>
  );
}
