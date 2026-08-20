import { FileImageOutlined, LayoutOutlined, MailOutlined, ProjectOutlined, RightOutlined } from '@ant-design/icons';
import { Alert, Card, Skeleton, Statistic } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { useDashboardSummaryQuery } from '../../hooks/useDashboard';

const cardMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useDashboardSummaryQuery();

  return (
    <div>
      <PageHeaderBar title="Dashboard" description="A quick look at your portfolio content." />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div {...cardMotion} transition={{ delay: 0 }}>
            <Card hoverable onClick={() => navigate('/messages')} className="cursor-pointer">
              <Statistic
                title="Unread Messages"
                value={data?.unreadMessagesCount ?? 0}
                prefix={<MailOutlined className="mr-1 text-brand" />}
              />
            </Card>
          </motion.div>
          <motion.div {...cardMotion} transition={{ delay: 0.05 }}>
            <Card hoverable onClick={() => navigate('/projects')} className="cursor-pointer">
              <Statistic
                title="Projects"
                value={data?.totalProjects ?? 0}
                prefix={<ProjectOutlined className="mr-1 text-brand" />}
              />
            </Card>
          </motion.div>
          <motion.div {...cardMotion} transition={{ delay: 0.1 }}>
            <Card hoverable onClick={() => navigate('/pages')} className="cursor-pointer">
              <Statistic
                title="Sections"
                value={data?.totalSections ?? 0}
                prefix={<LayoutOutlined className="mr-1 text-brand" />}
              />
            </Card>
          </motion.div>
          <motion.div {...cardMotion} transition={{ delay: 0.15 }}>
            <Card hoverable onClick={() => navigate('/media')} className="cursor-pointer">
              <Statistic
                title="Media Files"
                value={data?.totalMedia ?? 0}
                prefix={<FileImageOutlined className="mr-1 text-brand" />}
              />
            </Card>
          </motion.div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {data?.lastEditedSection && (
          <Card
            title="Last edited section"
            hoverable
            onClick={() => navigate('/pages')}
            className="cursor-pointer"
            extra={<RightOutlined className="text-gray-400" />}
          >
            <p className="text-base font-medium text-gray-800">{data.lastEditedSection.heading || 'Untitled section'}</p>
            <p className="text-sm text-gray-500">
              on the <span className="font-medium">{data.lastEditedSection.pageSlug}</span> page
            </p>
          </Card>
        )}

        <Alert
          type="info"
          showIcon
          title="Add your remaining projects"
          description="Your CV only lists a subset of your real project history. Head to the Projects manager to add the rest — nothing beyond the CV was auto-generated."
          action={
            <a onClick={() => navigate('/projects')} className="cursor-pointer font-medium text-brand">
              Go to Projects <RightOutlined />
            </a>
          }
        />
      </div>
    </div>
  );
}
