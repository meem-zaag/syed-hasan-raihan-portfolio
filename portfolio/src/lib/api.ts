import type {
  ContactMessageInput,
  Education,
  Experience,
  PageDetail,
  Profile,
  Project,
  SiteSettings,
  SkillCategory,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

const REVALIDATE_SECONDS = 60;

// Shorter than the route's `maxDuration` (60s, see layout.tsx) so a cold
// Render backend fails fast enough for the callers' `.catch()` fallbacks to
// render a page with default content instead of the whole serverless
// function getting killed mid-request once maxDuration is hit.
const FETCH_TIMEOUT_MS = 8_000;

async function getJSON<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Request to ${path} failed with status ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`Request to ${path} timed out — the server may be waking up from idle.`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export function getProfile() {
  return getJSON<Profile>("/public/profile");
}

export function getPage(slug: string) {
  return getJSON<PageDetail>(`/public/pages/${slug}`);
}

export function getProjects(params?: { category?: string; featured?: boolean }) {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.featured !== undefined) search.set("featured", String(params.featured));
  const qs = search.toString();
  return getJSON<Project[]>(`/public/projects${qs ? `?${qs}` : ""}`);
}

export function getProject(slug: string) {
  return getJSON<Project>(`/public/projects/${slug}`);
}

export function getSkillCategories() {
  return getJSON<SkillCategory[]>("/public/skills");
}

export function getExperience() {
  return getJSON<Experience[]>("/public/experience");
}

export function getEducation() {
  return getJSON<Education[]>("/public/education");
}

export function getSettings() {
  return getJSON<SiteSettings>("/public/settings");
}

// A user is actively waiting on this one (form submit), so it gets more
// grace than a content fetch before we tell them the server might be
// waking up rather than leaving them staring at a spinner indefinitely.
const CONTACT_TIMEOUT_MS = 15_000;

export async function submitContactMessage(input: ContactMessageInput) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONTACT_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(
        "This is taking longer than expected — the server may be waking up from idle. Please try again in a few seconds."
      );
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) {
    let message = "Something went wrong sending your message.";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore parse failure, use default message
    }
    throw new Error(message);
  }
  return res.json();
}

/** Finds a section by key, tolerant of it being absent (admin-managed content is optional). */
export function findSection(page: PageDetail | null, key: string) {
  return page?.sections.find((s) => s.sectionKey === key && s.visible) ?? null;
}
