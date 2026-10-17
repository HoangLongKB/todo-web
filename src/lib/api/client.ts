import axios, { AxiosError } from 'axios';
import { getFirebaseAuth } from '@/lib/firebase';
import { apiBaseUrl } from '@/lib/env';

/** Khuôn response của todo-api: { success: true, data } hoặc { success: false, error } */
interface ApiOk<T> {
  success: true;
  data: T;
}
interface ApiErr {
  success: false;
  error: { statusCode: number; message: string | string[]; path: string };
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Một axios dùng chung cho cả app (singleton). */
export const api = axios.create({ baseURL: apiBaseUrl(), timeout: 10_000 });

// Interceptor request: chạy TRƯỚC mỗi request, gắn ID token của user đang đăng nhập.
api.interceptors.request.use(async (config) => {
  const user =
    typeof window === 'undefined' ? null : getFirebaseAuth().currentUser;
  if (user) {
    // getIdToken tự làm mới khi token sắp hết hạn (1 giờ), không cần lo
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response: bóc { success, data } để code gọi chỉ nhận data; lỗi thì chuẩn hóa.
api.interceptors.response.use(
  (res) => {
    const body = res.data as ApiOk<unknown> | undefined;
    if (body && typeof body === 'object' && 'success' in body) {
      res.data = body.data;
    }
    return res;
  },
  (err: AxiosError<ApiErr>) => {
    const status = err.response?.status ?? 0;
    const raw = err.response?.data?.error?.message;
    const message = Array.isArray(raw) ? raw.join(', ') : (raw ?? err.message);
    return Promise.reject(new ApiError(status, message));
  },
);
