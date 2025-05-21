
import { VideoResult } from "@/types/video";
import { saveSearchTerm } from "./searchService";
import { saveVideoToDatabase, deleteVideoFromDatabase } from "./videoService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Função para buscar vídeos do TikTok
export const searchTikTokVideos = async (keyword: string): Promise<VideoResult[]> => {
  console.log(`Buscando vídeos com a palavra-chave: ${keyword}`);
  
  try {
    // Salvando termo de pesquisa no histórico
    await saveSearchTerm(keyword, 'tiktok');
    
    // Chamando nossa função edge com promise race para timeout
    const fetchPromise = new Promise<VideoResult[]>(async (resolve, reject) => {
      try {
        console.log(`Chamando edge function rapidapi-tiktok com keyword: ${keyword}`);
        
        const { data, error } = await supabase.functions.invoke('rapidapi-tiktok', {
          body: { keyword, region: "BR", count: 30, publish_time: 0 }
        });
        
        if (error) {
          console.error(`Erro ao buscar vídeos: ${error.message}`);
          toast({
            title: "Erro na busca",
            description: `Não foi possível encontrar vídeos para "${keyword}". Tente novamente.`,
            variant: "destructive",
          });
          reject(error);
          return;
        }
        
        console.log("Resposta da edge function rapidapi-tiktok:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          console.log(`Encontrados ${data.length} vídeos`, data);
          
          // Garantir que todos os objetos de vídeo têm a estrutura correta
          const formattedVideos = data.map(video => ({
            id: video.id || `tiktok-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            title: video.title || 'Vídeo sem título',
            videoUrl: video.videoUrl || '',
            thumbnail: video.thumbnail || '',
            stats: video.stats || { views: 0, likes: 0, shares: 0 }
          }));
          
          // Ordenar vídeos por número de visualizações (do maior para o menor)
          const sortedVideos = formattedVideos.sort((a, b) => 
            (b.stats?.views || 0) - (a.stats?.views || 0)
          );
          
          // Salvar vídeos no banco de dados em background
          sortedVideos.forEach(async (video) => {
            await saveVideoToDatabase(video, keyword, 'tiktok');
          });
          
          resolve(sortedVideos);
          
          // Mostrar toast de sucesso
          toast({
            title: "Busca concluída",
            description: `Encontrados ${data.length} vídeos para "${keyword}"`,
            variant: "success",
          });
        } else {
          console.warn("Nenhum vídeo encontrado pela API", data);
          toast({
            title: "Nenhum resultado",
            description: `Não encontramos vídeos para "${keyword}". Tente outra palavra-chave.`,
            variant: "destructive",
          });
          resolve([]);
        }
      } catch (err) {
        console.error("Erro na execução da busca:", err);
        reject(err);
      }
    });
    
    // Adicionando timeout de 30 segundos
    const timeoutPromise = new Promise<VideoResult[]>((_, reject) => {
      setTimeout(() => {
        toast({
          title: "Tempo esgotado",
          description: "A busca demorou muito tempo. Por favor, tente novamente.",
          variant: "destructive",
        });
        reject(new Error("Timeout após 30 segundos"));
      }, 30000);
    });
    
    // Utilizando Promise.race para implementar o timeout
    return await Promise.race([fetchPromise, timeoutPromise]);
    
  } catch (error) {
    console.error(`Erro ao buscar vídeos: ${error}`);
    toast({
      title: "Erro na busca",
      description: "Ocorreu um erro ao buscar os vídeos. Por favor, tente novamente.",
      variant: "destructive",
    });
    return [];
  }
};

// Função para baixar um vídeo específico do TikTok (invisível para o usuário)
export const downloadVideo = async (url: string): Promise<VideoResult | null> => {
  try {
    console.log(`Iniciando download invisível do vídeo de TikTok: ${url}`);
    
    // Chamando nossa função edge para processar a URL
    const { data, error } = await supabase.functions.invoke('rapidapi-tiktok', {
      body: { url }
    });
    
    if (error) {
      console.error(`Erro ao processar URL: ${error.message}`);
      return null;
    }
    
    if (data) {
      const video: VideoResult = {
        id: data.id || `video-${new Date().getTime()}`,
        title: data.title || "Vídeo sem título",
        videoUrl: data.videoUrl || url,
        thumbnail: data.thumbnailUrl || data.thumbnail || "",
        stats: data.stats || { views: 0, likes: 0, shares: 0 }
      };
      
      return video;
    }
    
    return null;
  } catch (error) {
    console.error(`Erro ao baixar vídeo: ${error}`);
    return null;
  }
};

// Função para limpar vídeos após postagem
export const cleanupVideosAfterPosting = async (videoId: string): Promise<boolean> => {
  try {
    const success = await deleteVideoFromDatabase(videoId);
    return success;
  } catch (error) {
    console.error("Erro ao limpar vídeo do banco após postagem:", error);
    return false;
  }
};
