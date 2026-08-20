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

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
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

export async function submitContactMessage(input: ContactMessageInput) {
  const res = await fetch(`${API_BASE_URL}/public/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });
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
