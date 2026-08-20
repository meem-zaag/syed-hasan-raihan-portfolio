import { apiClient } from './client';
import type { SkillCategoryRequest, SkillCategoryResponse, SkillRequest, SkillResponse } from '../types/api';

export const skillsApi = {
  listCategories: () => apiClient.get<SkillCategoryResponse[]>('/admin/skill-categories').then((r) => r.data),
  createCategory: (payload: SkillCategoryRequest) =>
    apiClient.post<SkillCategoryResponse>('/admin/skill-categories', payload).then((r) => r.data),
  updateCategory: (id: number, payload: SkillCategoryRequest) =>
    apiClient.put<SkillCategoryResponse>(`/admin/skill-categories/${id}`, payload).then((r) => r.data),
  deleteCategory: (id: number) => apiClient.delete<void>(`/admin/skill-categories/${id}`).then((r) => r.data),

  listSkills: () => apiClient.get<SkillResponse[]>('/admin/skills').then((r) => r.data),
  createSkill: (payload: SkillRequest) => apiClient.post<SkillResponse>('/admin/skills', payload).then((r) => r.data),
  updateSkill: (id: number, payload: SkillRequest) =>
    apiClient.put<SkillResponse>(`/admin/skills/${id}`, payload).then((r) => r.data),
  deleteSkill: (id: number) => apiClient.delete<void>(`/admin/skills/${id}`).then((r) => r.data),
};
