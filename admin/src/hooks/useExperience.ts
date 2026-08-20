import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { experienceApi } from '../api/experienceApi';
import type { ExperienceRequest, ExperienceResponse } from '../types/api';

export const experienceKeys = { all: ['experience'] as const };

export function useExperienceQuery() {
  return useQuery({ queryKey: experienceKeys.all, queryFn: experienceApi.list });
}

function useInvalidateExperience() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: experienceKeys.all });
}

export function useCreateExperience() {
  const invalidate = useInvalidateExperience();
  return useMutation({
    mutationFn: (payload: ExperienceRequest) => experienceApi.create(payload),
    onSuccess: () => {
      invalidate();
      message.success('Experience added');
    },
  });
}

export function useUpdateExperience() {
  const invalidate = useInvalidateExperience();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ExperienceRequest }) => experienceApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      message.success('Experience updated');
    },
  });
}

export function useDeleteExperience() {
  const invalidate = useInvalidateExperience();
  return useMutation({
    mutationFn: (id: number) => experienceApi.delete(id),
    onSuccess: () => {
      invalidate();
      message.success('Experience deleted');
    },
  });
}

export function useReorderExperience() {
  const invalidate = useInvalidateExperience();
  return useMutation({
    mutationFn: (items: ExperienceResponse[]) =>
      Promise.all(
        items.map((item, index) =>
          index === item.orderIndex
            ? null
            : experienceApi.update(item.id, {
                company: item.company,
                role: item.role,
                location: item.location,
                startDate: item.startDate,
                endDate: item.endDate,
                description: item.description,
                companyLogoMediaId: item.companyLogo?.id ?? null,
                orderIndex: index,
              }),
        ),
      ),
    onSuccess: () => invalidate(),
  });
}
