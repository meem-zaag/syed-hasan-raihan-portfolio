import Link from "next/link";
import { Globe, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/BrandIcons";
import type { Profile } from "@/lib/types";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

const CURRENT_YEAR = new Date().getFullYear();

export function Footer({ profile }: { profile: Profile | null }) {
  const year = profile?.updatedAt ? new Date(profile.updatedAt).getFullYear() : CURRENT_YEAR;

  const socials = [
    profile?.githubUrl && { href: profile.githubUrl, label: "GitHub", icon: GithubIcon },
    profile?.linkedinUrl && { href: profile.linkedinUrl, label: "LinkedIn", icon: LinkedinIcon },
    profile?.twitterUrl && { href: profile.twitterUrl, label: "Twitter", icon: TwitterIcon },
    profile?.websiteUrl && { href: profile.websiteUrl, label: "Website", icon: Globe },
    profile?.email && { href: `mailto:${profile.email}`, label: "Email", icon: Mail },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Globe }[];

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-lg font-medium text-foreground">
            {profile?.fullName ?? "Portfolio"}
          </p>
          {profile?.tagline && (
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {profile.tagline}
            </p>
          )}
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-signal/40 hover:text-signal"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-wide sm:flex sm:flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10 px-6 py-6">
        <p className="mx-auto max-w-6xl font-mono text-[11px] text-muted-foreground">
          © {year} {profile?.fullName ?? "Portfolio"}
        </p>
      </div>
    </footer>
  );
}
