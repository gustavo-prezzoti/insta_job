/* eslint-disable @typescript-eslint/no-explicit-any */
import { setToken } from '@/api';
import AuthAPI from '@/api/Auth';
import UserAPI from '@/api/User';
import { loginWithInstagramOAuth } from '@/services/instagramService';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  is_active?: boolean;
  has_subscription?: boolean;
  force_password_change?: boolean;
  sessions?: any;
  subscription_end_date?: string;
}

interface ProfileUpdateData {
  name?: string;
  avatarFile?: File | null;
  currentPassword?: string;
  newPassword?: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithInstagram: () => Promise<void>;
  logout: () => void;
  isInstagramConnected: boolean;
  connectInstagram: () => void;
  disconnectInstagram: () => void;
  updateUserProfile: (profileData: ProfileUpdateData) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  getUser: () => Promise<User | null>;
  checkInstagramConnection: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInstagramConnected, setIsInstagramConnected] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);

        const response = await UserAPI.getMe(savedToken);

        if (response.status !== 200) {
          logout();
          setIsLoading(false);
          throw new Error(response.data.message || 'Usuário não autenticado.');
        }

        setUser(response.data);

        const igConnected = response.data.sessions.length > 0;
        setIsInstagramConnected(!!igConnected);

        if (response.data.force_password_change && window.location.pathname !== '/update-password') {
          window.location.href = '/update-password';
        }

        localStorage.setItem('instagram_connected', igConnected.toString());
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!password || password.length < 4) {
        throw new Error('Senha inválida');
      }

      const response = await AuthAPI.login({ email, password });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Falha ao fazer login');
      }

      const user = response.data.user;
      const token = response.data.token;

      localStorage.setItem('token', token);
      setToken(token);

      setUser(user);
      setIsLoading(false);

      if (user.force_password_change && window.location.pathname !== '/update-password') {
        window.location.href = '/update-password';
      }

      getUser();
    } catch (error) {
      setIsLoading(false);
      throw new Error('Falha ao fazer login');
    }
  };

  const loginWithInstagram = async () => {
    try {
      setIsLoading(true);

      const loginResult = await loginWithInstagramOAuth();

      if (!loginResult.success) {
        throw new Error(loginResult.error || 'Falha ao conectar com Instagram');
      }

      setIsInstagramConnected(true);
      localStorage.setItem('instagram_connected', 'true');

      await getUser();

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao fazer login no Instagram:', error);
      throw new Error('Falha ao conectar com Instagram');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('instagram_connected');
    localStorage.removeItem('token');
    localStorage.clear();
    setIsInstagramConnected(false);
    if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
      window.location.href = '/login';
    }
  };

  const connectInstagram = () => {
    setIsInstagramConnected(true);
    localStorage.setItem('instagram_connected', 'true');
  };

  const disconnectInstagram = () => {
    setIsInstagramConnected(false);
    localStorage.removeItem('instagram_connected');
  };

  const updateUserProfile = async (profileData: ProfileUpdateData) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!user) throw new Error('Usuário não autenticado');

      const updatedUser = { ...user };

      if (profileData.name) {
        updatedUser.name = profileData.name;
      }

      if (profileData.avatarFile) {
        const fakeAvatarUrl = URL.createObjectURL(profileData.avatarFile);
        updatedUser.avatarUrl = fakeAvatarUrl;
      }

      const response = await UserAPI.updateUserProfile(
        profileData.name,
        profileData.currentPassword,
        profileData.newPassword,
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Erro ao atualizar perfil');
      }

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setIsLoading(false);
      return;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);

      if (!user) throw new Error('Usuário não autenticado');

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await UserAPI.updatePasswordFirstTime(token, currentPassword, newPassword);

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Erro ao atualizar senha');
      }

      await checkAuth();

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const checkAuth = async () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);

      const response = await UserAPI.getMe(savedToken);

      if (response.status !== 200) {
        logout();
        setIsLoading(false);
        throw new Error(response.data.message || 'Usuário não autenticado.');
      }

      setUser(response.data);

      const igConnected = response.data.sessions.length > 0;
      setIsInstagramConnected(!!igConnected);

      localStorage.setItem('instagram_connected', igConnected.toString());
    }

    setIsLoading(false);
  };

  const getUser = async () => {
    if (user) {
      return user;
    }

    const savedToken = localStorage.getItem('token');

    if (!savedToken) {
      return null;
    }

    const response = await UserAPI.getMe(savedToken);

    if (response.status !== 200) {
      logout();
      throw new Error(response.data.message || 'Usuário não autenticado.');
    }

    setUser(response.data);

    if (response.data.force_password_change && window.location.pathname !== '/update-password') {
      window.location.href = '/update-password';
    }

    return response.data;
  };

  const checkInstagramConnection = async (): Promise<boolean> => {
    try {
      console.log('Verificando status da conexão com Instagram');
      
      // First check local storage for quick response
      const localStorageConnected = localStorage.getItem('instagram_connected') === 'true';
      console.log('Status da conexão no localStorage:', localStorageConnected);
      
      // Se já tivermos informação no localStorage, retorne imediatamente para uma resposta mais rápida
      if (localStorageConnected) {
        console.log('Retornando true do localStorage para resposta rápida');
        return true;
      }
      
      // Verificar se temos token antes de fazer chamada à API
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado, não é possível verificar conexão com Instagram');
        return false;
      }
      
      // Then verify with the API
      console.log('Fazendo chamada à API para verificar status de autenticação');
      try {
        const response = await UserAPI.getMe(token);
        
        if (response.status === 200) {
          console.log('Resposta da API recebida:', response.status);
          
          // Verificar se a resposta tem o formato esperado
          if (response.data && typeof response.data === 'object') {
            // Check if the user has Instagram sessions
            const apiConnected = response.data.sessions?.length > 0;
            console.log('Sessões do Instagram na resposta API:', response.data.sessions?.length || 0);
            
            // Update the state and localStorage
            setIsInstagramConnected(!!apiConnected);
            localStorage.setItem('instagram_connected', apiConnected ? 'true' : 'false');
            
            console.log('Status da conexão atualizado:', apiConnected);
            return !!apiConnected;
          } else {
            console.warn('Resposta da API não tem o formato esperado:', response.data);
            // Não faz sentido atualizar o localStorage com um valor inválido
            return isInstagramConnected;
          }
        } else {
          console.warn('API retornou status diferente de 200:', response.status);
        }
      } catch (apiError) {
        console.error('Erro na chamada à API:', apiError);
        // Não desconectar automaticamente se a API falhar
      }
      
      // Se a API falhou ou retornou algo inesperado, mantenha o estado atual
      console.log('Usando estado atual como fallback:', isInstagramConnected);
      return isInstagramConnected;
    } catch (error) {
      console.error('Erro geral ao verificar conexão com Instagram:', error);
      
      // Se houver erro, mantenha o estado atual
      return isInstagramConnected;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithInstagram,
        logout,
        isInstagramConnected,
        connectInstagram,
        disconnectInstagram,
        updateUserProfile,
        updatePassword,
        checkAuth,
        getUser,
        checkInstagramConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
