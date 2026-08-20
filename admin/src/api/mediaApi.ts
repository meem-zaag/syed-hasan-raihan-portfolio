import { apiClient } from './client';
import type { MediaResponse, PageResult } from '../types/api';

export interface ListMediaParams {
  search?: string;
  contentType?: string;
  page?: number;
  size?: number;
}

export const mediaApi = {
  list: (params: ListMediaParams = {}) =>
    apiClient.get<PageResult<MediaResponse>>('/admin/media', { params }).then((r) => r.data),
  upload: (file: File, altText?: string, linkedEntityType?: string, linkedEntityId?: number) => {
    const form = new FormData();
    form.append('file', file);
    if (altText) form.append('altText', altText);
    if (linkedEntityType) form.append('linkedEntityType', linkedEntityType);
    if (linkedEntityId !== undefined) form.append('linkedEntityId', String(linkedEntityId));
    return apiClient
      .post<MediaResponse>('/admin/media/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
  delete: (id: number) => apiClient.delete<void>(`/admin/media/${id}`).then((r) => r.data),
};
