import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Reveal } from "@/components/Reveal";

export function CTASection({
  title = "Have a project in mind?",
  description = "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/10">
      <BackgroundBeams className="opacity-40" />
      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
        <Reveal>
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{description}</p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-from to-brand-to px-7 py-3.5 text-sm font-medium text-white shadow-[0_0_30px_-8px_var(--brand-to)] transition-transform hover:scale-[1.03]"
          >
            Start a conversation <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
