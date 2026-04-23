import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { router } from '@/app/router';
import { AppProvider } from '@/app/contexts/AppContext';
import { queryClient } from '@/shared/query/client';
import TokenRefreshSubscriber from '@/shared/services/TokenRefreshSubscriber';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TokenRefreshSubscriber />
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] text-sm text-gray-500">
              Loading application...
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
        <Toaster position="top-right" richColors />
      </AppProvider>
    </QueryClientProvider>
  );
}
