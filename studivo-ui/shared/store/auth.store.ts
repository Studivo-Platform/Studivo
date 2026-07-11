"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/shared/types/models.types';

interface AuthState {
  user:            AuthUser | null;
  accessToken:     string | null;
  isAuthenticated: boolean;

  setAuth:        (user: AuthUser, token: string) => void;
  setAccessToken: (token: string) => void;
  setUser:        (user: AuthUser) => void;
  logout:         () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      setUser: (user) =>
        set({ user }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'studivo-auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
    }
  )
);
