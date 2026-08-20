import { Button, Checkbox, Col, DatePicker, Drawer, Form, Input, InputNumber, Row, Select, Space, Switch } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { mediaApi } from '../../api/mediaApi';
import { GalleryUploader } from '../../components/common/GalleryUploader';
import { RichTextField } from '../../components/common/RichTextField';
import { useAttachProjectImage, useCreateProject, useDetachProjectImage, useUpdateProject } from '../../hooks/useProjects';
import { PROJECT_STATUSES, type ProjectRequest, type ProjectResponse } from '../../types/api';

interface ProjectFormDrawerProps {
  open: boolean;
  project: ProjectResponse | null;
  onClose: () => void;
}

interface FormValues extends Omit<ProjectRequest, 'startDate' | 'endDate'> {
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  ongoing?: boolean;
}

export function ProjectFormDrawer({ open, project, onClose }: ProjectFormDrawerProps) {
  const [form] = Form.useForm<FormValues>();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const attachImage = useAttachProjectImage();
  const detachImage = useDetachProjectImage();
  const [ongoing, setOngoing] = useState(false);

  useEffect(() => {
    if (open) {
      const isOngoing = Boolean(project) && !project?.endDate;
      setOngoing(isOngoing);
      form.setFieldsValue(
        project
          ? {
              title: project.title,
              slug: project.slug,
              summary: project.summary ?? undefined,
              description: project.description ?? undefined,
              clientName: project.clientName ?? undefined,
              category: project.category ?? undefined,
              status: project.status,
              repoUrl: project.repoUrl ?? undefined,
              liveUrl: project.liveUrl ?? undefined,
              featured: project.featured,
              techStack: project.techStack,
              startDate: project.startDate ? dayjs(project.startDate) : undefined,
              endDate: project.endDate ? dayjs(project.endDate) : undefined,
              ongoing: isOngoing,
            }
          : { status: 'COMPLETED', featured: false, techStack: [] },
      );
    }
  }, [open, project, form]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleFinish = (values: FormValues) => {
    const { ongoing: _ongoing, startDate, endDate, ...rest } = values;
    const payload: ProjectRequest = {
      ...rest,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
      endDate: !ongoing && endDate ? endDate.format('YYYY-MM-DD') : null,
    };
    if (project) {
      updateMutation.mutate({ id: project.id, payload }, { onSuccess: onClose });
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <Drawer
      title={project ? `Edit project: ${project.title}` : 'New project'}
      open={open}
      onClose={onClose}
      size={640}
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
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
          <Input placeholder="Project title" />
        </Form.Item>
        <Form.Item name="slug" label="Slug" extra="Leave blank to auto-generate from the title">
          <Input placeholder="project-title" />
        </Form.Item>
        <Form.Item name="summary" label="Summary" rules={[{ max: 500, message: 'Max 500 characters' }]}>
          <Input.TextArea rows={2} placeholder="A one or two sentence summary" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <RichTextField placeholder="Full project description" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="clientName" label="Client / Company">
              <Input placeholder="e.g. British American Tobacco" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="category" label="Category">
              <Input placeholder="e.g. E-commerce" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="repoUrl" label="Repo URL">
              <Input placeholder="https://github.com/..." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="liveUrl" label="Live URL">
              <Input placeholder="https://..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item name="status" label="Status">
              <Select options={PROJECT_STATUSES.map((s) => ({ value: s, label: s.replace('_', ' ') }))} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="orderIndex" label="Order">
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="featured" label="Featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} align="middle">
          <Col xs={24} sm={10}>
            <Form.Item name="startDate" label="Start date">
              <DatePicker className="w-full" picker="month" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={10}>
            <Form.Item name="endDate" label="End date">
              <DatePicker className="w-full" picker="month" disabled={ongoing} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={4}>
            <Form.Item label=" ">
              <Checkbox checked={ongoing} onChange={(e) => setOngoing(e.target.checked)}>
                Ongoing
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="techStack" label="Tech stack">
          <Select mode="tags" placeholder="Add technologies and press enter" tokenSeparators={[',']} />
        </Form.Item>
      </Form>

      {project && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Gallery</p>
          <GalleryUploader
            items={project.images.map((img) => ({ id: img.id, media: img.media, cover: img.cover }))}
            onUpload={async (file) => {
              const media = await mediaApi.upload(file);
              await attachImage.mutateAsync({ id: project.id, payload: { mediaId: media.id } });
            }}
            onRemove={(projectImageId) => detachImage.mutate({ id: project.id, projectImageId })}
            onSetCover={async (projectImageId) => {
              // No dedicated "set cover" endpoint — re-attach the same media as cover, then drop the old row.
              const image = project.images.find((img) => img.id === projectImageId);
              if (!image) return;
              await attachImage.mutateAsync({ id: project.id, payload: { mediaId: image.media.id, orderIndex: image.orderIndex, cover: true } });
              await detachImage.mutateAsync({ id: project.id, projectImageId });
            }}
          />
        </div>
      )}
    </Drawer>
  );
}
