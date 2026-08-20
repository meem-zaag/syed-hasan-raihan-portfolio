import { Marquee } from "@/components/ui/marquee";
import { SectionHeading } from "@/components/SectionHeading";
import type { SkillCategory } from "@/lib/types";

export function SkillsMarquee({ categories }: { categories: SkillCategory[] }) {
  const allSkills = categories.flatMap((c) => c.skills);
  if (allSkills.length === 0) return null;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Toolkit"
          title="Technologies I work with"
          align="center"
        />
      </div>

      <div className="relative mt-12 [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
        <Marquee pauseOnHover className="[--duration:35s]">
          {allSkills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground/90"
            >
              {skill.name}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
