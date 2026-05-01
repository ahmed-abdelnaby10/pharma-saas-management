import { Suspense, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { router } from '@/app/router';
import { AppProvider } from '@/app/contexts/AppContext';
import { queryClient } from '@/shared/query/client';
import TokenRefreshSubscriber from '@/shared/services/TokenRefreshSubscriber';
import { OfflineSyncWatcher } from '@/app/components/OfflineSyncWatcher';
import { Toaster } from 'sonner';
import { SubscriptionBlocker } from '@/features/subscription/SubscriptionBlocker';
import { startHeartbeat } from '@/shared/services/heartbeat';
import useAuth from '@/shared/store/useAuth';

function HeartbeatManager() {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) return;
    return startHeartbeat();
  }, [isAuthenticated]);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TokenRefreshSubscriber />
        <HeartbeatManager />
        {/* Listens for offline → online transitions and triggers sync on desktop */}
        <OfflineSyncWatcher />
        {/* Full-screen subscription blocker — shown when API returns 402 */}
        <SubscriptionBlocker />
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
