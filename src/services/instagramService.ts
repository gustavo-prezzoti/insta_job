import { API_URL, API } from '@/api';
import InstagramAPI from '@/api/Instagram';
import { supabase } from '@/integrations/supabase/client';
import CryptoJS from 'crypto-js';
import { toast } from 'sonner';

// Chave de criptografia (em produção, isso deve vir de uma variável de ambiente segura)
const ENCRYPTION_KEY = 'ViralAIInstaPostAppSecureKey2024';

// Interface para credenciais do Instagram no localStorage
interface InstagramLocalCredentials {
  username: string;
  timestamp: number;
}

// Interface para tipagem temporária das credenciais do Instagram no banco
interface InstagramCredentialsTable {
  id?: string;
  user_id: string;
  username: string;
  encrypted_password: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

// Interface para resposta da API de OAuth do Instagram
interface OAuthResponse {
  auth_url: string;
}

// Interface para o erro do Facebook
interface FacebookOAuthError {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id?: string;
  }
}

// Interface para o erro do Supabase
interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// Interface para resposta do Supabase
interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

// Função para criptografar senha
const encryptPassword = (password: string): string => {
  return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
};

// Função para descriptografar senha
const decryptPassword = (encryptedPassword: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Função para autenticar com Instagram via OAuth2
export const loginWithInstagramOAuth = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Iniciando autenticação OAuth com Instagram');
    
    // Check if we're already in the process of authenticating
    if (localStorage.getItem('instagram_auth_in_progress') === 'true') {
      console.log('Processo de autenticação já está em andamento, não iniciando outro');
      return { 
        success: false, 
        error: 'Já existe um processo de autenticação em andamento. Por favor, conclua ou cancele antes de tentar novamente.' 
      };
    }
    
    // Set flag to indicate authentication is in progress
    localStorage.setItem('instagram_auth_in_progress', 'true');
    // Set timestamp for when authentication was started
    localStorage.setItem('instagram_auth_timestamp', Date.now().toString());
    
    // Obter o token JWT
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token JWT não encontrado');
      localStorage.removeItem('instagram_auth_in_progress'); // Clear flag
      return { success: false, error: 'Você precisa estar logado para conectar ao Instagram' };
    }
    
    // Limpar qualquer indicador anterior de sucesso
    localStorage.removeItem('instagram_oauth_success');
    
    // Chamar a API para obter a URL de autenticação OAuth
    const response = await InstagramAPI.getInstagramAuthUrl();
    
    console.log('Resposta da API:', response.data);
    
    if (response.status !== 200 || !response.data.auth_url) {
      console.error('Erro ao obter URL de autenticação:', response.data);
      localStorage.removeItem('instagram_auth_in_progress'); // Clear flag
      return { 
        success: false, 
        error: response.data.message || 'Erro ao iniciar autenticação com Instagram' 
      };
    }
    
    // Usar a URL OAuth exatamente como retornada pelo backend
    const authUrl = response.data.auth_url;
    console.log('URL de autenticação obtida:', authUrl);
    
    // Set up a window message listener before opening the popup
    const messagePromise = new Promise<{ success: boolean; error?: string }>((resolve) => {
      const messageHandler = (event: MessageEvent) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) return;
        
        if (event.data?.type === 'INSTAGRAM_AUTH_SUCCESS') {
          console.log('Received success message from popup');
          window.removeEventListener('message', messageHandler);
          localStorage.removeItem('instagram_auth_in_progress'); // Clear flag
          resolve({ success: true });
        } else if (event.data?.type === 'INSTAGRAM_AUTH_ERROR') {
          console.log('Received error message from popup:', event.data.error);
          window.removeEventListener('message', messageHandler);
          localStorage.removeItem('instagram_auth_in_progress'); // Clear flag
          resolve({ success: false, error: event.data.error });
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // Clean up if window closed without sending a message
      setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        localStorage.removeItem('instagram_auth_in_progress'); // Clear flag after timeout
      }, 180000); // 3 minutes timeout
    });
    
    // Abrir janela de autenticação
    const authWindow = window.open(authUrl, 'instagram-oauth', 'width=600,height=700');
    
    if (!authWindow) {
      localStorage.removeItem('instagram_auth_in_progress'); // Clear flag
      return { 
        success: false, 
        error: 'Não foi possível abrir a janela de autenticação. Verifique se o bloqueador de pop-ups está desativado.' 
      };
    }
    
    console.log('Janela de autenticação aberta, aguardando conclusão...');
    
    // Race between messagePromise and window close check
    const checkWindowClosedPromise = new Promise<{ success: boolean; error?: string }>((resolve) => {
      const checkInterval = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkInterval);
          
          // Check if we have a successful connection after window close
          setTimeout(async () => {
            try {
              const checkResponse = await InstagramAPI.checkInstagramCredentials();
              if (checkResponse.data?.has_credentials) {
                console.log('Credenciais verificadas com sucesso após fechamento da janela');
                localStorage.removeItem('instagram_auth_in_progress'); // Clear flag
                resolve({ success: true });
              } else {
                console.error('Não foi possível verificar credenciais após fechamento da janela');
                localStorage.removeItem('instagram_auth_in_progress'); // Clear flag
                resolve({ success: false, error: 'A janela foi fechada sem completar a autenticação' });
              }
            } catch (error) {
              console.error('Erro ao verificar credenciais:', error);
              localStorage.removeItem('instagram_auth_in_progress'); // Clear flag
              resolve({ success: false, error: 'Erro ao verificar credenciais após fechamento da janela' });
            }
          }, 2000); // Small delay to allow API state to update
        }
      }, 500);
      
      // Clean up interval after 3 minutes
      setTimeout(() => {
        clearInterval(checkInterval);
        localStorage.removeItem('instagram_auth_in_progress'); // Clear flag after timeout
      }, 180000);
    });
    
    try {
      // Wait for either the message or window close
      const result = await Promise.race([messagePromise, checkWindowClosedPromise]);
      return result;
    } catch (error) {
      console.error('Erro durante autenticação:', error);
      localStorage.removeItem('instagram_auth_in_progress'); // Clear flag on error
      return { success: false, error: 'Erro durante processo de autenticação' };
    }
    
  } catch (error) {
    console.error('Erro no processo de autenticação OAuth:', error);
    localStorage.removeItem('instagram_auth_in_progress'); // Clear flag on error
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro inesperado durante autenticação com Instagram',
    };
  }
};

