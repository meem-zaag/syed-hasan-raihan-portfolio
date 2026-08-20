import { Button, Card, ColorPicker, Form, Input, Skeleton } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { useEffect } from 'react';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { useSettingsQuery, useUpdateSettings } from '../../hooks/useSettings';
import type { SiteSettingsRequest } from '../../types/api';

interface FormValues extends Omit<SiteSettingsRequest, 'themeAccentColor'> {
  themeAccentColor?: string | Color;
}

export default function SettingsPage() {
  const { data, isLoading } = useSettingsQuery();
  const updateMutation = useUpdateSettings();
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        seoDefaultTitle: data.seoDefaultTitle ?? undefined,
        seoDefaultDescription: data.seoDefaultDescription ?? undefined,
        themeAccentColor: data.themeAccentColor ?? '#4f46e5',
      });
    }
  }, [data, form]);

  const handleFinish = (values: FormValues) => {
    const color = values.themeAccentColor;
    updateMutation.mutate({
      seoDefaultTitle: values.seoDefaultTitle,
      seoDefaultDescription: values.seoDefaultDescription,
      themeAccentColor: typeof color === 'string' ? color : color?.toHexString(),
    });
  };

  if (isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  return (
    <div>
      <PageHeaderBar title="Settings" description="Site-wide defaults." />
      <Card className="max-w-xl">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="seoDefaultTitle" label="Default SEO title">
            <Input placeholder="Syed Hasan Raihan — Software Engineer" />
          </Form.Item>
          <Form.Item name="seoDefaultDescription" label="Default SEO description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="themeAccentColor" label="Theme accent color">
            <ColorPicker format="hex" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
            Save settings
          </Button>
        </Form>
      </Card>
    </div>
  );
}
