import { CloseCircleFilled, FilePdfOutlined, InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import { mediaApi } from '../../api/mediaApi';
import { extractErrorMessage } from '../../api/errorUtils';
import type { MediaResponse } from '../../types/api';

const { Dragger } = Upload;

interface ImageUploaderProps {
  value?: MediaResponse | null;
  onChange?: (media: MediaResponse | null) => void;
  accept?: string;
  hint?: string;
  height?: number;
}

export function ImageUploader({ value, onChange, accept = 'image/*', hint = 'Click or drag an image here', height = 160 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: RcFile) => {
    setUploading(true);
    try {
      const media = await mediaApi.upload(file);
      onChange?.(media);
    } catch (error) {
      message.error(extractErrorMessage(error));
    } finally {
      setUploading(false);
    }
    return false;
  };

  if (value) {
    const isImage = value.contentType?.startsWith('image/');
    return (
      <div className="relative inline-block" style={{ width: height * 1.4, height }}>
        {isImage ? (
          <img
            src={value.url}
            alt={value.altText ?? value.originalFileName}
            className="h-full w-full rounded-lg border border-gray-200 object-cover"
          />
        ) : (
          <a
            href={value.url}
            target="_blank"
            rel="noreferrer"
            className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 text-center"
          >
            <FilePdfOutlined className="text-2xl text-red-500" />
            <span className="w-full truncate text-xs text-gray-600">{value.originalFileName}</span>
          </a>
        )}
        <button
          type="button"
          onClick={() => onChange?.(null)}
          className="absolute -right-2 -top-2 rounded-full bg-white text-red-500 shadow"
          aria-label="Remove image"
        >
          <CloseCircleFilled style={{ fontSize: 20 }} />
        </button>
      </div>
    );
  }

  return (
    <Dragger
      accept={accept}
      showUploadList={false}
      beforeUpload={handleUpload}
      style={{ height, width: height * 1.4 }}
      disabled={uploading}
    >
      <p className="ant-upload-drag-icon">{uploading ? <LoadingOutlined /> : <InboxOutlined />}</p>
      <p className="ant-upload-text text-xs">{uploading ? 'Uploading…' : hint}</p>
    </Dragger>
  );
}
