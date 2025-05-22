import Axios from 'axios';

// Determinar qual URL da API usar com base no ambiente
const isDev = import.meta.env.DEV;

// URL da API - Em desenvolvimento, usamos uma string vazia para que as requisições 
// sejam feitas diretamente na raiz, e o proxy do Vite intercepta
export const API_URL = isDev 
  ? '' // Em desenvolvimento, URL vazia para requisições diretas na raiz
  : 'https://systemsrvdsv.cloud'; // Em produção, usamos a URL completa do backend

console.log('Ambiente:', isDev ? 'desenvolvimento' : 'produção');
console.log('API URL configurada como:', API_URL || '(URL raiz)');

export const API = Axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Impedir a transformação da resposta se for HTML
  transformResponse: [(data) => {
    // Verificar se a resposta parece ser HTML
    if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
      console.error('Recebeu HTML em vez de JSON, abortando transformação');
      return { error: 'Resposta HTML inesperada', isHtmlResponse: true };
    }
    // Tentar fazer parse do JSON
    try {
      return JSON.parse(data);
    } catch (e) {
      // Se não for JSON, retornar os dados brutos
      return data;
    }
  }]
});

// Log para debug
console.log('API configurada para baseURL:', API_URL || '(URL raiz)');

// Adiciona logs para todas as requisições em desenvolvimento
if (import.meta.env.DEV) {
  API.interceptors.request.use(
    (config) => {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
      return config;
    },
    (error) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  API.interceptors.response.use(
    (response) => {
      // Verificar se a resposta parece ser HTML
      if (response.data && response.data.isHtmlResponse) {
        console.error('[API Response HTML Error]', response.config.url);
        // Criar um erro simulado com o status 500
        const error = new Error('Received HTML instead of JSON');
        throw error;
      }
      
      console.log(`[API Response] ${response.status} ${response.config.url}`, 
        typeof response.data === 'object' ? response.data : 'Non-object response');
      return response;
    },
    (error) => {
      console.error('[API Response Error]', error.response?.status, error.config?.url, error);
      return Promise.reject(error);
    }
  );
}

export const setToken = (token: string) => {
  if (token && typeof token === 'string') {
    // Configurar o token no formato correto nos headers
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    API.defaults.headers.common['jwt-token'] = token;
    
    // Salvar em localStorage para persistência
    localStorage.setItem('token', token);
    console.log('Token JWT configurado nos headers:', token.substring(0, 15) + '...');
  } else {
    console.warn('Tentativa de configurar token inválido:', token);
  }
};

// Função para obter e configurar o token em cada inicialização
async function getAndSetToken() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      console.log('Token recuperado do localStorage e configurado');
      return token;
    }
    return null;
  } catch (error: unknown) {
    console.error('Erro ao acessar localStorage:', error);
    return null;
  }
}

// Adiciona o token a cada requisição
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['jwt-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// if 401, logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Erro 401 detectado, fazendo logout');
      localStorage.clear();
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Inicializa o token
getAndSetToken();
