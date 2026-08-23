import sanitizeHtml from "sanitize-html";

// Matches exactly what the admin's Quill toolbar can produce (see
// admin/src/components/common/RichTextField.tsx) - an intentionally tight
// allowlist rather than a denylist, since this content is rendered via
// dangerouslySetInnerHTML on the public site.
const ALLOWED_TAGS = ["h2", "h3", "p", "strong", "em", "u", "s", "ol", "ul", "li", "a", "br"];

/** Sanitizes admin-authored rich text (Quill HTML) for safe dangerouslySetInnerHTML use. */
export function sanitizeRichText(html: string | null | undefined): string | null {
  if (!html) return null;
  const clean = sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ["href"] },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
    },
  }).trim();
  return clean || null;
}
