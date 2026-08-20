import { DeleteOutlined, FilePdfOutlined, InboxOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Pagination, Popconfirm, Select, Skeleton, Tag, Tooltip, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { useDeleteMedia, useMediaQuery, useUploadMedia } from '../../hooks/useMedia';

const { Dragger } = Upload;

const CONTENT_TYPE_OPTIONS = [
  { value: 'image/', label: 'Images' },
  { value: 'application/pdf', label: 'PDFs' },
];

export default function MediaPage() {
  const [search, setSearch] = useState('');
  const [contentType, setContentType] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMediaQuery({ search: search || undefined, contentType, page: page - 1, size: 24 });
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  const handleUpload = (file: RcFile) => {
    uploadMutation.mutate({ file });
    return false;
  };

  return (
    <div>
      <PageHeaderBar title="Media Library" description="All images and files uploaded across the portfolio." />

      <Dragger
        multiple
        showUploadList={false}
        beforeUpload={handleUpload}
        className="!mb-4"
        disabled={uploadMutation.isPending}
      >
        <p className="ant-upload-drag-icon">{uploadMutation.isPending ? <LoadingOutlined /> : <InboxOutlined />}</p>
        <p className="ant-upload-text">Click or drag files here to upload</p>
        <p className="ant-upload-hint text-xs text-gray-400">Images and PDFs, up to 10MB each</p>
      </Dragger>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search files"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select allowClear placeholder="File type" className="min-w-[140px]" value={contentType} onChange={setContentType} options={CONTENT_TYPE_OPTIONS} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton.Image key={i} active className="!h-32 !w-full" />
          ))}
        </div>
      ) : !data || data.content.length === 0 ? (
        <EmptyState title="No media uploaded yet" description="Upload images and files above to use them across your portfolio." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <AnimatePresence>
              {data.content.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card
                    size="small"
                    className="group relative overflow-hidden"
                    styles={{ body: { padding: 8 } }}
                    cover={
                      <div className="flex h-24 items-center justify-center bg-gray-50">
                        {item.contentType.startsWith('image/') ? (
                          <img src={item.url} alt={item.altText ?? item.originalFileName} className="h-full w-full object-cover" />
                        ) : (
                          <FilePdfOutlined className="text-3xl text-red-400" />
                        )}
                      </div>
                    }
                  >
                    <div className="truncate text-xs text-gray-600" title={item.originalFileName}>
                      {item.originalFileName}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      {item.linkedEntityType ? (
                        <Tag color="blue" className="!text-[10px]">
                          In use
                        </Tag>
                      ) : (
                        <Tag className="!text-[10px]">Unused</Tag>
                      )}
                      <Popconfirm
                        title={item.linkedEntityType ? 'This file is referenced elsewhere. Delete anyway?' : 'Delete this file?'}
                        okButtonProps={{ danger: true }}
                        onConfirm={() => deleteMutation.mutate(item.id)}
                      >
                        <Tooltip title="Delete">
                          <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                      </Popconfirm>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-4 flex justify-end">
            <Pagination current={page} pageSize={24} total={data.totalElements} onChange={setPage} showSizeChanger={false} />
          </div>
        </>
      )}
    </div>
  );
}
