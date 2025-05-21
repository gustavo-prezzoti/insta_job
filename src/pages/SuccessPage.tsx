
import { motion } from 'framer-motion';
import { CheckCircle, Home, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useVideo } from '@/contexts/VideoContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const SuccessPage = () => {
  const { currentVideo } = useVideo();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          className="max-w-lg w-full glass-card rounded-2xl overflow-hidden text-center p-8 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-purple-100/50 dark:border-white/10 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-viral-accent-purple/20 to-viral-accent-pink/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-viral-accent-purple" />
          </motion.div>
          
          <h1 className="text-2xl font-bold text-viral-accent-purple dark:text-white mb-2">
            Vídeo Publicado no Instagram!
          </h1>
          
          <p className="text-viral-accent-purple/70 dark:text-white/60 mb-4">
            Seu vídeo do TikTok foi publicado com sucesso no Instagram e já está disponível para seus seguidores.
          </p>
          
          <Badge variant="secondary" className="bg-gradient-to-r from-viral-accent-purple/90 to-viral-accent-pink/90 text-white border-none px-3 py-1 inline-flex items-center gap-1 mb-4">
            <Instagram size={14} className="mr-1" />
            <span>Postado com Sucesso!</span>
          </Badge>
          
          {currentVideo && (
            <div className="mb-8">
              <div className="aspect-[9/16] max-w-[200px] mx-auto overflow-hidden rounded-lg shadow-md">
                <img 
                  src={currentVideo.thumbnail} 
                  alt={currentVideo.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-4 text-sm text-viral-accent-purple/70 dark:text-white/60">
                O vídeo foi processado, otimizado e publicado no seu Instagram.
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink hover:opacity-90 text-white shadow-md"
            >
              <Home className="mr-2 h-4 w-4" /> Voltar ao Início
            </Button>
            
            <Button 
              onClick={() => navigate('/search')}
              variant="outline"
              className="border-viral-accent-purple/30 text-viral-accent-purple dark:text-white hover:bg-viral-accent-purple/10"
            >
              <Instagram className="mr-2 h-4 w-4" /> Buscar mais vídeos
            </Button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default SuccessPage;
