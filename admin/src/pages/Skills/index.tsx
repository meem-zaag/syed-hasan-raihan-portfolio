import { EditOutlined, HolderOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Progress, Skeleton } from 'antd';
import { useState } from 'react';
import { ConfirmDeleteButton } from '../../components/common/ConfirmDeleteButton';
import { DragSortList } from '../../components/common/DragSortList';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import {
  useDeleteSkill,
  useDeleteSkillCategory,
  useReorderSkillCategories,
  useReorderSkillsInCategory,
  useSkillCategoriesQuery,
} from '../../hooks/useSkills';
import type { SkillCategoryResponse, SkillResponse } from '../../types/api';
import { CategoryFormModal } from './CategoryFormModal';
import { SkillFormModal } from './SkillFormModal';

export default function SkillsPage() {
  const { data: categories, isLoading } = useSkillCategoriesQuery();
  const reorderCategories = useReorderSkillCategories();
  const reorderSkills = useReorderSkillsInCategory();
  const deleteCategory = useDeleteSkillCategory();
  const deleteSkill = useDeleteSkill();

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategoryResponse | null>(null);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [skillCategoryId, setSkillCategoryId] = useState<number | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillResponse | null>(null);

  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };
  const openEditCategory = (category: SkillCategoryResponse) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };
  const openAddSkill = (categoryId: number) => {
    setSkillCategoryId(categoryId);
    setEditingSkill(null);
    setSkillModalOpen(true);
  };
  const openEditSkill = (categoryId: number, skill: SkillResponse) => {
    setSkillCategoryId(categoryId);
    setEditingSkill(skill);
    setSkillModalOpen(true);
  };

  return (
    <div>
      <PageHeaderBar
        title="Skills"
        description="Group your skills by category with a proficiency level for each."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddCategory}>
            Add category
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : !categories || categories.length === 0 ? (
        <EmptyState title="No skill categories yet" actionLabel="Add category" onAction={openAddCategory} />
      ) : (
        <DragSortList
          items={categories}
          onReorder={(reordered) => reorderCategories.mutate(reordered)}
          className="space-y-4"
          renderItem={(category, dragHandle) => (
            <Card
              title={
                <div className="flex items-center gap-2">
                  <span {...dragHandle.attributes} {...dragHandle.listeners} className="cursor-grab text-gray-300 hover:text-gray-500">
                    <HolderOutlined />
                  </span>
                  {category.name}
                </div>
              }
              extra={
                <div className="flex gap-1">
                  <Button type="text" icon={<EditOutlined />} onClick={() => openEditCategory(category)} />
                  <ConfirmDeleteButton
                    title="Delete this category and all its skills?"
                    onConfirm={() => deleteCategory.mutate(category.id)}
                  />
                  <Button type="link" icon={<PlusOutlined />} onClick={() => openAddSkill(category.id)}>
                    Add skill
                  </Button>
                </div>
              }
            >
              {category.skills.length === 0 ? (
                <p className="text-sm text-gray-400">No skills in this category yet.</p>
              ) : (
                <DragSortList
                  items={category.skills}
                  onReorder={(reordered) => reorderSkills.mutate(reordered)}
                  className="space-y-2"
                  renderItem={(skill, skillDragHandle) => (
                    <div className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-gray-50">
                      <span
                        {...skillDragHandle.attributes}
                        {...skillDragHandle.listeners}
                        className="cursor-grab text-gray-300 hover:text-gray-500"
                      >
                        <HolderOutlined />
                      </span>
                      <span className="w-40 shrink-0 truncate text-sm text-gray-700">{skill.name}</span>
                      <Progress percent={skill.proficiency} size="small" className="max-w-xs flex-1" showInfo={false} />
                      <span className="w-10 text-right text-xs text-gray-400">{skill.proficiency}%</span>
                      <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEditSkill(category.id, skill)} />
                      <ConfirmDeleteButton onConfirm={() => deleteSkill.mutate(skill.id)} />
                    </div>
                  )}
                />
              )}
            </Card>
          )}
        />
      )}

      <CategoryFormModal open={categoryModalOpen} category={editingCategory} onClose={() => setCategoryModalOpen(false)} />
      {skillCategoryId && (
        <SkillFormModal
          open={skillModalOpen}
          categoryId={skillCategoryId}
          skill={editingSkill}
          onClose={() => setSkillModalOpen(false)}
        />
      )}
    </div>
  );
}
