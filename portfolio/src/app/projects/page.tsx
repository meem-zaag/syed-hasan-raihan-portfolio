import type { Metadata } from "next";
import { getPage, getProjects } from "@/lib/api";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";

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
      <SectionHeading eyebrow="Portfolio" title={heading} description={description} />
      <ProjectsGrid projects={projects} />
    </div>
  );
}
