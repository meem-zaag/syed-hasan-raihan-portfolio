import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import type { ButtonProps } from 'antd';

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  title?: string;
  loading?: boolean;
  size?: ButtonProps['size'];
  type?: ButtonProps['type'];
  label?: string;
}

export function ConfirmDeleteButton({
  onConfirm,
  title = 'Delete this item? This cannot be undone.',
  loading,
  size = 'small',
  type = 'text',
  label,
}: ConfirmDeleteButtonProps) {
  return (
    <Popconfirm title={title} okText="Delete" okButtonProps={{ danger: true }} onConfirm={onConfirm}>
      <Button danger type={type} size={size} icon={<DeleteOutlined />} loading={loading}>
        {label}
      </Button>
    </Popconfirm>
  );
}
