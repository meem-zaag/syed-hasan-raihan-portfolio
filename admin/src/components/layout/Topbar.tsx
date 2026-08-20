import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Dropdown, Layout } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const { Header } = Layout;

const labels: Record<string, string> = {
  dashboard: 'Dashboard',
  profile: 'Profile',
  pages: 'Pages & Sections',
  projects: 'Projects',
  skills: 'Skills',
  experience: 'Experience',
  education: 'Education',
  media: 'Media Library',
  messages: 'Messages',
  settings: 'Settings',
};

export function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  const segment = location.pathname.split('/')[1] || 'dashboard';
  const label = labels[segment] ?? segment;

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <Header className="!flex !items-center !justify-between !bg-white !px-6 shadow-sm">
      <Breadcrumb items={[{ title: 'Admin' }, { title: label }]} />
      <Dropdown
        menu={{
          items: [{ key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout }],
        }}
        trigger={['click']}
      >
        <div className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-50">
          <Avatar size="small" icon={<UserOutlined />} />
          <span className="text-sm font-medium text-gray-700">{user?.username ?? 'admin'}</span>
        </div>
      </Dropdown>
    </Header>
  );
}
