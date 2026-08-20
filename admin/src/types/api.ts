// Mirrors backend DTOs 1:1 (see backend/src/main/java/com/syedhasanraihan/portfolio/dto/**).
// Field names must match exactly — the backend is the source of truth for this contract.

export interface MediaResponse {
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

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ReorderItem {
  id: number;
  orderIndex: number;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors: ApiFieldError[] | null;
}

// ---- Auth ----
export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserSummary {
  id: number;
  username: string;
  role: string;
}

export interface TokenPairResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserSummary;
}

// ---- Profile ----
export interface ProfileResponse {
  id: number;
  fullName: string;
  title: string | null;
  tagline: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  avatar: MediaResponse | null;
  resume: MediaResponse | null;
  updatedAt: string;
}

export interface ProfileUpdateRequest {
  fullName: string;
  title?: string | null;
  tagline?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  websiteUrl?: string | null;
  avatarMediaId?: number | null;
  resumeMediaId?: number | null;
}

// ---- Pages & Sections ----
export interface PageResponse {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string;
}

export interface PageUpdateRequest {
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface SectionImageResponse {
  id: number;
  media: MediaResponse;
  orderIndex: number;
  caption: string | null;
}

export interface SectionResponse {
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
  images: SectionImageResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface SectionRequest {
  sectionKey: string;
  heading?: string | null;
  subheading?: string | null;
  description?: string | null;
  sectionType?: string | null;
  orderIndex?: number | null;
  visible?: boolean | null;
  contentJson?: string | null;
}

export interface AttachImageRequest {
  mediaId: number;
  orderIndex?: number | null;
  caption?: string | null;
}

// ---- Projects ----
export const PROJECT_STATUSES = ['COMPLETED', 'IN_PROGRESS'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface ProjectImageResponse {
  id: number;
  media: MediaResponse;
  orderIndex: number;
  cover: boolean;
}

export interface ProjectResponse {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  clientName: string | null;
  category: string | null;
  status: ProjectStatus;
  repoUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  orderIndex: number;
  startDate: string | null;
  endDate: string | null;
  techStack: string[];
  images: ProjectImageResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRequest {
  title: string;
  slug?: string | null;
  summary?: string | null;
  description?: string | null;
  clientName?: string | null;
  category?: string | null;
  status?: ProjectStatus | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean | null;
  orderIndex?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  techStack?: string[];
}

export interface AttachProjectImageRequest {
  mediaId: number;
  orderIndex?: number | null;
  cover?: boolean | null;
}

// ---- Skills ----
export interface SkillResponse {
  id: number;
  skillCategoryId: number;
  name: string;
  proficiency: number;
  icon: string | null;
  orderIndex: number;
}

export interface SkillRequest {
  skillCategoryId: number;
  name: string;
  proficiency: number;
  icon?: string | null;
  orderIndex?: number | null;
}

export interface SkillCategoryResponse {
  id: number;
  name: string;
  orderIndex: number;
  skills: SkillResponse[];
}

export interface SkillCategoryRequest {
  name: string;
  orderIndex?: number | null;
}

// ---- Experience ----
export interface ExperienceResponse {
  id: number;
  company: string;
  role: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  companyLogo: MediaResponse | null;
  orderIndex: number;
}

export interface ExperienceRequest {
  company: string;
  role: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  companyLogoMediaId?: number | null;
  orderIndex?: number | null;
}

// ---- Education ----
export const DATE_PRECISIONS = ['FULL', 'MONTH_YEAR', 'YEAR'] as const;
export type DatePrecision = (typeof DATE_PRECISIONS)[number];

export interface EducationResponse {
  id: number;
  institution: string;
  degree: string;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
  datePrecision: DatePrecision;
  description: string | null;
  orderIndex: number;
}

export interface EducationRequest {
  institution: string;
  degree: string;
  field?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  datePrecision?: DatePrecision | null;
  description?: string | null;
  orderIndex?: number | null;
}

// ---- Messages ----
export interface ContactMessageResponse {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

// ---- Settings ----
export interface SiteSettingsResponse {
  id: number;
  seoDefaultTitle: string | null;
  seoDefaultDescription: string | null;
  themeAccentColor: string | null;
  updatedAt: string;
}

export interface SiteSettingsRequest {
  seoDefaultTitle?: string | null;
  seoDefaultDescription?: string | null;
  themeAccentColor?: string | null;
}

// ---- Dashboard ----
export interface DashboardSummaryResponse {
  unreadMessagesCount: number;
  totalProjects: number;
  totalSections: number;
  totalMedia: number;
  lastEditedSection: {
    id: number;
    pageId: number;
    pageSlug: string;
    heading: string | null;
    updatedAt: string;
  } | null;
}
