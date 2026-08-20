import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Mail, Briefcase, GraduationCap } from "lucide-react";
import { getPage, getProfile, getExperience, findSection } from "@/lib/api";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { DotPattern } from "@/components/ui/dot-pattern";

const CURRENT_YEAR = new Date().getFullYear();

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("about").catch(() => null);
  return {
    title: page?.metaTitle ?? "About",
    description: page?.metaDescription ?? undefined,
  };
}

export default async function AboutPage() {
  const [page, profile, experience] = await Promise.all([
    getPage("about").catch(() => null),
    getProfile().catch(() => null),
    getExperience().catch(() => []),
  ]);

  const intro = findSection(page, "intro") ?? page?.sections[0] ?? null;
  const heading = intro?.heading ?? "About me";
  const paragraphs = (intro?.description ?? profile?.bio ?? "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const currentRole = experience.find((e) => !e.endDate);
  const earliestStart = experience[experience.length - 1]?.startDate;
  const years = earliestStart
    ? CURRENT_YEAR - new Date(earliestStart).getFullYear()
    : null;

  const facts = [
    profile?.location && { icon: MapPin, label: "Location", value: profile.location },
    profile?.email && { icon: Mail, label: "Email", value: profile.email },
    currentRole && {
      icon: Briefcase,
      label: "Currently",
      value: `${currentRole.role} @ ${currentRole.company}`,
    },
    years && { icon: GraduationCap, label: "Experience", value: `${years}+ years` },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  return (
    <div className="relative overflow-hidden">
      <DotPattern className="absolute inset-0 -z-10 opacity-30 [mask-image:linear-gradient(to_bottom,white,transparent_70%)]" />

      <div className="mx-auto max-w-5xl px-6 py-24">
        <SectionHeading eyebrow="Get to know me" title={heading} />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
          <Reveal delay={0.1} className="flex flex-col items-center gap-6 lg:items-start">
            {profile?.avatar?.url ? (
              <div className="relative size-40 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={profile.avatar.url}
                  alt={profile.avatar.altText ?? profile.fullName}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex size-40 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-from/20 to-brand-to/20">
                <span className="font-heading text-4xl font-semibold text-foreground/30">
                  {(profile?.fullName ?? "PF").slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            <div className="w-full space-y-4">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-start gap-3">
                  <fact.icon size={16} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {fact.label}
                    </p>
                    <p className="text-sm text-foreground">{fact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2} className="space-y-5">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-base text-muted-foreground">
                More about me is coming soon.
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
