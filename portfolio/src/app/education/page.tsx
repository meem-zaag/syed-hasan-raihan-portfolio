import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { getEducation, getPage } from "@/lib/api";
import { IndexHeading } from "@/components/IndexHeading";
import { Reveal } from "@/components/Reveal";
import type { Education } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("education").catch(() => null);
  return {
    title: page?.metaTitle ?? "Education",
    description: page?.metaDescription ?? undefined,
  };
}

function formatDate(date: string | null, precision: Education["datePrecision"]) {
  if (!date) return "";
  const d = new Date(date);
  if (precision === "YEAR") return `${d.getFullYear()}`;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default async function EducationPage() {
  const [page, education] = await Promise.all([
    getPage("education").catch(() => null),
    getEducation().catch(() => []),
  ]);

  const heading = page?.sections[0]?.heading ?? page?.title ?? "Education";
  const description = page?.sections[0]?.description ?? "My academic background.";

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <IndexHeading index="04" eyebrow="Background" title={heading} description={description} />

      <div className="mt-16 space-y-4">
        {education.length === 0 && (
          <p className="text-sm text-muted-foreground">Education details coming soon.</p>
        )}
        {education.map((edu, i) => (
          <Reveal key={edu.id} delay={i * 0.06}>
            <div className="flex gap-4 rounded-2xl border border-white/10 bg-card/60 p-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-signal">
                <GraduationCap size={20} />
              </div>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-lg font-medium text-foreground">
                    {edu.institution}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDate(edu.startDate, edu.datePrecision)} —{" "}
                    {formatDate(edu.endDate, edu.datePrecision)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-signal">
                  {edu.degree}
                  {edu.field ? `, ${edu.field}` : ""}
                </p>
                {edu.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{edu.description}</p>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
