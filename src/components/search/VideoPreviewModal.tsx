
import { useState, useEffect } from 'react';
import { Eye, Heart, Share2, Play } from 'lucide-react';
import { VideoResult } from '@/types/video';
import { formatNumber } from '@/lib/utils';

interface VideoPreviewModalProps {
  video: VideoResult | null;
  onClose: () => void;
}

const VideoPreviewModal = ({ video, onClose }: VideoPreviewModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Fechar o modal ao pressionar Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!video) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="bg-black/50 backdrop-blur-md rounded-lg overflow-hidden border border-white/10">
          <div className="p-4">
            <h3 className="text-white text-lg font-medium line-clamp-1 mb-2">{video.title}</h3>
            
            <div className="aspect-[9/16] relative overflow-hidden rounded-lg">
              {!isPlaying ? (
                <>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                    onClick={togglePlay}
                  >
                    <div className="w-16 h-16 bg-viral-accent-pink/90 rounded-full flex items-center justify-center">
                      <Play size={30} className="text-white ml-1" />
                    </div>
                  </div>
                </>
              ) : (
                <video
                  src={video.videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  controls
                  muted
                  playsInline
                />
              )}
            </div>
            
            <div className="flex items-center justify-between mt-4 text-white/80">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Eye size={16} className="mr-1" />
                  {formatNumber(video.stats?.views || 0)}
                </span>
                <span className="flex items-center">
                  <Heart size={16} className="mr-1" />
                  {formatNumber(video.stats?.likes || 0)}
                </span>
                <span className="flex items-center">
                  <Share2 size={16} className="mr-1" />
                  {formatNumber(video.stats?.shares || 0)}
                </span>
              </div>
              
              <button
                className="text-white text-sm px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={onClose}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewModal;
