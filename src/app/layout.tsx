import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Sidebar } from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'Todo lab',
  description: 'Todo web mô phỏng hệ thống công ty. Dữ liệu giả.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-white text-zinc-900 antialiased">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
