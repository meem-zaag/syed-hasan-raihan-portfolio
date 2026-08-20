import { Button, Checkbox, Drawer, Form, Input, Space } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ImageUploader } from '../../components/common/ImageUploader';
import { useCreateExperience, useUpdateExperience } from '../../hooks/useExperience';
import type { ExperienceRequest, ExperienceResponse, MediaResponse } from '../../types/api';

interface ExperienceFormDrawerProps {
  open: boolean;
  experience: ExperienceResponse | null;
  onClose: () => void;
}

interface FormValues {
  company: string;
  role: string;
  location?: string;
  startDate: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  description?: string;
  companyLogo?: MediaResponse | null;
}

export function ExperienceFormDrawer({ open, experience, onClose }: ExperienceFormDrawerProps) {
  const [form] = Form.useForm<FormValues>();
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();
  const [current, setCurrent] = useState(false);

  useEffect(() => {
    if (open) {
      const isCurrent = Boolean(experience) && !experience?.endDate;
      setCurrent(isCurrent);
      form.setFieldsValue(
        experience
          ? {
              company: experience.company,
              role: experience.role,
              location: experience.location ?? undefined,
              startDate: dayjs(experience.startDate),
              endDate: experience.endDate ? dayjs(experience.endDate) : undefined,
              description: experience.description ?? undefined,
              companyLogo: experience.companyLogo,
            }
          : {},
      );
    }
  }, [open, experience, form]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleFinish = (values: FormValues) => {
    const payload: ExperienceRequest = {
      company: values.company,
      role: values.role,
      location: values.location,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: current ? null : values.endDate?.format('YYYY-MM-DD'),
      description: values.description,
      companyLogoMediaId: values.companyLogo?.id ?? null,
    };
    if (experience) {
      updateMutation.mutate({ id: experience.id, payload }, { onSuccess: onClose });
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <Drawer
      title={experience ? 'Edit experience' : 'New experience'}
      open={open}
      onClose={onClose}
      size={520}
      destroyOnHidden
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" loading={isSaving} onClick={() => form.submit()}>
            Save
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="company" label="Company" rules={[{ required: true, message: 'Company is required' }]}>
          <Input placeholder="ZAAG SYSTEMS" />
        </Form.Item>
        <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Role is required' }]}>
          <Input placeholder="Software Engineer" />
        </Form.Item>
        <Form.Item name="location" label="Location">
          <Input placeholder="Dhaka, Bangladesh" />
        </Form.Item>
        <Form.Item name="startDate" label="Start date" rules={[{ required: true, message: 'Start date is required' }]}>
          <DatePicker className="w-full" picker="month" />
        </Form.Item>
        <Form.Item name="endDate" label="End date">
          <DatePicker className="w-full" picker="month" disabled={current} />
        </Form.Item>
        <Form.Item>
          <Checkbox checked={current} onChange={(e) => setCurrent(e.target.checked)}>
            Currently working here
          </Checkbox>
        </Form.Item>
        <Form.Item name="description" label="Description" extra="One bullet point per line">
          <Input.TextArea rows={5} placeholder={'Led the redesign of...\nImproved performance by...'} />
        </Form.Item>
        <Form.Item name="companyLogo" label="Company logo" valuePropName="value" trigger="onChange">
          <ImageUploader height={80} hint="Upload logo" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
