
import { useState } from 'react';
import { Heart, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { VideoResult } from '@/types/video';
import { formatNumber } from '@/lib/utils';

interface SearchVideoCardProps {
  video: VideoResult;
  isSelected: boolean;
  toggleVideoSelection: (id: string) => void;
  onPreview: (e: React.MouseEvent, video: VideoResult) => void;
}

const SearchVideoCard = ({ 
  video, 
  isSelected, 
  toggleVideoSelection, 
  onPreview 
}: SearchVideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Função para selecionar vídeo, garantindo que o evento não se propague
  const handleSelectVideo = (e: React.MouseEvent, videoId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleVideoSelection(videoId);
  };

  return (
    <motion.div
      key={video.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        relative rounded-lg overflow-hidden cursor-pointer
        ${isSelected ? 'ring-2 ring-viral-accent-purple shadow-lg shadow-viral-accent-purple/20' : 'bg-white/5'}
        transition-all duration-300 transform hover:translate-y-[-5px]
      `}
      onClick={() => toggleVideoSelection(video.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[9/16] bg-white/5">
        <img 
          src={video.thumbnail || '/placeholder.svg'} 
          alt={video.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/80 to-transparent
          ${isHovered ? 'opacity-100' : 'opacity-70'}
          transition-opacity duration-300
        `}>
          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 text-white text-xs">
            <div className="flex items-center">
              <Heart size={12} className="mr-1 text-red-500" />
              <span>{formatNumber(video.stats?.likes || 0)}</span>
            </div>
            <div className="flex-1 text-right">
              <span>{formatNumber(video.stats?.views || 0)} visualizações</span>
            </div>
          </div>
        </div>
        
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-viral-accent-purple flex items-center justify-center text-white text-xs border-2 border-white shadow-md">
            <span>✓</span>
          </div>
        )}
        
        {/* Botão de visualizar */}
        <button
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-viral-accent-pink/90 flex items-center justify-center text-white text-xs shadow-md"
          onClick={(e) => onPreview(e, video)}
          title="Visualizar vídeo"
        >
          <Play size={16} />
        </button>
        
        {/* Botão de selecionar - garantindo que o evento de clique seja capturado */}
        <div 
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-viral-accent-purple/90 flex items-center justify-center text-white text-xs shadow-md"
          onClick={(e) => handleSelectVideo(e, video.id)}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          title="Selecionar vídeo"
        >
          {isSelected ? "✓" : "+"}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="text-white text-sm font-medium line-clamp-2">
          {video.title}
        </h3>
      </div>
    </motion.div>
  );
};

export default SearchVideoCard;
