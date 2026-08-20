import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { skillsApi } from '../api/skillsApi';
import type { SkillCategoryRequest, SkillCategoryResponse, SkillRequest, SkillResponse } from '../types/api';

export const skillKeys = {
  categories: ['skill-categories'] as const,
  skills: ['skills'] as const,
};

export function useSkillCategoriesQuery() {
  return useQuery({ queryKey: skillKeys.categories, queryFn: skillsApi.listCategories });
}

function useInvalidateSkills() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: skillKeys.categories });
    queryClient.invalidateQueries({ queryKey: skillKeys.skills });
  };
}

export function useCreateSkillCategory() {
  const invalidate = useInvalidateSkills();
  return useMutation({
    mutationFn: (payload: SkillCategoryRequest) => skillsApi.createCategory(payload),
    onSuccess: () => {
      invalidate();
      message.success('Category created');
    },
  });
}

export function useUpdateSkillCategory() {
  const invalidate = useInvalidateSkills();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SkillCategoryRequest }) => skillsApi.updateCategory(id, payload),
    onSuccess: () => {
      invalidate();
      message.success('Category updated');
    },
  });
}

export function useDeleteSkillCategory() {
  const invalidate = useInvalidateSkills();
  return useMutation({
    mutationFn: (id: number) => skillsApi.deleteCategory(id),
    onSuccess: () => {
      invalidate();
      message.success('Category deleted');
    },
  });
}

export function useCreateSkill() {
  const invalidate = useInvalidateSkills();
  return useMutation({
    mutationFn: (payload: SkillRequest) => skillsApi.createSkill(payload),
    onSuccess: () => {
      invalidate();
      message.success('Skill added');
    },
  });
}

export function useUpdateSkill() {
  const invalidate = useInvalidateSkills();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SkillRequest }) => skillsApi.updateSkill(id, payload),
    onSuccess: () => {
      invalidate();
      message.success('Skill updated');
    },
  });
}

export function useDeleteSkill() {
  const invalidate = useInvalidateSkills();
  return useMutation({
    mutationFn: (id: number) => skillsApi.deleteSkill(id),
    onSuccess: () => {
      invalidate();
      message.success('Skill deleted');
    },
  });
}

export function useReorderSkillCategories() {
  const invalidate = useInvalidateSkills();
  return useMutation({
    mutationFn: (categories: SkillCategoryResponse[]) =>
      Promise.all(
        categories.map((c, index) =>
          index === c.orderIndex ? null : skillsApi.updateCategory(c.id, { name: c.name, orderIndex: index }),
        ),
      ),
    onSuccess: () => invalidate(),
  });
}

export function useReorderSkillsInCategory() {
  const invalidate = useInvalidateSkills();
  return useMutation({
    mutationFn: (skills: SkillResponse[]) =>
      Promise.all(
        skills.map((s, index) =>
          index === s.orderIndex
            ? null
            : skillsApi.updateSkill(s.id, {
                skillCategoryId: s.skillCategoryId,
                name: s.name,
                proficiency: s.proficiency,
                icon: s.icon,
                orderIndex: index,
              }),
        ),
      ),
    onSuccess: () => invalidate(),
  });
}
