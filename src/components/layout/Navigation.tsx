import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationProps {
  onProfileClick: () => void;
}

const Navigation = ({ onProfileClick }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isHomePage = location.pathname === '/';

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex items-center gap-4">
      {/* Navegação central */}
      <nav className="hidden md:flex"></nav>

      {/* Perfil e logout */}
      {isAuthenticated && !isHomePage ? (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/schedule')}
            className="bg-white/10 border-white/10 text-white hover:bg-white/15 shadow-md"
          >
            <Calendar size={16} className="mr-1" />
            <span className="hidden md:inline">Agendamentos</span>
          </Button>

          <div
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 cursor-pointer hover:bg-white/15 transition-colors shadow-md border border-white/10"
            onClick={onProfileClick}
          >
            <Avatar className="h-8 w-8 border-2 border-viral-accent-purple">
              <AvatarImage src={user?.avatarUrl || ''} />
              <AvatarFallback className="bg-viral-accent-purple text-white">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-medium hidden md:block">{user?.name || 'Usuária'}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-white/10 border-white/10 text-white hover:bg-white/15 shadow-md"
          >
            <LogOut size={16} className="mr-1" />
            <span className="hidden md:inline">Sair</span>
          </Button>
        </div>
      ) : !isAuthenticated && isHomePage ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/login')}
          className="bg-white/10 border-white/10 text-white hover:bg-white/15 shadow-md"
        >
          Login
        </Button>
      ) : null}
    </div>
  );
};

export default Navigation;
