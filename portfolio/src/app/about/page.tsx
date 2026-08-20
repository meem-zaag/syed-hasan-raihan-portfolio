import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Mail, Briefcase, GraduationCap } from "lucide-react";
import { getPage, getProfile, getExperience, findSection } from "@/lib/api";
import { IndexHeading } from "@/components/IndexHeading";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";

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
    <div className="bg-grid-fine mx-auto max-w-5xl px-6 py-24">
      <IndexHeading index="01" eyebrow="Get to know me" title={heading} />

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[300px_1fr]">
        <Reveal delay={0.1}>
          <TiltCard maxTilt={5} className="rounded-2xl border border-foreground/10 bg-card/70 p-6">
            {profile?.avatar?.url ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                <Image
                  src={profile.avatar.url}
                  alt={profile.avatar.altText ?? profile.fullName}
                  fill
                  sizes="270px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-secondary">
                <span className="font-display text-4xl font-medium text-foreground/25">
                  {(profile?.fullName ?? "PF").slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            <div className="mt-6 space-y-4 border-t border-foreground/10 pt-5">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-start gap-3">
                  <fact.icon size={15} className="mt-0.5 shrink-0 text-signal" />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {fact.label}
                    </p>
                    <p className="text-sm text-foreground">{fact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
        </Reveal>

        <Reveal delay={0.2} className="flex flex-col justify-center">
          {paragraphs.length > 0 ? (
            <div className="space-y-6">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "font-display text-2xl font-medium leading-snug text-balance text-foreground sm:text-3xl"
                      : "text-base leading-relaxed text-muted-foreground"
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-base text-muted-foreground">More about me is coming soon.</p>
          )}
        </Reveal>
      </div>
    </div>
  );
}
