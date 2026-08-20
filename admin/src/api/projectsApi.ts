import { apiClient } from './client';
import type {
  AttachProjectImageRequest,
  PageResult,
  ProjectRequest,
  ProjectResponse,
  ReorderItem,
} from '../types/api';

export interface ListProjectsParams {
  search?: string;
  category?: string;
  page?: number;
  size?: number;
}

export const projectsApi = {
  list: (params: ListProjectsParams = {}) =>
    apiClient.get<PageResult<ProjectResponse>>('/admin/projects', { params }).then((r) => r.data),
  getById: (id: number) => apiClient.get<ProjectResponse>(`/admin/projects/${id}`).then((r) => r.data),
  create: (payload: ProjectRequest) => apiClient.post<ProjectResponse>('/admin/projects', payload).then((r) => r.data),
  update: (id: number, payload: ProjectRequest) =>
    apiClient.put<ProjectResponse>(`/admin/projects/${id}`, payload).then((r) => r.data),
  delete: (id: number) => apiClient.delete<void>(`/admin/projects/${id}`).then((r) => r.data),
  reorder: (items: ReorderItem[]) => apiClient.patch<void>('/admin/projects/reorder', { items }).then((r) => r.data),
  attachImage: (id: number, payload: AttachProjectImageRequest) =>
    apiClient.post<ProjectResponse>(`/admin/projects/${id}/images`, payload).then((r) => r.data),
  detachImage: (id: number, projectImageId: number) =>
    apiClient.delete<ProjectResponse>(`/admin/projects/${id}/images/${projectImageId}`).then((r) => r.data),
};
