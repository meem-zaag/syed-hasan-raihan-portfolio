import type { Metadata } from "next";
import { getPage, getProjects } from "@/lib/api";
import { IndexHeading } from "@/components/IndexHeading";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("projects").catch(() => null);
  return {
    title: page?.metaTitle ?? "Projects",
    description: page?.metaDescription ?? undefined,
  };
}

export default async function ProjectsPage() {
  const [page, projects] = await Promise.all([
    getPage("projects").catch(() => null),
    getProjects().catch(() => []),
  ]);

  const heading = page?.sections[0]?.heading ?? page?.title ?? "Projects";
  const description =
    page?.sections[0]?.description ??
    "A selection of products and experiences I've helped bring to life.";

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <IndexHeading index="02" eyebrow="Portfolio" title={heading} description={description} />

      {projects.length === 0 ? (
        <p className="mt-16 text-sm text-muted-foreground">Projects coming soon.</p>
      ) : (
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.05}>
              <ProjectCard project={project} index={i} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
