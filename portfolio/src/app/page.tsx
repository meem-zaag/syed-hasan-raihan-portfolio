import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPage, getProfile, getProjects, getSkillCategories, findSection } from "@/lib/api";
import { Hero } from "@/components/sections/Hero";
import { SkillsMarquee } from "@/components/sections/SkillsMarquee";
import { CTASection } from "@/components/sections/CTASection";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export default async function HomePage() {
  const [profile, home, projects, skillCategories] = await Promise.all([
    getProfile().catch(() => null),
    getPage("home").catch(() => null),
    getProjects({ featured: true }).catch(() => []),
    getSkillCategories().catch(() => []),
  ]);

  const hero = findSection(home, "hero");
  const heading = hero?.heading ?? profile?.fullName ?? "Welcome";
  const subheading = hero?.subheading ?? profile?.title ?? null;
  const description = hero?.description ?? profile?.tagline ?? null;

  const featured = projects.length > 0 ? projects : [];

  return (
    <>
      <Hero
        profile={profile}
        heading={heading}
        subheading={subheading}
        description={description}
      />

      {featured.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Selected work" title="Featured projects" />
              <Reveal delay={0.1}>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80"
                >
                  View all projects <ArrowRight size={14} />
                </Link>
              </Reveal>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 6).map((project, i) => (
                <Reveal key={project.id} delay={i * 0.06}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <SkillsMarquee categories={skillCategories} />

      <CTASection />
    </>
  );
}
