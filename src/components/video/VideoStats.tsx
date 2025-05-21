
import { Eye, Heart, Share2 } from 'lucide-react';

interface VideoStatsProps {
  views: number;
  likes: number;
  shares: number;
  size?: 'small' | 'regular';
}

const formatStat = (value: number): string => {
  if (value >= 1000000) {
    return `${Math.floor(value / 1000000)}M`;
  } else if (value >= 1000) {
    return `${Math.floor(value / 1000)}K`;
  }
  return value.toString();
};

const VideoStats = ({ views, likes, shares, size = 'regular' }: VideoStatsProps) => {
  const iconSize = size === 'small' ? 12 : 16;
  const textClassName = size === 'small' ? 'text-xs' : '';
  
  return (
    <div className={`flex items-center ${size === 'small' ? 'space-x-3' : 'space-x-3'} ${size === 'small' ? 'text-white/60' : 'text-white/80'}`}>
      <span className="flex items-center">
        <Eye size={iconSize} className="mr-1" /> {formatStat(views)}
      </span>
      <span className="flex items-center">
        <Heart size={iconSize} className="mr-1" /> {formatStat(likes)}
      </span>
      <span className="flex items-center">
        <Share2 size={iconSize} className="mr-1" /> {formatStat(shares)}
      </span>
    </div>
  );
};

export default VideoStats;
