import { EditOutlined, HolderOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Skeleton } from 'antd';
import { useState } from 'react';
import { ConfirmDeleteButton } from '../../components/common/ConfirmDeleteButton';
import { DragSortList } from '../../components/common/DragSortList';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { useDeleteEducation, useEducationQuery, useReorderEducation } from '../../hooks/useEducation';
import type { EducationResponse } from '../../types/api';
import { EducationFormDrawer } from './EducationFormDrawer';

function formatDate(value: string | null, precision: string) {
  if (!value) return '';
  const date = new Date(value);
  if (precision === 'YEAR') return date.getFullYear().toString();
  if (precision === 'MONTH_YEAR') return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  return date.toLocaleDateString();
}

export default function EducationPage() {
  const { data, isLoading } = useEducationQuery();
  const reorderMutation = useReorderEducation();
  const deleteMutation = useDeleteEducation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const editing = data?.find((e) => e.id === editingId) ?? null;

  const openCreate = () => {
    setEditingId(null);
    setDrawerOpen(true);
  };
  const openEdit = (item: EducationResponse) => {
    setEditingId(item.id);
    setDrawerOpen(true);
  };

  return (
    <div>
      <PageHeaderBar
        title="Education"
        description="Your academic background."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add education
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No education entries yet" actionLabel="Add education" onAction={openCreate} />
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
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-800">{item.institution}</div>
                  <div className="text-xs text-gray-500">
                    {item.degree}
                    {item.field ? `, ${item.field}` : ''} ·{' '}
                    {item.startDate && formatDate(item.startDate, item.datePrecision)}
                    {item.endDate ? ` – ${formatDate(item.endDate, item.datePrecision)}` : ''}
                  </div>
                </div>
                <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(item)} />
                <ConfirmDeleteButton onConfirm={() => deleteMutation.mutate(item.id)} />
              </div>
            </Card>
          )}
        />
      )}

      <EducationFormDrawer open={drawerOpen} education={editing} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
