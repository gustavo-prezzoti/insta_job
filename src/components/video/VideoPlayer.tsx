
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import VideoThumbnail from './VideoThumbnail';
import VideoControls from './VideoControls';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
  title: string;
  videoUrl: string;
  thumbnail: string;
  showControls?: boolean;
  showInstagramLogo?: boolean;
  selected?: boolean;
}

const VideoPlayer = ({ 
  title, 
  videoUrl, 
  thumbnail, 
  showControls = true,
  showInstagramLogo = true,
  selected = false
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      const updateProgress = () => {
        if (videoElement.duration) {
          setProgress((videoElement.currentTime / videoElement.duration) * 100);
          setCurrentTime(videoElement.currentTime);
        }
      };
      
      videoElement.addEventListener('timeupdate', updateProgress);
      videoElement.addEventListener('loadedmetadata', () => {
        setDuration(videoElement.duration);
      });
      
      return () => {
        videoElement.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (value / 100) * videoRef.current.duration;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div 
      className="relative bg-black/20 w-full h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {!isPlaying && (
        <VideoThumbnail 
          title={title} 
          thumbnail={thumbnail} 
          togglePlay={togglePlay} 
        />
      )}
      
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnail}
        className={cn(
          "w-full h-full object-cover",
          isPlaying ? "opacity-100" : "opacity-0"
        )}
        muted={isMuted}
        loop
        playsInline
        onClick={togglePlay}
      />
      
      {showControls && (isPlaying || isHovering) && (
        <VideoControls 
          videoRef={videoRef}
          isPlaying={isPlaying}
          isMuted={isMuted}
          progress={progress}
          currentTime={currentTime}
          duration={duration}
          isHovering={isHovering}
          togglePlay={togglePlay}
          toggleMute={toggleMute}
          handleProgressChange={handleProgressChange}
          handleFullscreen={handleFullscreen}
        />
      )}
      
      {showInstagramLogo && (
        <div className="absolute bottom-3 right-3 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-instagram"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        </div>
      )}
      
      {selected && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 bg-viral-accent-purple rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
