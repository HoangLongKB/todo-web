import type { User } from 'firebase/auth';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  /** true cho tới khi Firebase báo lần đầu là có user hay không */
  loading: boolean;
  setUser: (user: User | null) => void;
}

/** Zustand: một store nhỏ, component nào cũng đọc được, không cần Context lồng nhau. */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
}));
