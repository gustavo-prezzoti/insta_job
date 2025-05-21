import { motion } from 'framer-motion';
import { ArrowRight, Dog, Ghost, Dribbble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import VideoCard from '@/components/VideoCard';
import { useVideo } from '@/contexts/VideoContext';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const { videos } = useVideo();
  const { isAuthenticated } = useAuth();
  
  // Pegar apenas os 3 vídeos mais populares para mostrar na home
  const featuredVideos = [...videos]
    .sort((a, b) => b.stats.views - a.stats.views)
    .slice(0, 3);

  return (
    <MainLayout showNavigation={true}>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pb-20">
          {/* Hero section */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between py-16 md:py-24">
            <motion.div 
              className="md:max-w-lg" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                Impulsione seu<br /> engajamento<br /> 
                <span className="bg-gradient-to-r from-viral-accent-pink to-viral-accent-purple bg-clip-text text-transparent">
                  com vídeos virais
                </span>
              </h1>
              <p className="text-white/70 text-lg mt-6 mb-8 leading-relaxed">
                Encontre facilmente os melhores vídeos virais do TikTok e compartilhe-os diretamente em seu Instagram. Aumente seu engajamento organicamente com conteúdo que já provou ser um sucesso.
              </p>
              <Link to={isAuthenticated ? "/search" : "/login"}>
                <Button 
                  className="bg-viral-accent-purple hover:bg-viral-accent-purple/90 text-white button-hover rounded-full px-8 py-6"
                  size="lg"
                >
                  Começar sua campanha
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
            
            {/* Cards de vídeos virais */}
            <div className="mt-10 md:mt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.map((video, index) => (
                <motion.div 
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                >
                  <VideoCard
                    id={video.id}
                    title={video.title}
                    videoUrl={video.videoUrl}
                    thumbnail={video.thumbnail}
                    stats={video.stats}
                    small={true}
                  />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Features section */}
          <motion.div 
            className="py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Como o <span className="text-viral-accent-pink">Robô Viral</span> funciona
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                number="01"
                title="Busque vídeos virais"
                description="Pesquise por palavras-chave e encontre os vídeos mais virais do TikTok em sua categoria."
                icon={<Dog className="h-8 w-8 text-viral-accent-pink" />}
              />
              <FeatureCard 
                number="02"
                title="Selecione os melhores"
                description="Escolha os vídeos que melhor se encaixam em sua estratégia com base em visualizações, curtidas e compartilhamentos."
                icon={<Ghost className="h-8 w-8 text-viral-accent-pink" />}
              />
              <FeatureCard 
                number="03"
                title="Poste automaticamente"
                description="Configure legenda, hashtags e agende suas postagens para o Feed, Reels ou Stories do Instagram."
                icon={<Dribbble className="h-8 w-8 text-viral-accent-pink" />}
              />
            </div>
          </motion.div>
          
          {/* CTA section */}
          <motion.div 
            className="py-16 md:py-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Pronto para crescer no Instagram?
              </h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto mb-8">
                Centenas de criadores de conteúdo já estão usando o Robô Viral para aumentar seu engajamento. Junte-se a eles e comece a crescer hoje mesmo.
              </p>
              <Link to={isAuthenticated ? "/search" : "/login"}>
                <Button 
                  className="bg-white text-viral-blue-dark hover:bg-white/90 button-hover rounded-full px-8 py-6"
                  size="lg"
                >
                  Começar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

const FeatureCard = ({ 
  number, 
  title, 
  description, 
  icon 
}: { 
  number: string; 
  title: string; 
  description: string; 
  icon?: React.ReactNode;
}) => (
  <motion.div 
    className="glass-card rounded-xl p-6 h-full flex flex-col"
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <div className="flex justify-between items-center mb-4">
      <div className="text-viral-accent-pink font-bold text-4xl">{number}</div>
      {icon && <div>{icon}</div>}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-white/70 flex-grow">{description}</p>
  </motion.div>
);

export default HomePage;
