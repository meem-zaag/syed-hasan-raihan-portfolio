import { GithubOutlined, GlobalOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Skeleton } from 'antd';
import { useEffect } from 'react';
import { ImageUploader } from '../../components/common/ImageUploader';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { RichTextField } from '../../components/common/RichTextField';
import { useProfileQuery, useUpdateProfile } from '../../hooks/useProfile';
import type { MediaResponse, ProfileUpdateRequest } from '../../types/api';

interface ProfileFormValues extends Omit<ProfileUpdateRequest, 'avatarMediaId' | 'resumeMediaId'> {
  avatar?: MediaResponse | null;
  resume?: MediaResponse | null;
}

export default function ProfileEditorPage() {
  const { data, isLoading } = useProfileQuery();
  const updateMutation = useUpdateProfile();
  const [form] = Form.useForm<ProfileFormValues>();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        fullName: data.fullName,
        title: data.title ?? undefined,
        tagline: data.tagline ?? undefined,
        bio: data.bio ?? undefined,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
        location: data.location ?? undefined,
        githubUrl: data.githubUrl ?? undefined,
        linkedinUrl: data.linkedinUrl ?? undefined,
        twitterUrl: data.twitterUrl ?? undefined,
        websiteUrl: data.websiteUrl ?? undefined,
        avatar: data.avatar,
        resume: data.resume,
      });
    }
  }, [data, form]);

  const handleFinish = (values: ProfileFormValues) => {
    const { avatar, resume, ...rest } = values;
    updateMutation.mutate({
      ...rest,
      avatarMediaId: avatar?.id ?? null,
      resumeMediaId: resume?.id ?? null,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  return (
    <div>
      <PageHeaderBar title="Profile" description="Your personal info shown across the portfolio site." />

      <Form form={form} layout="vertical" onFinish={handleFinish} disabled={updateMutation.isPending}>
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card title="Basic info" className="mb-4">
              <Form.Item name="fullName" label="Full name" rules={[{ required: true, message: 'Full name is required' }]}>
                <Input placeholder="Syed Hasan Raihan" />
              </Form.Item>
              <Form.Item name="title" label="Title / Headline">
                <Input placeholder="Software Engineer | React & Next.js Specialist" />
              </Form.Item>
              <Form.Item name="tagline" label="Tagline">
                <Input placeholder="A short one-liner shown under your name" />
              </Form.Item>
              <Form.Item name="bio" label="Bio">
                <RichTextField placeholder="A few paragraphs about you" />
              </Form.Item>
            </Card>

            <Card title="Contact">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Enter a valid email' }]}>
                    <Input placeholder="you@example.com" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="phone" label="Phone">
                    <Input placeholder="+8801XXXXXXXXX" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="location" label="Location">
                <Input placeholder="Dhaka, Bangladesh" />
              </Form.Item>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="githubUrl" label="GitHub">
                    <Input prefix={<GithubOutlined />} placeholder="https://github.com/username" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="linkedinUrl" label="LinkedIn">
                    <Input prefix={<LinkedinOutlined />} placeholder="https://linkedin.com/in/username" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="twitterUrl" label="Twitter / X">
                    <Input prefix={<TwitterOutlined />} placeholder="https://x.com/username" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="websiteUrl" label="Website">
                    <Input prefix={<GlobalOutlined />} placeholder="https://example.com" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Avatar" className="mb-4">
              <Form.Item name="avatar" valuePropName="value" trigger="onChange" noStyle>
                <ImageUploader height={140} hint="Upload avatar" />
              </Form.Item>
            </Card>
            <Card title="Resume (PDF)">
              <Form.Item name="resume" valuePropName="value" trigger="onChange" noStyle>
                <ImageUploader height={100} accept="application/pdf" hint="Upload resume PDF" />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Form.Item className="!mb-0">
          <Button type="primary" htmlType="submit" size="large" loading={updateMutation.isPending}>
            Save changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
