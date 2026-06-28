import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Commitment = {
  id: string;
  title: string;
  daysRemaining: number;
  riskScore: number;
  opportunityLoss: number;
  category: "Exam" | "Assignment" | "Placement" | "Scholarship" | string;
  estHoursNeeded?: number;
};

export type AppState = {
  successRate: number;
  setSuccessRate: (rate: number) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  commitments: Commitment[];
  addCommitment: (c: Commitment) => void;
  updateCommitment: (id: string, updates: Partial<Commitment>) => void;
  deleteCommitment: (id: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      successRate: 7, // Default baseline
      setSuccessRate: (rate: number) => set({ successRate: rate }),
      accessToken: null,
      setAccessToken: (token: string | null) => set({ accessToken: token }),
      commitments: [
        {
          id: 'seed-1',
          title: 'Data Structures Final',
          category: 'Exam',
          daysRemaining: 14,
          riskScore: 65,
          opportunityLoss: 15000,
          estHoursNeeded: 30
        },
        {
          id: 'seed-2',
          title: 'Google STEP Application',
          category: 'Placement',
          daysRemaining: 3,
          riskScore: 85,
          opportunityLoss: 80000,
          estHoursNeeded: 12
        }
      ],
      addCommitment: (c) => set((state) => ({ commitments: [...state.commitments, c] })),
      updateCommitment: (id, updates) => set((state) => ({
        commitments: state.commitments.map((c) => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteCommitment: (id) => set((state) => ({
        commitments: state.commitments.filter((c) => c.id !== id)
      })),
    }),
    {
      name: 'oracle-storage',
      partialize: (state) => ({ 
        successRate: state.successRate, 
        commitments: state.commitments 
      }),
    }
  )
);
