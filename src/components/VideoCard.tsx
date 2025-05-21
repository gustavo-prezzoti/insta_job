
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import VideoStats from './video/VideoStats';
import VideoPlayer from './video/VideoPlayer';

export interface VideoCardProps {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
  selected?: boolean;
  onClick?: () => void;
  showInstagramLogo?: boolean;
  showControls?: boolean;
  small?: boolean;
}

const VideoCard = ({
  id,
  title,
  videoUrl,
  thumbnail,
  stats,
  selected = false,
  onClick,
  showInstagramLogo = true,
  showControls = true,
  small = false
}: VideoCardProps) => {
  const cardVariants = {
    hover: small ? { scale: 1.03 } : { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      className={cn(
        "rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border transition-all",
        selected ? "border-viral-accent-purple shadow-lg shadow-viral-accent-purple/20" : "border-white/10",
        small ? "w-full max-w-[320px]" : "w-full",
        onClick ? "cursor-pointer" : ""
      )}
      onClick={onClick}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-3 pb-2">
        <h3 className="text-lg font-medium text-white truncate">{title}</h3>
        <div className="mt-1">
          <VideoStats 
            views={stats.views}
            likes={stats.likes}
            shares={stats.shares}
            size="small"
          />
        </div>
      </div>
      
      <AspectRatio ratio={9/16} className="w-full">
        <VideoPlayer
          title={title}
          videoUrl={videoUrl}
          thumbnail={thumbnail}
          showControls={showControls}
          showInstagramLogo={showInstagramLogo}
          selected={selected}
        />
      </AspectRatio>
      
      <div className="p-3 flex justify-between items-center">
        <VideoStats 
          views={stats.views}
          likes={stats.likes}
          shares={stats.shares}
        />
        
        {onClick && (
          <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
            {selected ? (
              <div className="w-4 h-4 bg-viral-accent-purple rounded-full" />
            ) : null}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoCard;
