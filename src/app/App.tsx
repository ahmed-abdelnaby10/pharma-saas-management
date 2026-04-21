import { RouterProvider } from 'react-router';
import { router } from '@/app/router';
import { LanguageProvider } from '@/app/contexts/LanguageContext';
import { AppProvider } from '@/app/contexts/AppContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </AppProvider>
    </LanguageProvider>
  );
}
