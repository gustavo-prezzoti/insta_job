import { API } from '@/api/index';

const checkInstagramCredentials = () => API.get('/instagram/check-credentials');

const connectInstagram = ({ username, password }: { username: string; password: string }) =>
  API.post('/instagram/connect', { username, password });

const connectInstagramOAuth = (redirectUri: string) => {
  // Garantir que temos o token JWT
  const token = localStorage.getItem('token');
  
  // Configurar os headers especificamente para esta requisição
  const headers = {
    'Content-Type': 'application/json',
    'jwt-token': token || '',
    'Authorization': token ? `Bearer ${token}` : '',
  };
  
  console.log('Enviando requisição OAuth com token:', token ? token.substring(0, 15) + '...' : 'Token não encontrado');
  
  return API.post('/instagram/oauth/auth', 
    { redirect_uri: redirectUri },
    { headers }
  );
};

const disconnectInstagram = ({ username }: { username: string }) => API.post('/instagram/disconnect', { username });

const postToInstagram = ({
  username,
  type,
  when,
  schedule_date,
  video_url,
  caption,
  hashtags,
}: {
  username: string;
  type: 'feed' | 'reel' | 'story';
  when: 'now' | 'schedule';
  schedule_date?: string;
  video_url: string;
  caption: string;
  hashtags?: string;
}) => API.post('/instagram/post', { username, type, when, schedule_date, video_url, caption, hashtags });

const getInstagramPosts = ({ username }: { username: string }) => API.get('/instagram/posts', { params: { username } });

const getAllInstagramPosts = () => API.get('/instagram/posts/all');

const InstagramAPI = {
  connectInstagram,
  connectInstagramOAuth,
  disconnectInstagram,
  postToInstagram,
  getInstagramPosts,
  getAllInstagramPosts,
  checkInstagramCredentials,
};

export default InstagramAPI;
