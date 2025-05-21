
import { supabase } from "@/integrations/supabase/client";
import { VideoResult } from "@/types/video";

// Interface para o resultado da API de scraping do TikTok
interface TikTokScraperResult {
  success: boolean;
  videoData: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    stats: {
      views: number;
      likes: number;
      shares: number;
    };
    watermarkRemoved: boolean;
  };
}

// Função para baixar um vídeo do TikTok
export const downloadTikTokVideo = async (url: string): Promise<VideoResult | null> => {
  try {
    console.log("Iniciando download do vídeo do TikTok:", url);
    
    // Chamar nossa edge function para extrair o vídeo do TikTok
    const { data, error } = await supabase.functions.invoke('tiktok-scraper', {
      body: { url }
    });
    
    if (error) {
      console.error("Erro ao chamar a edge function:", error);
      throw error;
    }
    
    const result = data as TikTokScraperResult;
    
    if (!result.success) {
      console.error("Falha na extração do vídeo");
      return null;
    }
    
    // Formatando o resultado para o formato VideoResult
    const videoResult: VideoResult = {
      id: result.videoData.id,
      title: result.videoData.title,
      videoUrl: result.videoData.videoUrl,
      thumbnail: result.videoData.thumbnailUrl,
      stats: {
        views: result.videoData.stats.views,
        likes: result.videoData.stats.likes,
        shares: result.videoData.stats.shares
      }
    };
    
    console.log("Vídeo baixado com sucesso:", videoResult);
    
    return videoResult;
  } catch (error) {
    console.error("Erro ao baixar vídeo do TikTok:", error);
    return null;
  }
};

// Função para salvar um vídeo no banco de dados
export const saveVideoToDatabase = async (video: VideoResult, sourceUrl: string, platform: 'tiktok' | 'instagram' | 'youtube'): Promise<string | null> => {
  try {
    // Verificando se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Usuário não autenticado");
      return null;
    }
    
    // Verificando se o vídeo já existe no banco de dados
    const { data: existingVideo } = await supabase
      .from('videos')
      .select('id')
      .eq('source_url', sourceUrl)
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (existingVideo) {
      console.log("Vídeo já existe no banco de dados, retornando ID existente:", existingVideo.id);
      return existingVideo.id;
    }
    
    // Inserindo o vídeo no banco de dados
    const { data, error } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        title: video.title,
        description: video.title, // Usando o título como descrição por padrão
        source_url: sourceUrl,
        video_url: video.videoUrl,
        thumbnail_url: video.thumbnail,
        platform: platform,
        views: video.stats.views,
        likes: video.stats.likes,
        shares: video.stats.shares,
        download_status: 'completed',
        watermark_removed: true
      })
      .select('id')
      .single();
      
    if (error) {
      console.error("Erro ao salvar vídeo no banco de dados:", error);
      return null;
    }
    
    console.log("Vídeo salvo com sucesso no banco de dados. ID:", data.id);
    return data.id;
  } catch (error) {
    console.error("Erro ao salvar vídeo:", error);
    return null;
  }
};

// Função para excluir um vídeo do banco de dados após a postagem
export const deleteVideoFromDatabase = async (videoId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);
      
    if (error) {
      console.error("Erro ao excluir vídeo do banco de dados:", error);
      return false;
    }
    
    console.log("Vídeo excluído com sucesso do banco de dados. ID:", videoId);
    return true;
  } catch (error) {
    console.error("Erro ao excluir vídeo:", error);
    return false;
  }
};

// Função para buscar vídeos salvos do usuário
export const getUserSavedVideos = async (): Promise<VideoResult[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Usuário não autenticado");
      return [];
    }
    
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Erro ao buscar vídeos do usuário:", error);
      return [];
    }
    
    // Convertendo os dados para o formato VideoResult
    return data.map(video => ({
      id: video.id,
      title: video.title,
      videoUrl: video.video_url,
      thumbnail: video.thumbnail_url,
      stats: {
        views: video.views,
        likes: video.likes,
        shares: video.shares
      }
    }));
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return [];
  }
};
