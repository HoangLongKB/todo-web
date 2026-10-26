'use client';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { getFirebaseAuth } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth';

/** Lắng nghe Firebase: đăng nhập/đăng xuất/reload trang đều cập nhật store. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  useEffect(() => onAuthStateChanged(getFirebaseAuth(), setUser), [setUser]);
  return <>{children}</>;
}
