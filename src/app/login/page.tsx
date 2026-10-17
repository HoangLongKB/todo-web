'use client';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFirebaseAuth, googleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Đã đăng nhập rồi thì khỏi ở trang login
  useEffect(() => {
    if (!loading && user) router.replace('/todos');
  }, [loading, user, router]);

  async function login() {
    setError(null);
    try {
      // Popup Google do Firebase lo. Xong, onAuthStateChanged trong AuthProvider sẽ cập nhật store.
      await signInWithPopup(getFirebaseAuth(), googleProvider);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đăng nhập thất bại');
    }
  }

  return (
    <div className="mx-auto mt-24 max-w-sm space-y-4 text-center">
      <h1 className="text-2xl font-semibold">Đăng nhập</h1>
      <p className="text-sm text-zinc-500">
        Dùng tài khoản Google. Dữ liệu giả.
      </p>
      <button
        onClick={login}
        className="w-full rounded bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700"
      >
        Đăng nhập với Google
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
