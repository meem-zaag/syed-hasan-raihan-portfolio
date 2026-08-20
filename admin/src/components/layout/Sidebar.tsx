import {
  DashboardOutlined,
  FileImageOutlined,
  IdcardOutlined,
  LayoutOutlined,
  MailOutlined,
  ProjectOutlined,
  ReadOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';

const { Sider } = Layout;

const items = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/profile', icon: <UserOutlined />, label: 'Profile' },
  { key: '/pages', icon: <LayoutOutlined />, label: 'Pages & Sections' },
  { key: '/projects', icon: <ProjectOutlined />, label: 'Projects' },
  { key: '/skills', icon: <StarOutlined />, label: 'Skills' },
  { key: '/experience', icon: <IdcardOutlined />, label: 'Experience' },
  { key: '/education', icon: <ReadOutlined />, label: 'Education' },
  { key: '/media', icon: <FileImageOutlined />, label: 'Media Library' },
  { key: '/messages', icon: <MailOutlined />, label: 'Messages' },
  { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const setCollapsed = useUiStore((s) => s.setSidebarCollapsed);

  const selectedKey = '/' + (location.pathname.split('/')[1] || 'dashboard');

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      breakpoint="lg"
      collapsedWidth={64}
      theme="light"
      className="!fixed !left-0 !top-0 !bottom-0 !overflow-auto border-r border-gray-100"
    >
      <div className="flex h-16 items-center justify-center overflow-hidden px-2">
        {collapsed ? (
          <span className="text-lg font-bold text-brand">SHR</span>
        ) : (
          <span className="whitespace-nowrap text-base font-bold text-brand">Syed Hasan Raihan</span>
        )}
      </div>
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[selectedKey]}
        items={items}
        onClick={({ key }) => navigate(key)}
        style={{ borderInlineEnd: 'none' }}
      />
    </Sider>
  );
}
