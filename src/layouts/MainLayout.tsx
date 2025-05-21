import Header from '@/components/layout/Header';
import MobileNavigation from '@/components/layout/MobileNavigation';
import Navigation from '@/components/layout/Navigation';
import ProfileModal from '@/components/profile/ProfileModal';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
interface MainLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const MainLayout = ({ children, showNavigation = true }: MainLayoutProps) => {
  const { checkAuth } = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black relative overflow-hidden">
      {/* Fundo principal com efeitos suaves */}
      <div className="fixed inset-0 bg-[url('/patterns/neural-network.svg')] opacity-5 pointer-events-none"></div>

      {/* Gradientes sutis com opacidade reduzida */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full bg-gradient-radial from-slate-900/30 via-transparent to-transparent opacity-30 pointer-events-none"
        animate={{ opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="fixed top-0 right-0 w-1/3 h-1/3 bg-indigo-900/5 rounded-full blur-3xl opacity-20 pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-purple-900/5 rounded-full blur-3xl opacity-20 pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Header com efeito de vidro ao rolar */}
      <motion.div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrollY > 50 ? 'bg-black/90 backdrop-blur-md shadow-md' : ''
        }`}
        animate={{
          backgroundColor: scrollY > 50 ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0)',
          backdropFilter: scrollY > 50 ? 'blur(12px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.3 }}
      >
        <Header />

        {/* Navegação desktop */}
        {showNavigation && (
          <div className="absolute top-5 right-4 z-20">
            <Navigation onProfileClick={() => setProfileModalOpen(true)} />
          </div>
        )}
      </motion.div>

      {/* Conteúdo principal com animação de entrada */}
      <AnimatePresence mode="wait">
        <motion.main
          className="flex-grow relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Navegação mobile */}
      <MobileNavigation showNavigation={showNavigation} onProfileClick={() => setProfileModalOpen(true)} />

      {/* Modal de perfil */}
      <ProfileModal open={profileModalOpen} onOpenChange={setProfileModalOpen} />
    </div>
  );
};

export default MainLayout;
