import { Reveal } from "@/components/Reveal";

export function SignalStrip({
  facts,
}: {
  facts: { label: string; value: string }[];
}) {
  if (facts.length === 0) return null;

  return (
    <div className="border-y border-foreground/10 bg-card/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-foreground/10 px-6 sm:grid-cols-4">
        {facts.map((fact, i) => (
          <Reveal key={fact.label} delay={i * 0.05} className="px-4 py-6 sm:px-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {fact.label}
            </p>
            <p className="mt-1.5 font-display text-lg font-medium text-foreground">
              {fact.value}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
