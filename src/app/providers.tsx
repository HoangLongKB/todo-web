'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/components/auth-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  // useState để QueryClient tạo một lần cho mỗi lần mount, không tạo lại mỗi render
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 1 } } }),
  );
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
