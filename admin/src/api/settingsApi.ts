import { apiClient } from './client';
import type { SiteSettingsRequest, SiteSettingsResponse } from '../types/api';

export const settingsApi = {
  get: () => apiClient.get<SiteSettingsResponse>('/admin/settings').then((r) => r.data),
  update: (payload: SiteSettingsRequest) => apiClient.put<SiteSettingsResponse>('/admin/settings', payload).then((r) => r.data),
};
