/**
 * Biến NEXT_PUBLIC_* được Next thay thẳng giá trị vào JS lúc BUILD.
 * Đổi giá trị sau khi build không có tác dụng, phải build lại image. Đây là lỗi hay gặp khi deploy.
 */
export type AppEnv = 'local' | 'dev' | 'test' | 'prod';

export const APP_ENV = (process.env.NEXT_PUBLIC_APP_ENV ?? 'local') as AppEnv;
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0';

/** local trỏ API trên máy; các môi trường cloud lấy URL từ biến riêng. */
export function apiBaseUrl(): string {
  if (APP_ENV === 'local') return 'http://localhost:8080/api/v1';
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url)
    throw new Error('Thiếu NEXT_PUBLIC_API_BASE_URL cho môi trường ' + APP_ENV);
  return url;
}
