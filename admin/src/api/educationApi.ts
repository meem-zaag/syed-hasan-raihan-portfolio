import { apiClient } from './client';
import type { EducationRequest, EducationResponse } from '../types/api';

export const educationApi = {
  list: () => apiClient.get<EducationResponse[]>('/admin/education').then((r) => r.data),
  create: (payload: EducationRequest) => apiClient.post<EducationResponse>('/admin/education', payload).then((r) => r.data),
  update: (id: number, payload: EducationRequest) =>
    apiClient.put<EducationResponse>(`/admin/education/${id}`, payload).then((r) => r.data),
  delete: (id: number) => apiClient.delete<void>(`/admin/education/${id}`).then((r) => r.data),
};
