import { API } from '@/api/index';

const checkInstagramCredentials = () => API.get('/instagram/check-credentials');

const connectInstagram = ({ username, password }: { username: string; password: string }) =>
  API.post('/instagram/connect', { username, password });

// Função simples para obter a URL OAuth do backend
const getInstagramAuthUrl = () => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'jwt-token': token || '',
    'Authorization': token ? `Bearer ${token}` : '',
  };
  
  // Chamar endpoint no backend que retorna a URL OAuth completa
  return API.post('/instagram/oauth/auth', {}, { headers });
};

// Função para processar o código de autorização recebido do Instagram
const processAuthorizationCode = (code: string) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'jwt-token': token || '',
    'Authorization': token ? `Bearer ${token}` : '',
  };
  
  return API.post('/instagram/oauth/callback', { code }, { headers });
};

// Função para completar o fluxo OAuth do Instagram com o código temporário
const completeOAuthFlow = (tempCode: string) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'jwt-token': token || '',
    'Authorization': token ? `Bearer ${token}` : '',
  };
  
  return API.post('/instagram/oauth/complete', { temp_code: tempCode }, { headers });
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
  getInstagramAuthUrl,
  processAuthorizationCode,
  completeOAuthFlow,
  disconnectInstagram,
  postToInstagram,
  getInstagramPosts,
  getAllInstagramPosts,
  checkInstagramCredentials,
};

export default InstagramAPI;
