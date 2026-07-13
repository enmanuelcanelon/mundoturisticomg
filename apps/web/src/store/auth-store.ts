import { create } from 'zustand';
import { api, authApi, type User } from '@/lib/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  hydrated: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await authApi.login(email, password);
      api.setTokens(res.accessToken, res.refreshToken);
      set({ user: res.user, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      const res = await authApi.register(data);
      api.setTokens(res.accessToken, res.refreshToken);
      set({ user: res.user, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null });
    }
  },

  loadMe: async () => {
    if (!api.isAuthenticated()) {
      set({ hydrated: true, user: null });
      return;
    }
    try {
      const user = await authApi.me();
      set({ user, hydrated: true });
    } catch {
      api.clearTokens();
      set({ user: null, hydrated: true });
    }
  },
}));
