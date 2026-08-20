import { getPage, getProfile, getExperience, findSection } from "@/lib/api";
import { HeroSection } from "@/components/home/HeroSection";
import { SignalStrip } from "@/components/home/SignalStrip";
import { SpatialIndex } from "@/components/home/SpatialIndex";

const CURRENT_YEAR = new Date().getFullYear();

export default async function HomePage() {
  const [profile, home, experience] = await Promise.all([
    getProfile().catch(() => null),
    getPage("home").catch(() => null),
    getExperience().catch(() => []),
  ]);

  const hero = findSection(home, "hero");
  const heading = hero?.heading ?? profile?.fullName ?? "Welcome";
  const subheading = hero?.subheading ?? profile?.title ?? null;
  const description = hero?.description ?? profile?.tagline ?? null;

  const currentRole = experience.find((e) => !e.endDate);
  const earliestStart = experience[experience.length - 1]?.startDate;
  const years = earliestStart ? CURRENT_YEAR - new Date(earliestStart).getFullYear() : null;

  const facts = [
    years && { label: "Experience", value: `${years}+ years` },
    currentRole && { label: "Currently", value: currentRole.company },
    profile?.location && { label: "Based in", value: profile.location },
    { label: "Focus", value: "React & Next.js" },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <HeroSection heading={heading} subheading={subheading} description={description} />
      <SignalStrip facts={facts} />
      <SpatialIndex />
    </>
  );
}
