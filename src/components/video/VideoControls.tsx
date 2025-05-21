
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  isHovering: boolean;
  togglePlay: (e?: React.MouseEvent) => void;
  toggleMute: (e: React.MouseEvent) => void;
  handleProgressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFullscreen: (e: React.MouseEvent) => void;
}

const VideoControls = ({
  videoRef,
  isPlaying,
  isMuted,
  progress,
  currentTime,
  duration,
  isHovering,
  togglePlay,
  toggleMute,
  handleProgressChange,
  handleFullscreen
}: VideoControlsProps) => {
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={`video-controls absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent ${isHovering || isPlaying ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleProgressChange}
        className="w-full h-1 bg-white/30 rounded-full outline-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-viral-accent-pink"
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className="flex items-center justify-between mt-2">
        <div className="text-white text-xs">
          {formatTime(currentTime)} / {formatTime(duration || 0)}
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="w-8 h-8 flex items-center justify-center text-white rounded-full hover:bg-white/10"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button 
            className="w-8 h-8 flex items-center justify-center text-white rounded-full hover:bg-white/10"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button 
            className="w-8 h-8 flex items-center justify-center text-white rounded-full hover:bg-white/10"
            onClick={handleFullscreen}
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
