import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppState = {
  successRate: number;
  setSuccessRate: (rate: number) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      successRate: 7, // Default baseline
      setSuccessRate: (rate: number) => set({ successRate: rate }),
      accessToken: null,
      setAccessToken: (token: string | null) => set({ accessToken: token }),
    }),
    {
      name: 'oracle-storage',
    }
  )
);