// Função para fazer login no Instagram
export const loginToInstagram = async (
  username: string,
  password: string,
): Promise<{ success: boolean; error?: string; detailedError?: string }> => {
  let isConnected = false;
  try {
    console.log('Iniciando processo de login no Instagram para:', username);

    // Enviar credenciais para o webhook
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      // Connect to Instagram via WebSocket
      const connectViaWebSocket = (username: string, password: string, token: string | null): Promise<boolean> => {
        return new Promise((resolve, reject) => {
          // Use the API_URL from the API setup
          const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const apiUrl = new URL(API_URL.replace('http', 'ws'));
          const wsUrl = `${wsProtocol}//${apiUrl.host}/instagram/connect-ws`;

          console.log('Connecting to WebSocket:', wsUrl);
          const socket = new WebSocket(wsUrl);

          // Set timeout for connection
          const connectionTimeout = setTimeout(() => {
            socket.close();
            reject(new Error('WebSocket connection timeout'));
          }, 15000); // 15 seconds timeout

          // Send credentials when connection is open
          socket.onopen = () => {
            clearTimeout(connectionTimeout);
            console.log('WebSocket connection established');

            socket.send(
              JSON.stringify({
                username,
                password,
                token: token || '',
              }),
            );
          };

          // Handle responses
          socket.onmessage = (event) => {
            try {
              const response = JSON.parse(event.data);
              console.log('WebSocket response received:', response.status);

              if (response.status === '2fa_required') {
                // Prompt user for 2FA code
                const twoFACode = prompt('Digite o código de verificação em duas etapas:');

                if (twoFACode) {
                  // Send back the 2FA code
                  socket.send(
                    JSON.stringify({
                      code: twoFACode,
                    }),
                  );
                } else {
                  socket.close();
                  reject(new Error('Código de verificação em duas etapas é necessário.'));
                }
              } else if (response.status === 'success') {
                // Authentication successful, save session info
                console.log('Instagram connected successfully');
                isConnected = true;
                socket.close();
                resolve(true);
              } else if (response.status === 'error') {
                // Handle error
                console.error('Error from WebSocket:', response.message);
                socket.close();
                reject(new Error(response.message || 'Erro ao conectar ao Instagram'));
              }
            } catch (error) {
              toast.error(error.message || 'Ocorreu um erro!');
              console.error('Error parsing WebSocket response:', error);
              socket.close();
              reject(new Error('Resposta inválida do servidor'));
            }
          };

          // Handle errors
          socket.onerror = (event: Event) => {
            clearTimeout(connectionTimeout);
            console.error('WebSocket error:', event);
            reject(new Error('Erro na conexão WebSocket'));
          };

          // Handle disconnection
          socket.onclose = (event: CloseEvent) => {
            clearTimeout(connectionTimeout);
            console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
            // Only resolve if not already resolved/rejected
            if (event.code === 1000) {
              resolve(true);
            }
          };
        });
      };

      // Try to connect via WebSocket
      const connected = await connectViaWebSocket(username, password, token);

      if (!connected) {
        throw new Error('Erro ao conectar ao Instagram.');
      }

      // Continue with regular API call
      //const response = await InstagramAPI.connectInstagram({ username, password });

      // if (response.status !== 200) {
      //   throw new Error('Erro ao conectar ao Instagram.');
      // }
    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      // Continuamos mesmo com erro no webhook
      return { success: false };
    }

    if (!isConnected) {
      throw new Error('Erro ao conectar ao Instagram.');
    }

    try {
      // Verificar se o usuário está autenticado
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Se não estiver autenticado, apenas salvar no localStorage
        const sessionData: InstagramLocalCredentials = {
          username,
          timestamp: Date.now(),
        };

        localStorage.setItem('instagram_credentials', JSON.stringify(sessionData));
        console.log('Usuário não autenticado no Supabase. Salvando apenas localmente.');
      } else {
        // Se estiver autenticado, salvar no banco de dados
        const encryptedPassword = encryptPassword(password);

        // Verificar se já existe um registro para o usuário usando RPC
        const { data: existingData, error: queryError } = await supabase
          .from('instagram_credentials')
          .select('*')
          .eq('user_id', session.user.id)
          .limit(1) as SupabaseResponse<InstagramCredentialsTable[]>;

        if (queryError) {
          console.error('Erro ao verificar credenciais existentes:', queryError);
          // Continuar com a inserção mesmo com erro na consulta
        }

        if (existingData && existingData.length > 0) {
          // Atualizar credenciais existentes
          const { error: updateError } = await supabase
            .from('instagram_credentials')
            .update({
              username: username,
              encrypted_password: encryptedPassword,
              updated_at: new Date().toISOString(),
              is_active: true,
            })
            .eq('user_id', session.user.id) as SupabaseResponse<InstagramCredentialsTable>;

          if (updateError) {
            console.error('Erro ao atualizar credenciais:', updateError);
            throw new Error('Falha ao atualizar credenciais do Instagram.');
          }
        } else {
          // Inserir novas credenciais
          const { error: insertError } = await supabase.from('instagram_credentials').insert({
            user_id: session.user.id,
            username: username,
            encrypted_password: encryptedPassword,
          }) as SupabaseResponse<InstagramCredentialsTable>;

          if (insertError) {
            console.error('Erro ao inserir credenciais:', insertError);
            throw new Error('Falha ao salvar credenciais do Instagram.');
          }
        }

        // Também salvar no localStorage para uso offline
        const sessionData: InstagramLocalCredentials = {
          username,
          timestamp: Date.now(),
        };

        localStorage.setItem('instagram_credentials', JSON.stringify(sessionData));
        console.log('Credenciais do Instagram salvas no banco de dados e localStorage');
      }
    } catch (dbError) {
      console.error('Erro ao salvar no banco de dados:', dbError);
      // Em caso de erro no banco, ao menos tentamos salvar no localStorage
      const sessionData: InstagramLocalCredentials = {
        username,
        timestamp: Date.now(),
      };

      localStorage.setItem('instagram_credentials', JSON.stringify(sessionData));
    }

    console.log('Associação do Instagram realizada com sucesso');
    return { success: true };
  } catch (error) {
    console.error('Erro no processo de login:', error);
    return {
      success: false,
      error: 'Erro inesperado ao fazer login no Instagram.',
      detailedError: error instanceof Error ? `${error.message}\n${error.stack}` : String(error),
    };
  }
};

