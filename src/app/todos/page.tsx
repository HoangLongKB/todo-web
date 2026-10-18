'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  useCreateTodo,
  useDeleteTodo,
  useExportToSheet,
  useTodos,
  useToggleTodo,
} from '@/lib/hooks/use-todos';
import { useAuthStore } from '@/store/auth';

const schema = z.object({
  title: z.string().trim().min(1, 'Nhập nội dung').max(200, 'Tối đa 200 ký tự'),
});
type FormValues = z.infer<typeof schema>;

export default function TodosPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  // Bảo vệ phía client: chưa đăng nhập thì đẩy về /login.
  // Bảo vệ THẬT vẫn là guard ở API; đây chỉ để UX đẹp.
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  const todos = useTodos();
  const create = useCreateTodo();
  const toggle = useToggleTodo();
  const remove = useDeleteTodo();
  const exportSheet = useExportToSheet();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '' },
  });

  if (loading || !user)
    return <p className="text-zinc-500">Đang kiểm tra đăng nhập...</p>;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Todos</h1>

      <form
        className="flex gap-2"
        onSubmit={form.handleSubmit(async (v) => {
          await create.mutateAsync(v.title);
          form.reset();
        })}
      >
        <input
          {...form.register('title')}
          placeholder="Việc cần làm"
          className="flex-1 rounded border border-zinc-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
        >
          Thêm
        </button>
      </form>
      {form.formState.errors.title && (
        <p className="text-sm text-red-600">
          {form.formState.errors.title.message}
        </p>
      )}
      {create.isError && (
        <p className="text-sm text-red-600">{create.error.message}</p>
      )}

      {todos.isLoading && <p className="text-zinc-500">Đang tải...</p>}
      {todos.isError && (
        <p className="text-sm text-red-600">
          Không tải được: {todos.error.message}
        </p>
      )}

      <ul className="divide-y divide-zinc-200">
        {todos.data?.items.map((t) => (
          <li key={t.id} className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggle.mutate(t)}
            />
            <span
              className={
                t.done ? 'flex-1 text-zinc-400 line-through' : 'flex-1'
              }
            >
              {t.title}
            </span>
            <button
              onClick={() => remove.mutate(t.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
      {todos.data && (
        <p className="text-xs text-zinc-500">{todos.data.total} việc</p>
      )}

      {/* Chiều API -> GAS: API gọi web app Apps Script, GAS ghi sheet rồi trả kết quả */}
      <div className="space-y-1 border-t border-zinc-200 pt-4">
        <button
          onClick={() => exportSheet.mutate()}
          disabled={exportSheet.isPending || !todos.data?.items.length}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:opacity-50"
        >
          {exportSheet.isPending ? 'Đang xuất...' : 'Xuất ra Google Sheet'}
        </button>
        {exportSheet.isSuccess && (
          <p className="text-sm text-green-700">
            Đã ghi {exportSheet.data.written ?? 0} dòng.{' '}
            {exportSheet.data.sheetUrl && (
              <a
                href={exportSheet.data.sheetUrl}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Mở sheet
              </a>
            )}
          </p>
        )}
        {exportSheet.isError && (
          <p className="text-sm text-red-600">{exportSheet.error.message}</p>
        )}
      </div>
    </div>
  );
}
