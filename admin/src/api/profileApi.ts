import { apiClient } from './client';
import type { ProfileResponse, ProfileUpdateRequest } from '../types/api';

export const profileApi = {
  get: () => apiClient.get<ProfileResponse>('/admin/profile').then((r) => r.data),
  update: (payload: ProfileUpdateRequest) => apiClient.put<ProfileResponse>('/admin/profile', payload).then((r) => r.data),
};