// Função para verificar se o usuário tem credenciais do Instagram salvas
export const checkInstagramCredentials = async (): Promise<{
  hasCredentials: boolean;
  username?: string;
  usernames?: string[];
}> => {
  try {
    // Verificar no banco de dados primeiro
    const response = await InstagramAPI.checkInstagramCredentials();

    if (response.status !== 200) {
      return { hasCredentials: false };
    }

    if (response.data.has_credentials) {
      return { hasCredentials: true, username: response.data.usernames[0], usernames: response.data.usernames };
    }

    return { hasCredentials: false };

    const { data, error } = response.data;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const { data, error } = await supabase
        .from('instagram_credentials')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .limit(1) as SupabaseResponse<InstagramCredentialsTable[]>;

      if (!error && data && data.length > 0) {
        const credentials = data[0];
        if (credentials && credentials.is_active) {
          console.log('Credenciais encontradas no banco de dados:', credentials.username);
          return { hasCredentials: true, username: credentials.username };
        }
      }
    }

    // Se não encontrar no banco ou não estiver logado, verificar no localStorage
    const storedCredentials = localStorage.getItem('instagram_credentials');
    if (storedCredentials) {
      try {
        const { username, timestamp } = JSON.parse(storedCredentials) as InstagramLocalCredentials;
        const now = Date.now();
        const hoursElapsed = (now - timestamp) / (1000 * 60 * 60);

        if (hoursElapsed <= 24) {
          console.log('Credenciais encontradas no localStorage:', username);
          return { hasCredentials: true, username };
        } else {
          console.log('Credenciais do localStorage expiradas');
          localStorage.removeItem('instagram_credentials');
        }
      } catch (error) {
        console.error('Erro ao verificar credenciais no localStorage:', error);
      }
    }

    console.log('Nenhuma credencial válida encontrada');
    return { hasCredentials: false };
  } catch (error) {
    console.error('Erro ao verificar credenciais do Instagram:', error);
    return { hasCredentials: false };
  }
};

