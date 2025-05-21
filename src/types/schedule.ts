export interface ScheduledPost {
  id: string;
  caption: string;
  type: 'feed' | 'reel' | 'story';
  schedule_for: string;
  platform: 'instagram' | 'tiktok' | 'facebook' | 'youtube';
  posted: boolean;
  user_id?: string;
  video_id?: string;
  created_at?: string;
  updated_at?: string;
  videos: {
    title: string;
    thumbnail_url: string;
    video_url: string;
  };
  tags: string;
  status: 'pendente' | 'postado' | 'erro';
  username: string;
  error_message: string;
  video_url: string;
}
