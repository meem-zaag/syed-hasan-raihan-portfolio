import { Button, Card, Collapse, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useUpdatePage } from '../../hooks/usePages';
import type { PageResponse, PageUpdateRequest } from '../../types/api';

export function PageSettingsCard({ page }: { page: PageResponse }) {
  const [form] = Form.useForm<PageUpdateRequest>();
  const updateMutation = useUpdatePage(page.id);

  useEffect(() => {
    form.setFieldsValue({
      title: page.title,
      metaTitle: page.metaTitle ?? undefined,
      metaDescription: page.metaDescription ?? undefined,
    });
  }, [page, form]);

  return (
    <Card className="mb-4">
      <Collapse
        ghost
        items={[
          {
            key: 'settings',
            label: <span className="font-medium">Page settings ({page.slug})</span>,
            children: (
              <Form form={form} layout="vertical" onFinish={(values) => updateMutation.mutate(values)}>
                <Form.Item name="title" label="Page title" rules={[{ required: true, message: 'Title is required' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="metaTitle" label="Meta title (SEO)">
                  <Input />
                </Form.Item>
                <Form.Item name="metaDescription" label="Meta description (SEO)">
                  <Input.TextArea rows={2} />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
                  Save page settings
                </Button>
              </Form>
            ),
          },
        ]}
      />
    </Card>
  );
}