// Função para postar no Instagram
export const postToInstagram = async (
  videoUrl: string,
  caption: string,
  postType: 'reel' | 'feed' | 'story',
): Promise<{ success: boolean; postId?: string; error?: string }> => {
  try {
    // Verificando se temos credenciais do Instagram
    const { hasCredentials, username } = await checkInstagramCredentials();

    if (!hasCredentials || !username) {
      return { success: false, error: 'Credenciais do Instagram não encontradas. Faça login novamente.' };
    }

    // Recuperar senha do banco se o usuário estiver logado
    let password: string | null = null;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { data, error } = await supabase
          .from('instagram_credentials')
          .select('*')
          .eq('user_id', session.user.id)
          .limit(1) as SupabaseResponse<InstagramCredentialsTable[]>;

        if (!error && data && data.length > 0) {
          const credentials = data[0];
          if (credentials && credentials.encrypted_password) {
            password = decryptPassword(credentials.encrypted_password);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao recuperar senha do banco:', error);
      // Continuar sem a senha, tentando apenas com o nome de usuário
    }

    console.log('Preparando para postar no Instagram com usuário:', username);

    // Simular postagem bem-sucedida (em ambiente de produção, isso seria substituído pela chamada real com username/password recuperados)
    console.log('Simulando postagem no Instagram com:', {
      username,
      videoUrl: videoUrl.substring(0, 30) + '...',
      caption: caption,
      postType: postType,
    });

    console.log('Postagem no Instagram realizada com sucesso (simulação)');
    return {
      success: true,
      postId: 'mock-' + Math.random().toString(36).substring(2, 10),
    };
  } catch (error) {
    console.error('Erro no processo de postagem:', error);
    return { success: false, error: 'Erro inesperado ao postar no Instagram.' };
  }
};

// Função para limpar vídeos após postagem bem-sucedida
export const cleanupVideosAfterPosting = async (videoId: string): Promise<void> => {
  try {
    console.log('Realizando limpeza após postagem bem-sucedida. Video ID:', videoId);

    // Aqui você pode implementar qualquer lógica de limpeza necessária
  } catch (error) {
    console.error('Erro na limpeza após postagem:', error);
  }
};

// Função para remover credenciais do Instagram
export const logoutFromInstagram = async (): Promise<boolean> => {
  try {
    // Remover do localStorage
    localStorage.removeItem('instagram_credentials');

    // Verificar se o usuário está autenticado para remover do banco
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      // Desativar credenciais no banco (não excluir para manter histórico)
      const { error } = await supabase
        .from('instagram_credentials')
        .update({ is_active: false })
        .eq('user_id', session.user.id) as SupabaseResponse<InstagramCredentialsTable>;

      if (error) {
        console.error('Erro ao desativar credenciais no banco:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Erro ao fazer logout do Instagram:', error);
    return false;
  }
};
