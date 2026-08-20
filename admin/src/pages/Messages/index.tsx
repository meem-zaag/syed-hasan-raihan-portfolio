import { DeleteOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Drawer, Empty, List, Skeleton, Switch, Tag } from 'antd';
import { useState } from 'react';
import { ConfirmDeleteButton } from '../../components/common/ConfirmDeleteButton';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { useDeleteMessage, useMarkMessageRead, useMessagesQuery } from '../../hooks/useMessages';
import type { ContactMessageResponse } from '../../types/api';

export default function MessagesPage() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ContactMessageResponse | null>(null);

  const { data, isLoading } = useMessagesQuery({ unreadOnly, page: page - 1, size: 20 });
  const markRead = useMarkMessageRead();
  const deleteMutation = useDeleteMessage();

  const openMessage = (message: ContactMessageResponse) => {
    setSelected(message);
    if (!message.read) markRead.mutate(message.id);
  };

  return (
    <div>
      <PageHeaderBar
        title="Messages"
        description="Submissions from your portfolio's contact form."
        actions={
          <div className="flex items-center gap-2">
            <Switch checked={unreadOnly} onChange={setUnreadOnly} />
            <span className="text-sm text-gray-600">Unread only</span>
          </div>
        }
      />

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : !data || data.content.length === 0 ? (
        <Empty description="No messages yet" />
      ) : (
        <List
          bordered
          className="bg-white"
          dataSource={data.content}
          pagination={{ current: page, pageSize: 20, total: data.totalElements, onChange: setPage }}
          renderItem={(item) => (
            <List.Item
              className="!cursor-pointer hover:bg-gray-50"
              onClick={() => openMessage(item)}
              actions={[
                <ConfirmDeleteButton key="delete" onConfirm={() => deleteMutation.mutate(item.id)} />,
              ]}
            >
              <List.Item.Meta
                avatar={<MailOutlined className={item.read ? 'text-gray-300' : 'text-brand'} />}
                title={
                  <span className={item.read ? 'font-normal text-gray-700' : 'font-semibold text-gray-900'}>
                    {item.name} {!item.read && <Tag color="blue">New</Tag>}
                  </span>
                }
                description={
                  <div className="truncate text-sm text-gray-500">
                    {item.subject ? `${item.subject} — ` : ''}
                    {item.message}
                  </div>
                }
              />
              <span className="ml-4 shrink-0 text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
            </List.Item>
          )}
        />
      )}

      <Drawer title={selected?.subject || 'Message'} open={Boolean(selected)} onClose={() => setSelected(null)} size={480}>
        {selected && (
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase text-gray-400">From</p>
              <p className="font-medium text-gray-800">
                {selected.name} &lt;{selected.email}&gt;
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-400">Received</p>
              <p className="text-sm text-gray-600">{new Date(selected.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-400">Message</p>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{selected.message}</p>
            </div>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteMutation.mutate(selected.id);
                setSelected(null);
              }}
            >
              Delete message
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
