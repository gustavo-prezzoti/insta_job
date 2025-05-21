
import MainLayout from "@/layouts/MainLayout";
import PageHeader from "@/components/post/PageHeader";
import PostPreview from "@/components/post/PostPreview";
import PostForm from "@/components/post/PostForm";
import PostActions from "@/components/post/PostActions";
import LoadingView from "@/components/post/LoadingView";
import { usePostConfig } from "@/hooks/usePostConfig";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const PostConfigPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
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
  } = usePostConfig();
  
  // Reduzir o tempo de carregamento para 500ms
  useEffect(() => {
    console.log("PostConfigPage - Verificando se há vídeo...", selectedVideo);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Reduzido para 500ms
    
    return () => clearTimeout(timer);
  }, [selectedVideo]);
  
  // Se ainda estiver carregando ou não tiver vídeo, mostrar uma mensagem de carregamento
  if (isLoading) {
    return (
      <MainLayout>
        <LoadingView />
      </MainLayout>
    );
  }

  // Verificar mais uma vez se temos um vídeo após o carregamento
  if (!selectedVideo) {
    console.log("Sem vídeo após carregamento, mostrando tela de carregamento");
    return (
      <MainLayout>
        <LoadingView />
      </MainLayout>
    );
  }
  
  console.log("Renderizando página de configuração com vídeo:", selectedVideo);
  
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
        {/* Cabeçalho da página */}
        <PageHeader onBack={handleBack} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6"
        >
          {/* Coluna da esquerda - Preview do vídeo */}
          <motion.div 
            className="md:col-span-4 flex justify-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PostPreview video={selectedVideo} />
          </motion.div>
          
          {/* Coluna da direita - Configuração de postagem */}
          <motion.div 
            className="md:col-span-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-white/20">
              <h2 className="text-xl font-semibold text-white mb-6">Configurações da postagem</h2>
              
              <PostForm
                caption={caption}
                setCaption={setCaption}
                hashtags={hashtags}
                setHashtags={setHashtags}
                postType={postType}
                setPostType={setPostType}
                isScheduled={isScheduled}
                setIsScheduled={setIsScheduled}
                scheduledDate={scheduledDate}
                setScheduledDate={setScheduledDate}
                scheduledTime={scheduledTime}
                setScheduledTime={setScheduledTime}
              />
              
              {/* Ações de postagem */}
              <div className="mt-6">
                <PostActions
                  isPosting={isPosting}
                  onSubmit={handleSubmit}
                  postType={postType}
                  hasCredentials={hasCredentials}
                  authError={authError}
                  isScheduled={isScheduled}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default PostConfigPage;
