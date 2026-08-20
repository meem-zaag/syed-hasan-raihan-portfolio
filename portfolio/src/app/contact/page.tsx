import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { getPage, getProfile } from "@/lib/api";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contact").catch(() => null);
  return {
    title: page?.metaTitle ?? "Contact",
    description: page?.metaDescription ?? undefined,
  };
}

export default async function ContactPage() {
  const [page, profile] = await Promise.all([
    getPage("contact").catch(() => null),
    getProfile().catch(() => null),
  ]);

  const heading = page?.sections[0]?.heading ?? page?.title ?? "Get in touch";
  const description =
    page?.sections[0]?.description ??
    "Have a question or a project in mind? Send me a message and I'll respond as soon as I can.";

  const contacts = [
    profile?.email && { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    profile?.phone && { icon: Phone, label: profile.phone, href: `tel:${profile.phone}` },
    profile?.location && { icon: MapPin, label: profile.location, href: undefined },
  ].filter(Boolean) as { icon: typeof Mail; label: string; href?: string }[];

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading eyebrow="Contact" title={heading} description={description} />

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr]">
        <Reveal delay={0.1} className="space-y-4">
          {contacts.map((c) => {
            const Content = (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-card/60 px-4 py-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <c.icon size={16} />
                </span>
                <span className="text-sm text-foreground">{c.label}</span>
              </div>
            );
            return c.href ? (
              <a key={c.label} href={c.href} className="block transition-opacity hover:opacity-80">
                {Content}
              </a>
            ) : (
              <div key={c.label}>{Content}</div>
            );
          })}
        </Reveal>

        <Reveal delay={0.2}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
