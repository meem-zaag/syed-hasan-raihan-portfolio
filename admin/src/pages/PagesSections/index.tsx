import { EditOutlined, HolderOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Segmented, Skeleton, Switch, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { ConfirmDeleteButton } from '../../components/common/ConfirmDeleteButton';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { DragSortList } from '../../components/common/DragSortList';
import {
  useDeleteSection,
  usePagesQuery,
  useReorderSections,
  useSectionsQuery,
  useUpdateSection,
} from '../../hooks/usePages';
import type { SectionResponse } from '../../types/api';
import { PageSettingsCard } from './PageSettingsCard';
import { SectionFormDrawer } from './SectionFormDrawer';

export default function PagesSectionsPage() {
  const { data: pages, isLoading: pagesLoading } = usePagesQuery();
  const [selectedPageId, setSelectedPageId] = useState<number | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);

  useEffect(() => {
    if (pages && pages.length > 0 && selectedPageId === undefined) {
      setSelectedPageId(pages[0].id);
    }
  }, [pages, selectedPageId]);

  const { data: sections, isLoading: sectionsLoading } = useSectionsQuery(selectedPageId);
  const reorderMutation = useReorderSections(selectedPageId ?? 0);
  const updateMutation = useUpdateSection(selectedPageId ?? 0);
  const deleteMutation = useDeleteSection(selectedPageId ?? 0);

  const selectedPage = pages?.find((p) => p.id === selectedPageId);
  const editingSection = sections?.find((s) => s.id === editingSectionId) ?? null;

  const openCreate = () => {
    setEditingSectionId(null);
    setDrawerOpen(true);
  };
  const openEdit = (section: SectionResponse) => {
    setEditingSectionId(section.id);
    setDrawerOpen(true);
  };

  return (
    <div>
      <PageHeaderBar
        title="Pages & Sections"
        description="Manage the heading, subheading, description, and images of every section on every page."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} disabled={!selectedPageId}>
            Add section
          </Button>
        }
      />

      {pagesLoading ? (
        <Skeleton active />
      ) : (
        <Segmented
          className="mb-4"
          value={selectedPageId}
          onChange={(value) => setSelectedPageId(value as number)}
          options={(pages ?? []).map((p) => ({ label: p.title || p.slug, value: p.id }))}
        />
      )}

      {selectedPage && <PageSettingsCard page={selectedPage} />}

      {sectionsLoading ? (
        <Card>
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      ) : !sections || sections.length === 0 ? (
        <Card>
          <Empty description="No sections yet on this page">
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Add the first section
            </Button>
          </Empty>
        </Card>
      ) : (
        <DragSortList
          items={sections}
          onReorder={(reordered) => {
            reorderMutation.mutate(reordered.map((s, index) => ({ id: s.id, orderIndex: index })));
          }}
          className="space-y-3"
          renderItem={(section, dragHandle) => (
            <Card size="small" className="!shadow-sm">
              <div className="flex items-center gap-3">
                <span {...dragHandle.attributes} {...dragHandle.listeners} className="cursor-grab text-gray-300 hover:text-gray-500">
                  <HolderOutlined />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-gray-800">{section.heading || section.sectionKey}</span>
                    <Tag>{section.sectionType}</Tag>
                    {!section.visible && <Tag color="default">Hidden</Tag>}
                  </div>
                  {section.subheading && <p className="truncate text-sm text-gray-500">{section.subheading}</p>}
                </div>
                <Switch
                  size="small"
                  checked={section.visible}
                  onChange={(checked) =>
                    updateMutation.mutate({
                      sectionId: section.id,
                      payload: {
                        sectionKey: section.sectionKey,
                        heading: section.heading,
                        subheading: section.subheading,
                        description: section.description,
                        sectionType: section.sectionType,
                        visible: checked,
                      },
                    })
                  }
                />
                <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(section)} />
                <ConfirmDeleteButton onConfirm={() => deleteMutation.mutate(section.id)} />
              </div>
            </Card>
          )}
        />
      )}

      {selectedPageId && (
        <SectionFormDrawer
          pageId={selectedPageId}
          open={drawerOpen}
          section={editingSection}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
}
