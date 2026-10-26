import { api } from './client';

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  dueDate: string | null;
  ownerUid: string;
  createdAt: string;
  updatedAt: string;
}
export interface PagedTodos {
  items: Todo[];
  total: number;
  page: number;
  limit: number;
}
export interface Health {
  status: string;
  version: string;
}
/** Kết quả GAS trả về sau khi ghi sheet (API chuyển tiếp nguyên). */
export interface GasExportResult {
  ok: boolean;
  written?: number;
  sheetUrl?: string;
}

export const todosApi = {
  list: async (page = 1, limit = 50) =>
    (await api.get<PagedTodos>('/todos', { params: { page, limit } })).data,
  create: async (title: string) =>
    (await api.post<Todo>('/todos', { title })).data,
  toggle: async (todo: Todo) =>
    (await api.patch<Todo>(`/todos/${todo.id}`, { done: !todo.done })).data,
  remove: async (id: string) => {
    await api.delete(`/todos/${id}`);
  },
  health: async () => (await api.get<Health>('/health')).data,
  /** API -> GAS: ghi todo của người dùng vào tab Export của Google Sheet. */
  exportToSheet: async () =>
    (await api.post<GasExportResult>('/gas/export-todos')).data,
};
