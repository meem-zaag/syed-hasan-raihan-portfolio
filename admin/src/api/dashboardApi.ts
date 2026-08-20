import { apiClient } from './client';
import type { DashboardSummaryResponse } from '../types/api';

export const dashboardApi = {
  summary: () => apiClient.get<DashboardSummaryResponse>('/admin/dashboard/summary').then((r) => r.data),
};
