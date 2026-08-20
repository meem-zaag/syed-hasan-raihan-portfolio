import { apiClient } from './client';
import type { LoginRequest, TokenPairResponse } from '../types/api';

export const authApi = {
  login: (payload: LoginRequest) => apiClient.post<TokenPairResponse>('/auth/login', payload).then((r) => r.data),
};
