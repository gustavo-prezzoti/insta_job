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

const SearchPage = () => {
  const { searchResults, searchTerm, setSearchTerm, selectedVideos, toggleVideoSelection, searchVideos, isSearching } = useVideo();
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isInstagramConnected, loginWithInstagram, user } = useAuth();
  const { addToSearchHistory } = useDatabase();

  const currentSelectedVideos = selectedVideos.filter(selectedVideo => 
    searchResults.some(searchResult => searchResult.id === selectedVideo.id)
  );

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    if (searchTerm.trim()) {
      handleSearch(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
    }
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

  const handleContinue = () => {
    if (currentSelectedVideos.length === 0) {
      toast({
        title: "Nenhum vídeo selecionado",
        description: "Selecione pelo menos um vídeo para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Continuando com vídeos selecionados:", currentSelectedVideos);
    
    // Garantir que o primeiro vídeo da lista é o que será usado na próxima tela
    if (currentSelectedVideos.length > 0) {
      // Armazenar explicitamente todos os vídeos selecionados no localStorage
      localStorage.setItem('selectedVideos', JSON.stringify(currentSelectedVideos));
      // Armazenar explicitamente o vídeo atual selecionado
      localStorage.setItem('currentSelectedVideo', JSON.stringify(currentSelectedVideos[0]));
      console.log("Vídeo atual salvo:", currentSelectedVideos[0]);
    }
    
    console.log("Vídeos salvos no localStorage antes de navegar para post-config:", currentSelectedVideos.length);
    
    if (!isInstagramConnected) {
      setShowInstagramModal(true);
      return;
    }
    
    setTimeout(() => {
      navigate('/post-config');
    }, 300);
  };

  const handleInstagramLogin = async () => {
    await loginWithInstagram();
    
    toast({
      title: "Instagram conectado",
      description: "Sua conta do Instagram foi conectada com sucesso.",
    });
    
    setShowInstagramModal(false);
    
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
          open={showInstagramModal}
          onOpenChange={setShowInstagramModal}
          onLogin={handleInstagramLogin}
        />
      </div>
    </MainLayout>
  );
};

export default SearchPage;
