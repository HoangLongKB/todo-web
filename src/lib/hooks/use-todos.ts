'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todosApi, type Todo } from '@/lib/api/todos';
import { useAuthStore } from '@/store/auth';

const KEY = ['todos'];

/**
 * React Query giữ dữ liệu từ server, biết khi nào cũ, tự tải lại.
 * invalidateQueries(KEY) = "dữ liệu todos cũ rồi, lần tới ai dùng thì tải lại".
 */
export function useTodos() {
  // enabled: chỉ gọi API khi đã có user, tránh request 401 lúc Firebase chưa khôi phục phiên
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: KEY,
    queryFn: () => todosApi.list(),
    enabled: !!user,
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => todosApi.create(title),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useToggleTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (todo: Todo) => todosApi.toggle(todo),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todosApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

/** Không invalidate gì: export không đổi dữ liệu todo, chỉ ghi sang sheet. */
export function useExportToSheet() {
  return useMutation({ mutationFn: () => todosApi.exportToSheet() });
}

export function useApiHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => todosApi.health(),
    refetchInterval: 60_000,
  });
}
