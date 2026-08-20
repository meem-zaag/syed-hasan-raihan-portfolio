import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { settingsApi } from '../api/settingsApi';
import type { SiteSettingsRequest } from '../types/api';

export const settingsKeys = { detail: ['settings'] as const };

export function useSettingsQuery() {
  return useQuery({ queryKey: settingsKeys.detail, queryFn: settingsApi.get });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SiteSettingsRequest) => settingsApi.update(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.detail, data);
      message.success('Settings saved');
    },
  });
}
