import type { Metadata } from "next";
import { getPage, getSkillCategories } from "@/lib/api";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ProficiencyBar } from "@/components/ProficiencyBar";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("skills").catch(() => null);
  return {
    title: page?.metaTitle ?? "Skills",
    description: page?.metaDescription ?? undefined,
  };
}

export default async function SkillsPage() {
  const [page, categories] = await Promise.all([
    getPage("skills").catch(() => null),
    getSkillCategories().catch(() => []),
  ]);

  const heading = page?.sections[0]?.heading ?? page?.title ?? "Skills";
  const description =
    page?.sections[0]?.description ?? "Tools and technologies I use to build products.";

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading eyebrow="Capabilities" title={heading} description={description} />

      {categories.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">Skills coming soon.</p>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((category, i) => (
            <Reveal key={category.id} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-card/60 p-6">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {category.name}
                </h3>
                <div className="mt-6 space-y-5">
                  {category.skills.map((skill) => (
                    <ProficiencyBar
                      key={skill.id}
                      name={skill.name}
                      proficiency={skill.proficiency}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
