import type { Metadata } from "next";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { getExperience, getPage } from "@/lib/api";
import { SectionHeading } from "@/components/SectionHeading";
import { Timeline } from "@/components/ui/timeline";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("experience").catch(() => null);
  return {
    title: page?.metaTitle ?? "Experience",
    description: page?.metaDescription ?? undefined,
  };
}

function formatRange(start: string | null, end: string | null) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return `${start ? fmt(start) : "—"} – ${end ? fmt(end) : "Present"}`;
}

export default async function ExperiencePage() {
  const [page, experience] = await Promise.all([
    getPage("experience").catch(() => null),
    getExperience().catch(() => []),
  ]);

  const heading = page?.sections[0]?.heading ?? page?.title ?? "Work experience";
  const description =
    page?.sections[0]?.description ?? "A timeline of where I've worked and what I've built.";

  const data = experience.map((exp) => ({
    title: formatRange(exp.startDate, exp.endDate),
    content: (
      <div className="rounded-2xl border border-white/10 bg-card/60 p-6">
        <div className="flex items-start gap-4">
          {exp.companyLogo?.url && (
            <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
              <Image
                src={exp.companyLogo.url}
                alt={exp.company}
                fill
                sizes="44px"
                className="object-contain p-1.5"
              />
            </div>
          )}
          <div>
            <h4 className="font-heading text-lg font-semibold text-foreground">
              {exp.role}
            </h4>
            <p className="text-sm text-primary">{exp.company}</p>
            {exp.location && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={12} /> {exp.location}
              </p>
            )}
          </div>
        </div>
        {exp.description && (
          <ul className="mt-4 space-y-2">
            {exp.description
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                  {line}
                </li>
              ))}
          </ul>
        )}
      </div>
    ),
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading eyebrow="Career" title={heading} description={description} />
      {data.length > 0 ? (
        <div className="mt-8">
          <Timeline data={data} />
        </div>
      ) : (
        <p className="mt-12 text-sm text-muted-foreground">Experience details coming soon.</p>
      )}
    </div>
  );
}
