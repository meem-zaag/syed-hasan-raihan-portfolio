import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { educationApi } from '../api/educationApi';
import type { EducationRequest, EducationResponse } from '../types/api';

export const educationKeys = { all: ['education'] as const };

export function useEducationQuery() {
  return useQuery({ queryKey: educationKeys.all, queryFn: educationApi.list });
}

function useInvalidateEducation() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: educationKeys.all });
}

export function useCreateEducation() {
  const invalidate = useInvalidateEducation();
  return useMutation({
    mutationFn: (payload: EducationRequest) => educationApi.create(payload),
    onSuccess: () => {
      invalidate();
      message.success('Education added');
    },
  });
}

export function useUpdateEducation() {
  const invalidate = useInvalidateEducation();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: EducationRequest }) => educationApi.update(id, payload),
    onSuccess: () => {
      invalidate();
      message.success('Education updated');
    },
  });
}

export function useDeleteEducation() {
  const invalidate = useInvalidateEducation();
  return useMutation({
    mutationFn: (id: number) => educationApi.delete(id),
    onSuccess: () => {
      invalidate();
      message.success('Education deleted');
    },
  });
}

export function useReorderEducation() {
  const invalidate = useInvalidateEducation();
  return useMutation({
    mutationFn: (items: EducationResponse[]) =>
      Promise.all(
        items.map((item, index) =>
          index === item.orderIndex
            ? null
            : educationApi.update(item.id, {
                institution: item.institution,
                degree: item.degree,
                field: item.field,
                startDate: item.startDate,
                endDate: item.endDate,
                datePrecision: item.datePrecision,
                description: item.description,
                orderIndex: index,
              }),
        ),
      ),
    onSuccess: () => invalidate(),
  });
}
