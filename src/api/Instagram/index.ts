import { API } from '@/api/index';

// Modificado para usar a URL absoluta correta e tratar erros de resposta HTML
const checkInstagramCredentials = () => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'jwt-token': token || '',
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/json' // Garantir que estamos solicitando JSON
  };

  // Usando o domínio correto e verificando a resposta para tratar HTML
  return API.get('/instagram/check-credentials', { headers })
    .then(response => {
      // Verificar se a resposta parece ser HTML
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        console.error('Recebeu HTML em vez de JSON na verificação de credenciais');
        // Retornar um objeto simulado com resposta de erro
        return {
          status: 400,
          data: {
            has_credentials: false,
            error: 'Resposta inválida do servidor'
          }
        };
      }
      return response;
    })
    .catch(error => {
      console.error('Erro na verificação de credenciais do Instagram:', error);
      // Retornar um objeto simulado com resposta de erro
      return {
        status: 400,
        data: {
          has_credentials: false,
          error: error.message || 'Erro na verificação de credenciais'
        }
      };
    });
};

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
    'Accept': 'application/json'
  };
  
  return API.post('/instagram/oauth/complete', { temp_code: tempCode }, { headers })
    .then(response => {
      // Verificar se a resposta parece ser HTML
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        console.error('Recebeu HTML em vez de JSON na completação OAuth');
        return {
          status: 400,
          data: {
            success: false,
            error: 'Resposta inválida do servidor'
          }
        };
      }
      return response;
    })
    .catch(error => {
      console.error('Erro no fluxo OAuth:', error);
      return {
        status: 400,
        data: {
          success: false,
          error: error.message || 'Erro no fluxo OAuth'
        }
      };
    });
};

// Nova função para publicação direta via OAuth
const publishToInstagram = ({
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
}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'jwt-token': token || '',
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/json'
  };

  return API.post('/instagram/oauth/publish', {
    username,
    type,
    when,
    schedule_date,
    video_url,
    caption,
    hashtags
  }, { headers })
  .then(response => {
    // Verificar se a resposta parece ser HTML
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error('Recebeu HTML em vez de JSON na publicação');
      return {
        status: 400,
        data: {
          success: false,
          error: 'Resposta inválida do servidor'
        }
      };
    }
    return response;
  })
  .catch(error => {
    console.error('Erro na publicação:', error);
    return {
      status: 400,
      data: {
        success: false,
        error: error.message || 'Erro na publicação'
      }
    };
  });
};

// Nova função para revogar acesso OAuth do Instagram
const revokeInstagramOAuth = (username: string) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'jwt-token': token || '',
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/json'
  };

  return API.post('/instagram/oauth/revoke', {
    username
  }, { headers })
  .then(response => {
    // Verificar se a resposta parece ser HTML
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error('Recebeu HTML em vez de JSON na revogação OAuth');
      return {
        status: 400,
        data: {
          success: false,
          error: 'Resposta inválida do servidor'
        }
      };
    }
    return response;
  })
  .catch(error => {
    console.error('Erro na revogação OAuth:', error);
    return {
      status: 400,
      data: {
        success: false,
        error: error.message || 'Erro na revogação OAuth'
      }
    };
  });
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
  publishToInstagram,
  revokeInstagramOAuth,
  getInstagramPosts,
  getAllInstagramPosts,
  checkInstagramCredentials,
};

export default InstagramAPI;
