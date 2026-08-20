import { Form, Input, Modal, Slider } from 'antd';
import { useEffect } from 'react';
import { useCreateSkill, useUpdateSkill } from '../../hooks/useSkills';
import type { SkillRequest, SkillResponse } from '../../types/api';

interface SkillFormModalProps {
  open: boolean;
  categoryId: number;
  skill: SkillResponse | null;
  onClose: () => void;
}

export function SkillFormModal({ open, categoryId, skill, onClose }: SkillFormModalProps) {
  const [form] = Form.useForm<SkillRequest>();
  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        skill
          ? { name: skill.name, proficiency: skill.proficiency, icon: skill.icon ?? undefined }
          : { name: '', proficiency: 70, icon: undefined },
      );
    }
  }, [open, skill, form]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleFinish = (values: SkillRequest) => {
    const payload: SkillRequest = { ...values, skillCategoryId: categoryId };
    if (skill) {
      updateMutation.mutate({ id: skill.id, payload }, { onSuccess: onClose });
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <Modal
      title={skill ? 'Edit skill' : 'Add skill'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isSaving}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
          <Input placeholder="React.js" />
        </Form.Item>
        <Form.Item name="proficiency" label="Proficiency">
          <Slider min={0} max={100} />
        </Form.Item>
        <Form.Item name="icon" label="Icon" extra="Icon name/class, used by the public site">
          <Input placeholder="react" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
