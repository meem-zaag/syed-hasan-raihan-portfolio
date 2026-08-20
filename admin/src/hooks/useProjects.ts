import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { projectsApi, type ListProjectsParams } from '../api/projectsApi';
import type { AttachProjectImageRequest, ProjectRequest, ReorderItem } from '../types/api';

export const projectKeys = {
  all: ['projects'] as const,
  list: (params: ListProjectsParams) => ['projects', 'list', params] as const,
  detail: (id: number) => ['projects', id] as const,
};

export function useProjectsQuery(params: ListProjectsParams) {
  return useQuery({ queryKey: projectKeys.list(params), queryFn: () => projectsApi.list(params) });
}

export function useProjectQuery(id: number | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(id as number),
    queryFn: () => projectsApi.getById(id as number),
    enabled: id !== undefined,
  });
}

function useInvalidateProjects() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: projectKeys.all });
}

export function useCreateProject() {
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: (payload: ProjectRequest) => projectsApi.create(payload),
    onSuccess: () => {
      invalidate();
      message.success('Project created');
    },
  });
}

export function useUpdateProject() {
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProjectRequest }) => projectsApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      message.success('Project updated');
    },
  });
}

export function useDeleteProject() {
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    onSuccess: () => {
      invalidate();
      message.success('Project deleted');
    },
  });
}

export function useReorderProjects() {
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: (items: ReorderItem[]) => projectsApi.reorder(items),
    onSuccess: () => invalidate(),
  });
}

export function useAttachProjectImage() {
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AttachProjectImageRequest }) => projectsApi.attachImage(id, payload),
    onSuccess: () => {
      invalidate();
      message.success('Image attached');
    },
  });
}

export function useDetachProjectImage() {
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: ({ id, projectImageId }: { id: number; projectImageId: number }) => projectsApi.detachImage(id, projectImageId),
    onSuccess: () => {
      invalidate();
      message.success('Image removed');
    },
  });
}
