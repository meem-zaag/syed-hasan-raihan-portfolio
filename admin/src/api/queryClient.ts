import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { notification } from 'antd';
import { extractErrorMessage } from './errorUtils';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      notification.error({ message: 'Failed to load data', description: extractErrorMessage(error) });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      notification.error({ message: 'Action failed', description: extractErrorMessage(error) });
    },
  }),
});
