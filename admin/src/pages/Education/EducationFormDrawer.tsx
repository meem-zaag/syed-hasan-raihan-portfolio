import { Button, DatePicker, Drawer, Form, Input, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useCreateEducation, useUpdateEducation } from '../../hooks/useEducation';
import { DATE_PRECISIONS, type DatePrecision, type EducationRequest, type EducationResponse } from '../../types/api';

interface EducationFormDrawerProps {
  open: boolean;
  education: EducationResponse | null;
  onClose: () => void;
}

interface FormValues {
  institution: string;
  degree: string;
  field?: string;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  datePrecision: DatePrecision;
  description?: string;
}

const PICKER_BY_PRECISION: Record<DatePrecision, 'date' | 'month' | 'year'> = {
  FULL: 'date',
  MONTH_YEAR: 'month',
  YEAR: 'year',
};

export function EducationFormDrawer({ open, education, onClose }: EducationFormDrawerProps) {
  const [form] = Form.useForm<FormValues>();
  const createMutation = useCreateEducation();
  const updateMutation = useUpdateEducation();
  const [precision, setPrecision] = useState<DatePrecision>('YEAR');

  useEffect(() => {
    if (open) {
      const p = education?.datePrecision ?? 'YEAR';
      setPrecision(p);
      form.setFieldsValue(
        education
          ? {
              institution: education.institution,
              degree: education.degree,
              field: education.field ?? undefined,
              startDate: education.startDate ? dayjs(education.startDate) : undefined,
              endDate: education.endDate ? dayjs(education.endDate) : undefined,
              datePrecision: p,
              description: education.description ?? undefined,
            }
          : { datePrecision: 'YEAR' },
      );
    }
  }, [open, education, form]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleFinish = (values: FormValues) => {
    const payload: EducationRequest = {
      institution: values.institution,
      degree: values.degree,
      field: values.field,
      startDate: values.startDate?.format('YYYY-MM-DD'),
      endDate: values.endDate?.format('YYYY-MM-DD'),
      datePrecision: values.datePrecision,
      description: values.description,
    };
    if (education) {
      updateMutation.mutate({ id: education.id, payload }, { onSuccess: onClose });
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <Drawer
      title={education ? 'Edit education' : 'New education'}
      open={open}
      onClose={onClose}
      size={480}
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
        <Form.Item name="institution" label="Institution" rules={[{ required: true, message: 'Institution is required' }]}>
          <Input placeholder="North South University" />
        </Form.Item>
        <Form.Item name="degree" label="Degree" rules={[{ required: true, message: 'Degree is required' }]}>
          <Input placeholder="Bachelor of Science (BS)" />
        </Form.Item>
        <Form.Item name="field" label="Field of study">
          <Input placeholder="Computer Science" />
        </Form.Item>
        <Form.Item name="datePrecision" label="Date precision">
          <Select
            options={DATE_PRECISIONS.map((p) => ({ value: p, label: p.replace('_', ' + ') }))}
            onChange={(value: DatePrecision) => setPrecision(value)}
          />
        </Form.Item>
        <Form.Item name="startDate" label="Start date">
          <DatePicker className="w-full" picker={PICKER_BY_PRECISION[precision]} />
        </Form.Item>
        <Form.Item name="endDate" label="End date">
          <DatePicker className="w-full" picker={PICKER_BY_PRECISION[precision]} />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
