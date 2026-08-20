import { apiClient } from './client';
import type { ContactMessageResponse, PageResult } from '../types/api';

export interface ListMessagesParams {
  unreadOnly?: boolean;
  page?: number;
  size?: number;
}

export const messagesApi = {
  list: (params: ListMessagesParams = {}) =>
    apiClient.get<PageResult<ContactMessageResponse>>('/admin/messages', { params }).then((r) => r.data),
  markRead: (id: number) => apiClient.patch<ContactMessageResponse>(`/admin/messages/${id}/read`).then((r) => r.data),
  delete: (id: number) => apiClient.delete<void>(`/admin/messages/${id}`).then((r) => r.data),
};
