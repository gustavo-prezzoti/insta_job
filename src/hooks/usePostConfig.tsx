
import { useEffect } from "react";
import { useVideo } from "@/contexts/VideoContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuthCheck } from "./useAuthCheck";
import { useInstagramCredentials } from "./useInstagramCredentials";
import { useVideoSelection } from "./useVideoSelection";
import { usePostFormState } from "./usePostFormState";
import { usePostSubmission } from "./usePostSubmission";
import { useNavigationControl } from "./useNavigationControl";

export const usePostConfig = () => {
  const { setCurrentVideo } = useVideo();
  const { authError, setAuthError } = useAuthCheck();
  const { hasCredentials } = useInstagramCredentials();
  const { selectedVideo, selectedVideos, setSelectedVideos, setSelectedVideo } = useVideoSelection();
  const { 
    caption, 
    setCaption, 
    hashtags, 
    setHashtags, 
    postType, 
    setPostType,
    isScheduled,
    setIsScheduled,
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime
  } = usePostFormState();
  
  // Verificar se temos vídeos disponíveis
  const hasVideos = Boolean(selectedVideo) || selectedVideos.length > 0;
  const { handleBack, redirectIfNoVideos } = useNavigationControl(hasVideos);
  
  const { isPosting, handleSubmit } = usePostSubmission(
    selectedVideo, 
    caption, 
    hashtags, 
    postType,
    isScheduled,
    scheduledDate,
    scheduledTime,
    authError,
    (video) => {
      setCurrentVideo(video);
    }
  );
  
  // Verificar e restaurar sessão do Supabase ao carregar a página
  useEffect(() => {
    const checkAndRestoreSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          await supabase.auth.refreshSession();
        }
      } catch (err) {
        console.error("Erro ao verificar estado de autenticação:", err);
      }
    };
    
    checkAndRestoreSession();
  }, [setAuthError]);
  
  // Verificar se temos vídeos e redirecionar se não tiver
  // Modificação: só redireciona se não tiver absolutamente nenhum vídeo
  useEffect(() => {
    // Só redireciona se não tiver nenhum vídeo selecionado E nenhum na lista de vídeos selecionados
    if (!selectedVideo && selectedVideos.length === 0) {
      console.log("Nenhum vídeo selecionado, verificando localStorage antes de redirecionar...");
      
      // Verificar se há algum vídeo no localStorage antes de redirecionar
      const storedVideo = localStorage.getItem('currentSelectedVideo');
      const storedVideos = localStorage.getItem('selectedVideos');
      
      if (!storedVideo && !storedVideos) {
        console.log("Nenhum vídeo encontrado no localStorage, redirecionando para busca...");
        redirectIfNoVideos();
      } else {
        console.log("Vídeo encontrado no localStorage, não redirecionando");
      }
    }
  }, [selectedVideo, selectedVideos, redirectIfNoVideos]);

  return {
    selectedVideo,
    isPosting,
    caption,
    setCaption,
    hashtags,
    setHashtags,
    postType,
    setPostType,
    isScheduled,
    setIsScheduled,
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
    handleBack,
    handleSubmit,
    hasCredentials,
    authError
  };
};
