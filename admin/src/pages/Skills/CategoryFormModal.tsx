import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import { useCreateSkillCategory, useUpdateSkillCategory } from '../../hooks/useSkills';
import type { SkillCategoryRequest, SkillCategoryResponse } from '../../types/api';

interface CategoryFormModalProps {
  open: boolean;
  category: SkillCategoryResponse | null;
  onClose: () => void;
}

export function CategoryFormModal({ open, category, onClose }: CategoryFormModalProps) {
  const [form] = Form.useForm<SkillCategoryRequest>();
  const createMutation = useCreateSkillCategory();
  const updateMutation = useUpdateSkillCategory();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ name: category?.name ?? '' });
    }
  }, [open, category, form]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleFinish = (values: SkillCategoryRequest) => {
    if (category) {
      updateMutation.mutate({ id: category.id, payload: values }, { onSuccess: onClose });
    } else {
      createMutation.mutate(values, { onSuccess: onClose });
    }
  };

  return (
    <Modal
      title={category ? 'Rename category' : 'Add category'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isSaving}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="name" label="Category name" rules={[{ required: true, message: 'Name is required' }]}>
          <Input placeholder="Frontend" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
