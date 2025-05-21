import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { VideoProvider } from './contexts/VideoContext';

// Páginas
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import PostConfigPage from './pages/PostConfigPage';
import SchedulePage from './pages/SchedulePage';
import SearchPage from './pages/SearchPage';
import SuccessPage from './pages/SuccessPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DatabaseProvider>
      <AuthProvider>
        <VideoProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/post-config" element={<PostConfigPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </VideoProvider>
      </AuthProvider>
    </DatabaseProvider>
  </QueryClientProvider>
);

export default App;
