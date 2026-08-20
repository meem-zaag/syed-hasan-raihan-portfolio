import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { profileApi } from '../api/profileApi';
import type { ProfileUpdateRequest } from '../types/api';

export const profileKeys = { detail: ['profile'] as const };

export function useProfileQuery() {
  return useQuery({ queryKey: profileKeys.detail, queryFn: profileApi.get });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfileUpdateRequest) => profileApi.update(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.detail, data);
      message.success('Profile updated');
    },
  });
}
