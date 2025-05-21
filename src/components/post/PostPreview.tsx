
import { useState, useRef, useEffect } from "react";
import { VideoResult } from "@/types/video";
import { formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import VideoPlayer from "../video/VideoPlayer";
import VideoStats from "../video/VideoStats";

interface PostPreviewProps {
  video: VideoResult;
}

const PostPreview = ({ video }: PostPreviewProps) => {
  const [isHovering, setIsHovering] = useState(false);

  if (!video || !video.title) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-4">
          Dados do vídeo inválidos
        </h2>
      </div>
    );
  }

  return (
    <motion.div 
      className="glass-card rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-300 hover:border-white/20 w-full max-w-[320px]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="p-3 pb-2">
        <h2 className="text-lg font-medium text-white mb-1">
          Pré-visualização
        </h2>
        <h3 className="text-base font-semibold text-white line-clamp-2 mb-2">
          {video.title}
        </h3>
      </div>
      
      <div className="aspect-[9/16] relative overflow-hidden">
        <VideoPlayer 
          title={video.title}
          videoUrl={video.videoUrl}
          thumbnail={video.thumbnail}
          showControls={true}
          showInstagramLogo={false}
        />
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-center mt-2">
          <VideoStats 
            views={video.stats?.views || 0}
            likes={video.stats?.likes || 0}
            shares={video.stats?.shares || 0}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PostPreview;
