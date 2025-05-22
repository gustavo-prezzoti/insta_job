import Axios from 'axios';

// Determinar qual URL da API usar com base no ambiente
const isDev = import.meta.env.DEV;

// URL da API - Em desenvolvimento, usamos uma string vazia para que as requisições 
// sejam feitas diretamente na raiz, e o proxy do Vite intercepta
export const API_URL = isDev 
  ? '' // Em desenvolvimento, URL vazia para requisições diretas na raiz
  : 'https://insta-job-igff.vercel.app'; // Em produção, usamos a URL completa

console.log('Ambiente:', isDev ? 'desenvolvimento' : 'produção');
console.log('API URL configurada como:', API_URL || '(URL raiz)');

export const API = Axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log para debug
console.log('API configurada para baseURL:', API_URL || '(URL raiz)');

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
