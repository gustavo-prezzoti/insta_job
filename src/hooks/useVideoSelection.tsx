
import { useState, useEffect } from "react";
import { VideoResult } from "@/types/video";

export const useVideoSelection = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<VideoResult[]>([]);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  useEffect(() => {
    console.log("PostConfigPage - Carregando dados dos vídeos...");
    
    const loadVideos = () => {
      try {
        // Tentar carregar o vídeo atual do localStorage com prioridade
        const currentVideoStr = localStorage.getItem('currentSelectedVideo');
        if (currentVideoStr) {
          try {
            const currentVideo = JSON.parse(currentVideoStr);
            console.log("Vídeo atual recuperado do localStorage:", currentVideo);
            
            if (currentVideo && currentVideo.id) {
              setSelectedVideo(currentVideo);
              
              // Adicionar aos vídeos selecionados se ainda não estiver lá
              setSelectedVideos(prev => {
                if (!prev.some(v => v.id === currentVideo.id)) {
                  console.log("Adicionando vídeo atual aos selecionados");
                  return [...prev, currentVideo];
                }
                return prev;
              });
              
              setLoadedFromStorage(true);
              return true;
            }
          } catch (parseError) {
            console.error("Erro ao analisar vídeo do localStorage:", parseError);
          }
        }
        
        // Se não encontrou o vídeo atual, tenta carregar a lista de vídeos
        try {
          const storedVideos = localStorage.getItem('selectedVideos');
          if (storedVideos) {
            const parsedVideos = JSON.parse(storedVideos);
            console.log("Vídeos carregados do localStorage:", parsedVideos);
            
            if (Array.isArray(parsedVideos) && parsedVideos.length > 0) {
              setSelectedVideos(parsedVideos);
              // Definir o primeiro vídeo como selecionado se não tiver nenhum
              if (!selectedVideo) {
                setSelectedVideo(parsedVideos[0]);
              }
              setLoadedFromStorage(true);
              return true;
            }
          }
          return false;
        } catch (error) {
          console.error("Erro ao carregar vídeos do localStorage:", error);
          return false;
        }
      } catch (error) {
        console.error("Erro geral ao carregar vídeos:", error);
        return false;
      }
    };
    
    if (!loadedFromStorage) {
      loadVideos();
    }
  }, [selectedVideo, loadedFromStorage]);

  return { selectedVideo, selectedVideos, setSelectedVideos, setSelectedVideo, loadedFromStorage };
};
