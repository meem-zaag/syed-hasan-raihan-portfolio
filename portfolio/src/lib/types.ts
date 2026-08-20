export interface Media {
  id: number;
  url: string;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
  altText: string | null;
  linkedEntityType: string | null;
  linkedEntityId: number | null;
  uploadedAt: string;
}

export interface Profile {
  id: number;
  fullName: string;
  title: string;
  tagline: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  avatar: Media | null;
  resume: Media | null;
  updatedAt: string;
}

export interface SectionImage {
  id: number;
  media: Media;
  orderIndex: number;
  caption: string | null;
}

export interface Section {
  id: number;
  pageId: number;
  sectionKey: string;
  heading: string | null;
  subheading: string | null;
  description: string | null;
  sectionType: string;
  orderIndex: number;
  visible: boolean;
  contentJson: string | null;
  images: SectionImage[];
  createdAt: string;
  updatedAt: string;
}

export interface PageDetail {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string;
  sections: Section[];
}

export interface ProjectImage {
  id: number;
  media: Media;
  orderIndex: number;
  isCover: boolean;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  clientName: string | null;
  category: string | null;
  status: "COMPLETED" | "IN_PROGRESS";
  repoUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  orderIndex: number;
  startDate: string | null;
  endDate: string | null;
  techStack: string[];
  images: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: number;
  skillCategoryId: number;
  name: string;
  proficiency: number;
  icon: string | null;
  orderIndex: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  orderIndex: number;
  skills: Skill[];
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  companyLogo: Media | null;
  orderIndex: number;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
  datePrecision: "YEAR" | "MONTH_YEAR" | "FULL";
  description: string | null;
  orderIndex: number;
}

export interface SiteSettings {
  id: number;
  seoDefaultTitle: string | null;
  seoDefaultDescription: string | null;
  themeAccentColor: string | null;
  updatedAt: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
