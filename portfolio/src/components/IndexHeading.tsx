import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { sanitizeRichText } from "@/lib/sanitize";

export function IndexHeading({
  index,
  eyebrow,
  title,
  description,
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string | null;
  className?: string;
}) {
  // `description` may be admin-authored rich text (Quill HTML) - see
  // lib/sanitize.ts. Sanitizing here, rather than at each of this
  // component's several callers, keeps it a single enforced choke point for
  // anything rendered via dangerouslySetInnerHTML below.
  const clean = sanitizeRichText(description);

  return (
    <Reveal className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-baseline gap-4">
        {index && (
          <span className="font-mono text-sm text-signal">{index}</span>
        )}
        {eyebrow && (
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {eyebrow}
          </span>
        )}
      </div>
      <h2 className="font-display text-4xl font-medium tracking-tight text-balance text-foreground sm:text-5xl">
        {title}
      </h2>
      {clean && (
        <div
          className="rich-text max-w-xl text-base text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      )}
    </Reveal>
  );
}
