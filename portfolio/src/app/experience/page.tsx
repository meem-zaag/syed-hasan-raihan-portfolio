import type { Metadata } from "next";
import { getExperience, getPage } from "@/lib/api";
import { IndexHeading } from "@/components/IndexHeading";
import { RoleStack } from "@/components/RoleStack";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("experience").catch(() => null);
  return {
    title: page?.metaTitle ?? "Experience",
    description: page?.metaDescription ?? undefined,
  };
}

export default async function ExperiencePage() {
  const [page, experience] = await Promise.all([
    getPage("experience").catch(() => null),
    getExperience().catch(() => []),
  ]);

  const heading = page?.sections[0]?.heading ?? page?.title ?? "Work experience";
  const description =
    page?.sections[0]?.description ?? "Where I've worked, and what I actually did there.";

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <IndexHeading index="03" eyebrow="Career" title={heading} description={description} />
      {experience.length > 0 ? (
        <div className="mt-16">
          <RoleStack experience={experience} />
        </div>
      ) : (
        <p className="mt-16 text-sm text-muted-foreground">Experience details coming soon.</p>
      )}
    </div>
  );
}
