import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { extractErrorMessage } from '../../api/errorUtils';
import { useAuthStore } from '../../store/authStore';
import type { LoginRequest } from '../../types/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: (data) => {
      setSession(data.accessToken, data.refreshToken, data.user);
      message.success(`Welcome back, ${data.user.username}`);
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      message.error(extractErrorMessage(error));
    },
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      <motion.div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/40 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm px-4"
      >
        <Card className="rounded-2xl shadow-2xl" styles={{ body: { padding: 32 } }}>
          <div className="mb-6 text-center">
            <Typography.Title level={3} className="!mb-1">
              Portfolio Admin
            </Typography.Title>
            <Typography.Text type="secondary">Sign in to manage your portfolio</Typography.Text>
          </div>

          <Form layout="vertical" onFinish={(values: LoginRequest) => loginMutation.mutate(values)} requiredMark={false}>
            <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Username is required' }]}>
              <Input prefix={<UserOutlined className="text-gray-400" />} size="large" placeholder="admin" autoFocus />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
              <Input.Password prefix={<LockOutlined className="text-gray-400" />} size="large" placeholder="••••••••" />
            </Form.Item>
            <Form.Item className="!mb-0">
              <Button type="primary" htmlType="submit" size="large" block loading={loginMutation.isPending}>
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
}
