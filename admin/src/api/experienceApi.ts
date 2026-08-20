import { apiClient } from './client';
import type { ExperienceRequest, ExperienceResponse } from '../types/api';

export const experienceApi = {
  list: () => apiClient.get<ExperienceResponse[]>('/admin/experience').then((r) => r.data),
  create: (payload: ExperienceRequest) => apiClient.post<ExperienceResponse>('/admin/experience', payload).then((r) => r.data),
  update: (id: number, payload: ExperienceRequest) =>
    apiClient.put<ExperienceResponse>(`/admin/experience/${id}`, payload).then((r) => r.data),
  delete: (id: number) => apiClient.delete<void>(`/admin/experience/${id}`).then((r) => r.data),
};
