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
};
