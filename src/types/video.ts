
export interface VideoStat {
  views: number;
  likes: number;
  shares: number;
}

export interface VideoResult {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  stats: VideoStat;
}
