
import { Play } from 'lucide-react';

interface VideoThumbnailProps {
  title: string;
  thumbnail: string;
  togglePlay: (e?: React.MouseEvent) => void;
}

const VideoThumbnail = ({ title, thumbnail, togglePlay }: VideoThumbnailProps) => {
  return (
    <div className="absolute inset-0">
      <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            togglePlay(e);
          }}
          className="w-14 h-14 bg-viral-accent-pink/90 rounded-full flex items-center justify-center text-white hover:bg-viral-accent-pink transition-all"
        >
          <Play size={28} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default VideoThumbnail;
