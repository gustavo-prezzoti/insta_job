
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Menu, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const isHomePage = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full px-6 py-4 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center group">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-10 w-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white/10 group-hover:border-white/20 transition-all duration-300 overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              {/* Elemento gráfico no lugar da imagem de logo */}
              <div className="h-7 w-7 relative z-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-70"></div>
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg md:text-xl tracking-tight text-center">VIRALYX<span className="text-indigo-400">.AI</span></span>
              <motion.span 
                className="text-white/70 text-[10px] font-medium tracking-wide text-center"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                INTELIGÊNCIA ARTIFICIAL VIRAL
              </motion.span>
            </div>
          </motion.div>
        </Link>

        {/* Menu mobile trigger */}
        <button 
          className="md:hidden flex items-center justify-center h-10 w-10 bg-white/10 rounded-full"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5 text-white" />
        </button>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div 
            className="absolute top-full left-0 right-0 bg-gradient-to-b from-[#13102C]/95 to-[#1E1A45]/95 backdrop-blur-lg p-4 z-50 border-t border-white/10 shadow-xl md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col space-y-3">
              <a 
                href="#precos" 
                className="text-white/80 hover:text-white transition-colors p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preços
              </a>
              {isAuthenticated ? (
                <Link 
                  to="/search" 
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium hover:opacity-90 transition-all text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Acessar Plataforma
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium hover:opacity-90 transition-all text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Entrar
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
