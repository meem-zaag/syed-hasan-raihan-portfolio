import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { mediaApi, type ListMediaParams } from '../api/mediaApi';

export const mediaKeys = {
  list: (params: ListMediaParams) => ['media', params] as const,
};

export function useMediaQuery(params: ListMediaParams) {
  return useQuery({ queryKey: mediaKeys.list(params), queryFn: () => mediaApi.list(params) });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      altText,
      linkedEntityType,
      linkedEntityId,
    }: {
      file: File;
      altText?: string;
      linkedEntityType?: string;
      linkedEntityId?: number;
    }) => mediaApi.upload(file, altText, linkedEntityType, linkedEntityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      message.success('Uploaded');
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => mediaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      message.success('Media deleted');
    },
  });
}
