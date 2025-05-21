
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { VideoResult } from '@/types/video';
import { searchTikTokVideos } from '@/services/tiktokService';
import { getUserSavedVideos, saveVideoToDatabase } from '@/services/videoService';
import { saveSearchTerm, getSearchHistory } from '@/services/searchService';
import { toast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface VideoContextProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: VideoResult[];
  setSearchResults: (results: VideoResult[]) => void;
  searchVideos: (keyword: string) => Promise<void>;
  selectedVideos: VideoResult[];
  setSelectedVideos: (videos: VideoResult[]) => void;
  toggleVideoSelection: (id: string) => void;
  addToSelectedVideos: (video: VideoResult) => void;
  clearSelectedVideos: () => void;
  videos: VideoResult[];
  setVideos: (videos: VideoResult[]) => void;
  currentVideo: VideoResult | null;
  setCurrentVideo: (video: VideoResult | null) => void;
  isSearching: boolean;
  loadUserVideos: () => Promise<void>;
  saveVideoToDB: (video: VideoResult, sourceUrl: string, platform: 'tiktok' | 'instagram' | 'youtube') => Promise<string | null>;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<VideoResult[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<VideoResult[]>([]);
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoResult | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Carregar vídeos do usuário quando o contexto for montado
  useEffect(() => {
    loadUserVideos();
    
    // Verificar se há uma assinatura do Supabase ativa para mudanças na tabela de vídeos
    const subscription = supabase
      .channel('videos_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'videos'
      }, () => {
        // Recarregar vídeos quando houver alterações
        loadUserVideos();
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Carregar vídeos salvos do localStorage
  useEffect(() => {
    const savedVideos = localStorage.getItem('selectedVideos');
    if (savedVideos) {
      try {
        const parsedVideos = JSON.parse(savedVideos);
        if (Array.isArray(parsedVideos) && parsedVideos.length > 0) {
          console.log("Recuperando vídeos selecionados do localStorage:", parsedVideos);
          setSelectedVideos(parsedVideos);
        }
      } catch (error) {
        console.error("Erro ao recuperar vídeos do localStorage:", error);
      }
    }
  }, []);

  // Salvar vídeos selecionados no localStorage
  useEffect(() => {
    if (selectedVideos.length > 0) {
      console.log("Salvando vídeos selecionados no localStorage:", selectedVideos);
      localStorage.setItem('selectedVideos', JSON.stringify(selectedVideos));
    }
  }, [selectedVideos]);

  // Função para buscar vídeos do usuário no banco de dados
  const loadUserVideos = async () => {
    try {
      const userVideos = await getUserSavedVideos();
      console.log("Vídeos carregados do banco de dados:", userVideos);
      setVideos(userVideos);
    } catch (error) {
      console.error("Erro ao carregar vídeos do usuário:", error);
    }
  };

  // Função para buscar vídeos
  const searchVideos = async (keyword: string) => {
    console.log(`Buscando vídeos para: ${keyword}`);
    setIsSearching(true);
    
    try {
      // Salvar termo de pesquisa no histórico
      await saveSearchTerm(keyword, 'tiktok');
      
      // Buscar vídeos
      const results = await searchTikTokVideos(keyword);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "Nenhum resultado",
          description: `Não encontramos vídeos para "${keyword}". Tente outra palavra-chave.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar vídeos. Tente novamente.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Função para salvar vídeo no banco de dados
  const saveVideoToDB = async (
    video: VideoResult, 
    sourceUrl: string, 
    platform: 'tiktok' | 'instagram' | 'youtube'
  ): Promise<string | null> => {
    try {
      const videoId = await saveVideoToDatabase(video, sourceUrl, platform);
      
      if (videoId) {
        // Recarregar vídeos para incluir o novo vídeo
        await loadUserVideos();
        return videoId;
      }
      
      return null;
    } catch (error) {
      console.error("Erro ao salvar vídeo no banco de dados:", error);
      return null;
    }
  };

  // Função para alternar seleção de vídeo
  const toggleVideoSelection = (id: string) => {
    setSelectedVideos((prev) => {
      const isSelected = prev.some((v) => v.id === id);
      const video = videos.find(v => v.id === id) || searchResults.find(v => v.id === id);
      
      if (!video) return prev;
      
      if (isSelected) {
        return prev.filter((v) => v.id !== id);
      } else {
        return [...prev, video];
      }
    });
  };
  
  // Função para adicionar vídeo à seleção
  const addToSelectedVideos = (video: VideoResult) => {
    setSelectedVideos((prev) => {
      const isSelected = prev.some((v) => v.id === video.id);
      if (isSelected) {
        return prev;
      } else {
        return [...prev, video];
      }
    });
  };
  
  // Função para limpar vídeos selecionados
  const clearSelectedVideos = () => {
    setSelectedVideos([]);
    localStorage.removeItem('selectedVideos');
    console.log("Vídeos selecionados limpos do localStorage");
  };

  return (
    <VideoContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        searchResults,
        setSearchResults,
        searchVideos,
        selectedVideos,
        setSelectedVideos,
        toggleVideoSelection,
        addToSelectedVideos,
        clearSelectedVideos,
        videos,
        setVideos,
        currentVideo,
        setCurrentVideo,
        isSearching,
        loadUserVideos,
        saveVideoToDB
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
