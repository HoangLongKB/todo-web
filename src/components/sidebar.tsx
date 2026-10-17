'use client';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useApiHealth } from '@/lib/hooks/use-todos';
import { APP_ENV, APP_VERSION } from '@/lib/env';
import { getFirebaseAuth } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth';

/** Hiện version web và version API để biết hai bên có lệch nhau không. */
export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const health = useApiHealth();
  const apiVersion = health.isError ? 'lỗi' : (health.data?.version ?? '...');

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-4 border-r border-zinc-200 p-4 text-sm">
      <div className="font-semibold">Todo lab</div>
      <nav className="flex flex-col gap-1">
        <Link href="/todos" className="hover:underline">
          Todos
        </Link>
      </nav>
      <div className="mt-auto space-y-1 text-xs text-zinc-500">
        <div>env: {APP_ENV}</div>
        <div>web v{APP_VERSION}</div>
        <div>api v{apiVersion}</div>
        {user ? (
          <>
            <div className="truncate">{user.email}</div>
            <button
              className="text-red-600 hover:underline"
              onClick={() => signOut(getFirebaseAuth())}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <Link href="/login" className="hover:underline">
            Đăng nhập
          </Link>
        )}
      </div>
    </aside>
  );
}
