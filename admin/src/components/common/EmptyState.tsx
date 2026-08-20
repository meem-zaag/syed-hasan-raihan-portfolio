import { Empty, Button } from 'antd';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-16">
      <Empty description={<span className="text-gray-500">{title}</span>} />
      {description && <p className="mt-1 max-w-sm text-center text-sm text-gray-400">{description}</p>}
      {actionLabel && onAction && (
        <Button type="primary" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
