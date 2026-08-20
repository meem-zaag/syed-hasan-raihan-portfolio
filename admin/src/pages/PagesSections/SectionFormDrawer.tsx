import { Button, Drawer, Form, Input, Select, Space, Switch } from 'antd';
import { useEffect } from 'react';
import { mediaApi } from '../../api/mediaApi';
import { GalleryUploader } from '../../components/common/GalleryUploader';
import { RichTextField } from '../../components/common/RichTextField';
import {
  useAttachSectionImage,
  useCreateSection,
  useDetachSectionImage,
  useUpdateSection,
} from '../../hooks/usePages';
import type { SectionRequest, SectionResponse } from '../../types/api';

const SECTION_TYPES = ['HERO', 'CTA', 'GALLERY', 'GENERIC'];

interface SectionFormDrawerProps {
  pageId: number;
  open: boolean;
  section: SectionResponse | null;
  onClose: () => void;
}

export function SectionFormDrawer({ pageId, open, section, onClose }: SectionFormDrawerProps) {
  const [form] = Form.useForm<SectionRequest>();
  const createMutation = useCreateSection(pageId);
  const updateMutation = useUpdateSection(pageId);
  const attachImage = useAttachSectionImage(pageId);
  const detachImage = useDetachSectionImage(pageId);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        section
          ? {
              sectionKey: section.sectionKey,
              heading: section.heading ?? undefined,
              subheading: section.subheading ?? undefined,
              description: section.description ?? undefined,
              sectionType: section.sectionType,
              visible: section.visible,
            }
          : { sectionType: 'GENERIC', visible: true },
      );
    }
  }, [open, section, form]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleFinish = (values: SectionRequest) => {
    if (section) {
      updateMutation.mutate(
        { sectionId: section.id, payload: values },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(values, { onSuccess: onClose });
    }
  };

  return (
    <Drawer
      title={section ? `Edit section: ${section.sectionKey}` : 'New section'}
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
        <Form.Item
          name="sectionKey"
          label="Section key"
          extra="A stable identifier for this section (e.g. hero, intro, cta) — used by the site to find it."
          rules={[{ required: true, message: 'Section key is required' }]}
        >
          <Input placeholder="hero" disabled={Boolean(section)} />
        </Form.Item>
        <Form.Item name="sectionType" label="Section type">
          <Select options={SECTION_TYPES.map((t) => ({ value: t, label: t }))} />
        </Form.Item>
        <Form.Item name="heading" label="Heading">
          <Input placeholder="Section heading" />
        </Form.Item>
        <Form.Item name="subheading" label="Subheading">
          <Input placeholder="Section subheading" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <RichTextField placeholder="Section description" />
        </Form.Item>
        <Form.Item name="visible" label="Visible on site" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>

      {section && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Images</p>
          <GalleryUploader
            items={section.images.map((img) => ({ id: img.id, media: img.media }))}
            onUpload={async (file) => {
              const media = await mediaApi.upload(file);
              await attachImage.mutateAsync({ sectionId: section.id, payload: { mediaId: media.id } });
            }}
            onRemove={(sectionImageId) => detachImage.mutate({ sectionId: section.id, sectionImageId })}
          />
        </div>
      )}
    </Drawer>
  );
}
