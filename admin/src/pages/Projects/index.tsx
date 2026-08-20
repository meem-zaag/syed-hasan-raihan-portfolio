import { EditOutlined, PlusOutlined, SearchOutlined, StarFilled } from '@ant-design/icons';
import { Button, Input, Select, Switch, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { ConfirmDeleteButton } from '../../components/common/ConfirmDeleteButton';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { useDeleteProject, useProjectsQuery } from '../../hooks/useProjects';
import type { ProjectResponse } from '../../types/api';
import { ProjectFormDrawer } from './ProjectFormDrawer';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  const { data, isLoading } = useProjectsQuery({ search: search || undefined, category, page: page - 1, size: 10 });
  const deleteMutation = useDeleteProject();

  const rows = useMemo(() => (featuredOnly ? (data?.content ?? []).filter((p) => p.featured) : data?.content ?? []), [
    data,
    featuredOnly,
  ]);

  const categories = useMemo(
    () => Array.from(new Set((data?.content ?? []).map((p) => p.category).filter(Boolean))) as string[],
    [data],
  );

  const editingProject = rows.find((p) => p.id === editingProjectId) ?? null;

  const openCreate = () => {
    setEditingProjectId(null);
    setDrawerOpen(true);
  };
  const openEdit = (project: ProjectResponse) => {
    setEditingProjectId(project.id);
    setDrawerOpen(true);
  };

  return (
    <div>
      <PageHeaderBar
        title="Projects"
        description="Manage your project portfolio — the CV only seeded a handful, add the rest here."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add project
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search projects"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          allowClear
          placeholder="Category"
          className="min-w-[160px]"
          value={category}
          onChange={setCategory}
          options={categories.map((c) => ({ value: c, label: c }))}
        />
        <div className="flex items-center gap-2">
          <Switch checked={featuredOnly} onChange={setFeaturedOnly} />
          <span className="text-sm text-gray-600">Featured only</span>
        </div>
      </div>

      {!isLoading && rows.length === 0 ? (
        <EmptyState title="No projects yet" description="Add your first project to get started." actionLabel="Add project" onAction={openCreate} />
      ) : (
        <Table<ProjectResponse>
          rowKey="id"
          loading={isLoading}
          dataSource={rows}
          pagination={{
            current: page,
            pageSize: 10,
            total: data?.totalElements ?? 0,
            onChange: setPage,
          }}
          columns={[
            {
              title: '',
              dataIndex: 'images',
              width: 56,
              render: (_: unknown, project) => {
                const cover = project.images.find((i) => i.cover) ?? project.images[0];
                return cover ? (
                  <img src={cover.media.url} alt="" className="h-10 w-10 rounded object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded bg-gray-100" />
                );
              },
            },
            {
              title: 'Title',
              dataIndex: 'title',
              render: (title: string, project) => (
                <div>
                  <div className="flex items-center gap-1 font-medium text-gray-800">
                    {title}
                    {project.featured && <StarFilled className="text-yellow-400" />}
                  </div>
                  {project.clientName && <div className="text-xs text-gray-400">{project.clientName}</div>}
                </div>
              ),
            },
            { title: 'Category', dataIndex: 'category', render: (v: string) => v || <span className="text-gray-300">—</span> },
            {
              title: 'Status',
              dataIndex: 'status',
              render: (status: string) => (
                <Tag color={status === 'IN_PROGRESS' ? 'blue' : 'green'}>{status.replace('_', ' ')}</Tag>
              ),
            },
            {
              title: 'Tech',
              dataIndex: 'techStack',
              render: (tags: string[]) => (
                <div className="flex max-w-xs flex-wrap gap-1">
                  {tags.slice(0, 3).map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                  {tags.length > 3 && <Tag>+{tags.length - 3}</Tag>}
                </div>
              ),
            },
            {
              title: '',
              key: 'actions',
              width: 100,
              render: (_: unknown, project) => (
                <div className="flex justify-end gap-1">
                  <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(project)} />
                  <ConfirmDeleteButton onConfirm={() => deleteMutation.mutate(project.id)} />
                </div>
              ),
            },
          ]}
        />
      )}

      <ProjectFormDrawer open={drawerOpen} project={editingProject} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
