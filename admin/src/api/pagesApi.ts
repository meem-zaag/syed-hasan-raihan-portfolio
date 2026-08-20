import { apiClient } from './client';
import type {
  AttachImageRequest,
  PageResponse,
  PageUpdateRequest,
  ReorderItem,
  SectionRequest,
  SectionResponse,
} from '../types/api';

export const pagesApi = {
  list: () => apiClient.get<PageResponse[]>('/admin/pages').then((r) => r.data),
  getById: (pageId: number) => apiClient.get<PageResponse>(`/admin/pages/${pageId}`).then((r) => r.data),
  update: (pageId: number, payload: PageUpdateRequest) =>
    apiClient.put<PageResponse>(`/admin/pages/${pageId}`, payload).then((r) => r.data),

  listSections: (pageId: number) => apiClient.get<SectionResponse[]>(`/admin/pages/${pageId}/sections`).then((r) => r.data),
  createSection: (pageId: number, payload: SectionRequest) =>
    apiClient.post<SectionResponse>(`/admin/pages/${pageId}/sections`, payload).then((r) => r.data),
  updateSection: (pageId: number, sectionId: number, payload: SectionRequest) =>
    apiClient.put<SectionResponse>(`/admin/pages/${pageId}/sections/${sectionId}`, payload).then((r) => r.data),
  deleteSection: (pageId: number, sectionId: number) =>
    apiClient.delete<void>(`/admin/pages/${pageId}/sections/${sectionId}`).then((r) => r.data),
  reorderSections: (pageId: number, items: ReorderItem[]) =>
    apiClient.patch<SectionResponse[]>(`/admin/pages/${pageId}/sections/reorder`, { items }).then((r) => r.data),
  attachSectionImage: (pageId: number, sectionId: number, payload: AttachImageRequest) =>
    apiClient.post<SectionResponse>(`/admin/pages/${pageId}/sections/${sectionId}/images`, payload).then((r) => r.data),
  detachSectionImage: (pageId: number, sectionId: number, sectionImageId: number) =>
    apiClient
      .delete<SectionResponse>(`/admin/pages/${pageId}/sections/${sectionId}/images/${sectionImageId}`)
      .then((r) => r.data),
};
