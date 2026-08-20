import { EditOutlined, HolderOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Card, Skeleton } from 'antd';
import { Button } from 'antd';
import { useState } from 'react';
import { ConfirmDeleteButton } from '../../components/common/ConfirmDeleteButton';
import { DragSortList } from '../../components/common/DragSortList';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { useDeleteExperience, useExperienceQuery, useReorderExperience } from '../../hooks/useExperience';
import type { ExperienceResponse } from '../../types/api';
import { ExperienceFormDrawer } from './ExperienceFormDrawer';

function formatRange(startDate: string, endDate: string | null) {
  const start = new Date(startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  const end = endDate ? new Date(endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present';
  return `${start} – ${end}`;
}

export default function ExperiencePage() {
  const { data, isLoading } = useExperienceQuery();
  const reorderMutation = useReorderExperience();
  const deleteMutation = useDeleteExperience();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const editing = data?.find((e) => e.id === editingId) ?? null;

  const openCreate = () => {
    setEditingId(null);
    setDrawerOpen(true);
  };
  const openEdit = (item: ExperienceResponse) => {
    setEditingId(item.id);
    setDrawerOpen(true);
  };

  return (
    <div>
      <PageHeaderBar
        title="Experience"
        description="Your work history, shown most-recent first."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add experience
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No experience entries yet" actionLabel="Add experience" onAction={openCreate} />
      ) : (
        <DragSortList
          items={data}
          onReorder={(reordered) => reorderMutation.mutate(reordered)}
          className="space-y-3"
          renderItem={(item, dragHandle) => (
            <Card size="small">
              <div className="flex items-center gap-3">
                <span {...dragHandle.attributes} {...dragHandle.listeners} className="cursor-grab text-gray-300 hover:text-gray-500">
                  <HolderOutlined />
                </span>
                {item.companyLogo ? (
                  <Avatar src={item.companyLogo.url} size={40} />
                ) : (
                  <Avatar size={40}>{item.company.charAt(0)}</Avatar>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-800">
                    {item.role} · {item.company}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatRange(item.startDate, item.endDate)}
                    {item.location ? ` · ${item.location}` : ''}
                  </div>
                </div>
                <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(item)} />
                <ConfirmDeleteButton onConfirm={() => deleteMutation.mutate(item.id)} />
              </div>
            </Card>
          )}
        />
      )}

      <ExperienceFormDrawer open={drawerOpen} experience={editing} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
