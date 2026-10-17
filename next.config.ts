import type { NextConfig } from 'next';
import pkg from './package.json';

const nextConfig: NextConfig = {
  // standalone: build ra thư mục .next/standalone tự chạy bằng node server.js,
  // không cần node_modules đầy đủ. Dockerfile ở giai đoạn 7 copy đúng thư mục này.
  output: 'standalone',
  env: {
    // NEXT_PUBLIC_* bị "đóng cứng" vào JS lúc build. Version lấy từ package.json.
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
};

export default nextConfig;
