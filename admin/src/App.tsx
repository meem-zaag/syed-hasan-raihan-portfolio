import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { App as AntdApp, ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from './api/queryClient';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppRouter } from './router';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 8,
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </ErrorBoundary>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
