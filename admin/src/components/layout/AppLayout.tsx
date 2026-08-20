import { Layout } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const { Content } = Layout;

export function AppLayout() {
  const location = useLocation();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginInlineStart: collapsed ? 64 : 200, transition: 'margin-inline-start 0.2s' }}>
        <Topbar />
        <Content className="m-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
}
