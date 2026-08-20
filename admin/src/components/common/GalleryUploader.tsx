import { DeleteOutlined, InboxOutlined, LoadingOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { Button, message, Tooltip, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { extractErrorMessage } from '../../api/errorUtils';
import type { MediaResponse } from '../../types/api';

const { Dragger } = Upload;

export interface GalleryItem {
  id: number;
  media: MediaResponse;
  cover?: boolean;
}

interface GalleryUploaderProps {
  items: GalleryItem[];
  onUpload: (file: File) => Promise<void>;
  onRemove: (itemId: number) => void;
  onSetCover?: (itemId: number) => void;
}

export function GalleryUploader({ items, onUpload, onRemove, onSetCover }: GalleryUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: RcFile) => {
    setUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      message.error(extractErrorMessage(error));
    } finally {
      setUploading(false);
    }
    return false;
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="group relative h-28 w-28 overflow-hidden rounded-lg border border-gray-200"
            >
              <img src={item.media.url} alt={item.media.altText ?? ''} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-1 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
                {onSetCover && (
                  <Tooltip title={item.cover ? 'Cover image' : 'Set as cover'}>
                    <Button
                      size="small"
                      shape="circle"
                      icon={item.cover ? <StarFilled className="text-yellow-400" /> : <StarOutlined className="text-white" />}
                      onClick={() => onSetCover(item.id)}
                    />
                  </Tooltip>
                )}
                <Tooltip title="Remove">
                  <Button size="small" shape="circle" danger icon={<DeleteOutlined />} onClick={() => onRemove(item.id)} />
                </Tooltip>
              </div>
              {item.cover && (
                <span className="absolute bottom-1 left-1 rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-semibold text-black">
                  Cover
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <Dragger accept="image/*" showUploadList={false} beforeUpload={handleUpload} className="!h-28 !w-28" disabled={uploading}>
          <div className="flex h-full flex-col items-center justify-center">
            {uploading ? <LoadingOutlined /> : <InboxOutlined />}
            <span className="mt-1 text-[11px]">Add image</span>
          </div>
        </Dragger>
      </div>
    </div>
  );
}
