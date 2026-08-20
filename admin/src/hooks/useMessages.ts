import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { messagesApi, type ListMessagesParams } from '../api/messagesApi';

export const messageKeys = {
  list: (params: ListMessagesParams) => ['messages', params] as const,
};

export function useMessagesQuery(params: ListMessagesParams) {
  return useQuery({ queryKey: messageKeys.list(params), queryFn: () => messagesApi.list(params) });
}

export function useMarkMessageRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => messagesApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => messagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      message.success('Message deleted');
    },
  });
}
