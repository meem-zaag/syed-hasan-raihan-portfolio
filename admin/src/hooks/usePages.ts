import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { pagesApi } from '../api/pagesApi';
import type { AttachImageRequest, PageUpdateRequest, ReorderItem, SectionRequest } from '../types/api';

export const pageKeys = {
  all: ['pages'] as const,
  detail: (pageId: number) => ['pages', pageId] as const,
  sections: (pageId: number) => ['pages', pageId, 'sections'] as const,
};

export function usePagesQuery() {
  return useQuery({ queryKey: pageKeys.all, queryFn: pagesApi.list });
}

export function useUpdatePage(pageId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PageUpdateRequest) => pagesApi.update(pageId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.all });
      queryClient.invalidateQueries({ queryKey: pageKeys.detail(pageId) });
      message.success('Page updated');
    },
  });
}

export function useSectionsQuery(pageId: number | undefined) {
  return useQuery({
    queryKey: pageId ? pageKeys.sections(pageId) : ['pages', 'none', 'sections'],
    queryFn: () => pagesApi.listSections(pageId as number),
    enabled: pageId !== undefined,
  });
}

export function useCreateSection(pageId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SectionRequest) => pagesApi.createSection(pageId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.sections(pageId) });
      message.success('Section created');
    },
  });
}

export function useUpdateSection(pageId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, payload }: { sectionId: number; payload: SectionRequest }) =>
      pagesApi.updateSection(pageId, sectionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.sections(pageId) });
      message.success('Section updated');
    },
  });
}

export function useDeleteSection(pageId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sectionId: number) => pagesApi.deleteSection(pageId, sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.sections(pageId) });
      message.success('Section deleted');
    },
  });
}

export function useReorderSections(pageId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: ReorderItem[]) => pagesApi.reorderSections(pageId, items),
    onSuccess: (data) => {
      queryClient.setQueryData(pageKeys.sections(pageId), data);
    },
  });
}

export function useAttachSectionImage(pageId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, payload }: { sectionId: number; payload: AttachImageRequest }) =>
      pagesApi.attachSectionImage(pageId, sectionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.sections(pageId) });
      message.success('Image attached');
    },
  });
}

export function useDetachSectionImage(pageId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, sectionImageId }: { sectionId: number; sectionImageId: number }) =>
      pagesApi.detachSectionImage(pageId, sectionId, sectionImageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.sections(pageId) });
      message.success('Image removed');
    },
  });
}
