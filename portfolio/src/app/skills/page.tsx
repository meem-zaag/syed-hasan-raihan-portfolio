import type { Metadata } from "next";
import { getPage, getSkillCategories } from "@/lib/api";
import { IndexHeading } from "@/components/IndexHeading";
import { SkillConstellation } from "@/components/SkillConstellation";

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
    <div className="mx-auto max-w-4xl px-6 py-24">
      <IndexHeading index="05" eyebrow="Capabilities" title={heading} description={description} />

      {categories.length === 0 ? (
        <p className="mt-16 text-sm text-muted-foreground">Skills coming soon.</p>
      ) : (
        <div className="mt-16">
          <SkillConstellation categories={categories} />
        </div>
      )}
    </div>
  );
}
