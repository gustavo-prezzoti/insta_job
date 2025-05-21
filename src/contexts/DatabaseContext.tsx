
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Prefixo único para este projeto para evitar conflitos com outros projetos
const STORAGE_PREFIX = 'roboviral_';

// Tipos de dados que serão armazenados
interface StorageData {
  savedVideos?: any[];
  searchHistory?: string[];
  userPreferences?: {
    theme?: string;
    language?: string;
    notificationsEnabled?: boolean;
  };
  scheduledPosts?: any[];
  customCategories?: string[];
}

interface DatabaseContextProps {
  getData: <T>(key: keyof StorageData) => T | undefined;
  saveData: <T>(key: keyof StorageData, data: T) => void;
  removeData: (key: keyof StorageData) => void;
  clearAllData: () => void;
  addToSearchHistory: (term: string) => void;
  getSearchHistory: () => string[];
}

const DatabaseContext = createContext<DatabaseContextProps | undefined>(undefined);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);

  // Inicializar o banco de dados local ao carregar
  useEffect(() => {
    const initializeDatabase = () => {
      try {
        // Verificar se já existe uma estrutura básica no localStorage
        if (!localStorage.getItem(`${STORAGE_PREFIX}initialized`)) {
          // Estrutura inicial do banco de dados
          const initialData: StorageData = {
            savedVideos: [],
            searchHistory: [],
            userPreferences: {
              theme: 'dark',
              language: 'pt-BR',
              notificationsEnabled: true
            },
            scheduledPosts: [],
            customCategories: []
          };

          // Salvar cada seção separadamente
          Object.entries(initialData).forEach(([key, value]) => {
            localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
          });

          // Marcar como inicializado
          localStorage.setItem(`${STORAGE_PREFIX}initialized`, 'true');
        }

        setIsReady(true);
      } catch (error) {
        console.error('Erro ao inicializar o banco de dados local:', error);
        setIsReady(true); // Continuar mesmo com erro
      }
    };

    initializeDatabase();
  }, []);

  // Função genérica para obter dados
  const getData = <T,>(key: keyof StorageData): T | undefined => {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return data ? JSON.parse(data) as T : undefined;
    } catch (error) {
      console.error(`Erro ao obter dados para a chave ${key}:`, error);
      return undefined;
    }
  };

  // Função genérica para salvar dados
  const saveData = <T,>(key: keyof StorageData, data: T): void => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Erro ao salvar dados para a chave ${key}:`, error);
    }
  };

  // Função para remover um item específico
  const removeData = (key: keyof StorageData): void => {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error(`Erro ao remover dados para a chave ${key}:`, error);
    }
  };

  // Função para limpar todos os dados deste projeto
  const clearAllData = (): void => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Erro ao limpar todos os dados:', error);
    }
  };

  // Função específica para adicionar termos ao histórico de pesquisa
  const addToSearchHistory = (term: string): void => {
    try {
      const history = getData<string[]>('searchHistory') || [];
      // Evitar duplicatas e manter os termos mais recentes no início
      const updatedHistory = [term, ...history.filter(item => item !== term)].slice(0, 10);
      saveData('searchHistory', updatedHistory);
    } catch (error) {
      console.error('Erro ao adicionar termo ao histórico de pesquisa:', error);
    }
  };

  // Função para obter o histórico de pesquisa
  const getSearchHistory = (): string[] => {
    return getData<string[]>('searchHistory') || [];
  };

  return (
    <DatabaseContext.Provider
      value={{
        getData,
        saveData,
        removeData,
        clearAllData,
        addToSearchHistory,
        getSearchHistory,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
