import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useVideo } from '@/contexts/VideoContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDatabase } from '@/contexts/DatabaseContext';
import MainLayout from '@/layouts/MainLayout';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import InstagramLoginModal from '@/components/search/InstagramLoginModal';
import SourceTabs from '@/components/search/SourceTabs';

// Function to check and clear stale authentication flags
const clearStaleAuthFlags = (): void => {
  const authInProgress = localStorage.getItem('instagram_auth_in_progress');
  const authTimestamp = localStorage.getItem('instagram_auth_timestamp');
  
  if (authInProgress) {
    // If timestamp exists, check if stale
    if (authTimestamp) {
      const now = Date.now();
      const timestamp = parseInt(authTimestamp, 10);
      
      // Flag is stale if older than 2 minutes or invalid
      if (isNaN(timestamp) || now - timestamp > 2 * 60 * 1000) {
        console.log('SearchPage: Clearing stale authentication flag (timestamp check)');
        localStorage.removeItem('instagram_auth_in_progress');
        localStorage.removeItem('instagram_auth_timestamp');
      }
    } else {
      // No timestamp, so flag is stale
      console.log('SearchPage: Clearing stale authentication flag (no timestamp)');
      localStorage.removeItem('instagram_auth_in_progress');
    }
  }
};

const SearchPage = () => {
  const { searchResults, searchTerm, setSearchTerm, selectedVideos, toggleVideoSelection, searchVideos, isSearching } = useVideo();
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [recentlyAuthenticated, setRecentlyAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isInstagramConnected, loginWithInstagram, checkInstagramConnection, user } = useAuth();
  const { addToSearchHistory } = useDatabase();

  const currentSelectedVideos = selectedVideos.filter(selectedVideo => 
    searchResults.some(searchResult => searchResult.id === selectedVideo.id)
  );

  // Listen for messages from OAuth popup
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Verify origin to prevent XSS attacks
      if (event.origin !== window.location.origin) return;
      
      // Check if this is our OAuth success message
      if (event.data?.type === 'INSTAGRAM_AUTH_SUCCESS') {
        console.log('Received authentication success message in SearchPage');
        
        // Clear any authentication in progress flag
        localStorage.removeItem('instagram_auth_in_progress');
        localStorage.removeItem('instagram_auth_timestamp');
        
        // Update local connection state
        localStorage.setItem('instagram_connected', 'true');
        
        // Set flag to prevent modal reopening
        setRecentlyAuthenticated(true);
        
        // Check Instagram connection status without page refresh
        await checkInstagramConnection();
        
        // If we have videos selected, go directly to post config after authentication
        if (currentSelectedVideos.length > 0) {
          // Store videos again to be sure
          localStorage.setItem('selectedVideos', JSON.stringify(currentSelectedVideos));
          localStorage.setItem('currentSelectedVideo', JSON.stringify(currentSelectedVideos[0]));
          
          // Navigate after a brief delay to ensure state updates
          setTimeout(() => {
            navigate('/post-config');
          }, 300);
        }
      } else if (event.data?.type === 'INSTAGRAM_AUTH_ERROR') {
        // Clear any authentication in progress flag on error
        localStorage.removeItem('instagram_auth_in_progress');
        localStorage.removeItem('instagram_auth_timestamp');
      }
    };
    
    // Add the message event listener
    window.addEventListener('message', handleMessage);
    
    // Clean up
    return () => window.removeEventListener('message', handleMessage);
  }, [checkInstagramConnection, currentSelectedVideos, navigate]);

  useEffect(() => {
    // Clear any stale auth flags when component mounts
    clearStaleAuthFlags();
    
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    if (searchTerm.trim()) {
      handleSearch(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
    }

    // Check Instagram connection status when the page loads
    const checkConnection = async () => {
      // Clear any stale authentication flags on page load
      if (document.visibilityState === 'visible') {
        clearStaleAuthFlags();
      }
      
      await checkInstagramConnection();
    };
    
    checkConnection();
    
    // Set up visibility change listener to check connection when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        clearStaleAuthFlags();
        checkInstagramConnection();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Campo vazio",
        description: "Digite uma palavra-chave para buscar.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (user) {
        addToSearchHistory(searchTerm);
      } else {
        console.log("Usuário não autenticado, não salvando histórico");
      }
      
      await searchVideos(searchTerm);
      
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    } catch (error) {
      console.error(`Erro na busca por "${searchTerm}":`, error);
    }
  };

  const handleContinue = async () => {
    if (currentSelectedVideos.length === 0) {
      toast({
        title: "Nenhum vídeo selecionado",
        description: "Selecione pelo menos um vídeo para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Continuando com vídeos selecionados:", currentSelectedVideos);
    
    try {
      // Garantir que o primeiro vídeo da lista é o que será usado na próxima tela
      if (currentSelectedVideos.length > 0) {
        // Armazenar explicitamente todos os vídeos selecionados no localStorage
        localStorage.setItem('selectedVideos', JSON.stringify(currentSelectedVideos));
        // Armazenar explicitamente o vídeo atual selecionado
        localStorage.setItem('currentSelectedVideo', JSON.stringify(currentSelectedVideos[0]));
        console.log("Vídeo atual salvo:", currentSelectedVideos[0]);
      }
      
      console.log("Vídeos salvos no localStorage antes de navegar para post-config:", currentSelectedVideos.length);
      
      // Se já estamos autenticados recentemente, pule a verificação de conexão
      if (recentlyAuthenticated) {
        console.log("Pulando verificação de conexão, autenticação recente");
        setTimeout(() => {
          navigate('/post-config');
        }, 300);
        return;
      }
      
      // Verificar o Instagram apenas se o token existir (usuário está logado)
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token não encontrado, redirecionando para login");
        navigate('/login');
        return;
      }
      
      // Verificar a conexão com Instagram de forma segura
      let isConnected = false;
      try {
        isConnected = await checkInstagramConnection();
        console.log("Status da conexão com Instagram:", isConnected);
      } catch (error) {
        console.error("Erro ao verificar conexão com Instagram:", error);
        // Em caso de erro, tentamos prosseguir mesmo assim
        isConnected = localStorage.getItem('instagram_connected') === 'true';
      }
      
      if (!isConnected) {
        console.log("Abrindo modal de login do Instagram");
        setShowInstagramModal(true);
        return;
      }
      
      // Se chegou aqui, está tudo certo para prosseguir
      console.log("Navegando para a página de configuração da postagem");
      setTimeout(() => {
        navigate('/post-config');
      }, 300);
    } catch (error) {
      console.error("Erro ao processar a continuação:", error);
      toast({
        title: "Erro ao processar",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleInstagramLogin = async () => {
    await loginWithInstagram();
    
    toast({
      title: "Instagram conectado",
      description: "Sua conta do Instagram foi conectada com sucesso.",
    });
    
    setShowInstagramModal(false);
    setRecentlyAuthenticated(true);
    
    // Garantir que o vídeo selecionado é salvo mesmo após o login do Instagram
    if (currentSelectedVideos.length > 0) {
      localStorage.setItem('selectedVideos', JSON.stringify(currentSelectedVideos));
      localStorage.setItem('currentSelectedVideo', JSON.stringify(currentSelectedVideos[0]));
    }
    console.log("Vídeos salvos no localStorage após login do Instagram");
    
    navigate('/post-config');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Busque vídeos virais</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Encontre conteúdos virais do TikTok para postar diretamente no seu Instagram.
          </p>
        </div>
        
        <SourceTabs />
        
        <div className="my-8">
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isSearching={isSearching}
            onSearch={handleSearch}
            ref={searchInputRef}
          />
        </div>
        
        <SearchResults 
          searchResults={searchResults}
          selectedVideos={selectedVideos}
          toggleVideoSelection={toggleVideoSelection}
          onContinue={handleContinue}
          isLoading={isSearching}
        />
        
        <InstagramLoginModal 
          open={showInstagramModal && !recentlyAuthenticated}
          onOpenChange={(open) => {
            // Don't reopen the modal if we recently authenticated successfully
            if (open && recentlyAuthenticated) {
              return;
            }
            setShowInstagramModal(open);
          }}
          onLogin={handleInstagramLogin}
        />
      </div>
    </MainLayout>
  );
};

export default SearchPage;
