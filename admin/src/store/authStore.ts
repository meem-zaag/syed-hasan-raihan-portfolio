import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSummary } from '../types/api';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserSummary | null;
  setSession: (accessToken: string, refreshToken: string, user: UserSummary) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: (accessToken, refreshToken, user) => set({ accessToken, refreshToken, user }),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: 'portfolio-admin-auth' },
  ),
);

export function isAuthenticated(): boolean {
  return Boolean(useAuthStore.getState().accessToken);
}
