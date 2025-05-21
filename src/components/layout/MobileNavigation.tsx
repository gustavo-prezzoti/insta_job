
import { Link, useLocation } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileNavigationProps {
  onProfileClick: () => void;
  showNavigation: boolean;
}

// Definindo o ícone do TikTok personalizado
const TiktokIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM9.5 3.5C9.5 3.22386 9.27614 3 9 3C8.72386 3 8.5 3.22386 8.5 3.5V11.5C8.5 11.7761 8.72386 12 9 12C9.27614 12 9.5 11.7761 9.5 11.5V3.5ZM7 4C7.27614 4 7.5 4.22386 7.5 4.5V12.5C7.5 12.7761 7.27614 13 7 13C6.72386 13 6.5 12.7761 6.5 12.5V4.5C6.5 4.22386 6.72386 4 7 4ZM4.5 6.5C4.5 6.22386 4.72386 6 5 6C5.27614 6 5.5 6.22386 5.5 6.5V11.5C5.5 11.7761 5.27614 12 5 12C4.72386 12 4.5 11.7761 4.5 11.5V6.5ZM11 5C10.7239 5 10.5 5.22386 10.5 5.5V10.5C10.5 10.7761 10.7239 11 11 11C11.2761 11 11.5 10.7761 11.5 10.5V5.5C11.5 5.22386 11.2761 5 11 5Z"
      fill="currentColor"
    />
  </svg>
);

const MobileNavigation = ({ onProfileClick, showNavigation }: MobileNavigationProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!showNavigation) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-50 shadow-md">
      <div className="flex justify-around py-3">
        <Link 
          to="/" 
          className={`flex flex-col items-center relative ${
            isActive('/') 
              ? 'text-indigo-600 font-semibold' 
              : 'text-slate-600'
          }`}
        >
          {isActive('/') && (
            <span className="absolute -top-2 w-1/2 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
          )}
          <div className={`p-2 rounded-full ${isActive('/') ? 'bg-indigo-50' : ''}`}>
            <Search size={20} />
          </div>
          <span className="text-xs mt-1">Início</span>
        </Link>
        
        <Link 
          to="/search" 
          className={`flex flex-col items-center relative ${
            isActive('/search') 
              ? 'text-indigo-600 font-semibold' 
              : 'text-slate-600'
          }`}
        >
          {isActive('/search') && (
            <span className="absolute -top-2 w-1/2 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
          )}
          <div className={`p-2 rounded-full ${isActive('/search') ? 'bg-indigo-50' : ''}`}>
            <TiktokIcon />
          </div>
          <span className="text-xs mt-1">Pesquisar</span>
        </Link>
        
        {isAuthenticated && (
          <button 
            onClick={onProfileClick}
            className={`flex flex-col items-center relative text-slate-600`}
          >
            <div className="p-2 rounded-full">
              <User size={20} />
            </div>
            <span className="text-xs mt-1">Perfil</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation;
