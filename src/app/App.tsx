import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AppProvider } from '../contexts/AppContext';
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