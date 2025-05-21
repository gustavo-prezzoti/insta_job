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
    
    // Obter o token JWT - tentando de múltiplas fontes
    let jwtToken = null;
    
    // 1. Tentar obter do Supabase primeiro (se estiver usando)
    try {
      const { data: { session } } = await supabase.auth.getSession();
      jwtToken = session?.access_token;
    } catch (e) {
      console.log('Não foi possível obter token do Supabase:', e);
    }
    
    // 2. Se não conseguiu do Supabase, tentar do localStorage
    if (!jwtToken) {
      jwtToken = localStorage.getItem('token');
      console.log('Usando token do localStorage');
    }
    
    if (!jwtToken) {
      console.error('Token JWT não encontrado em nenhuma fonte');
      return { success: false, error: 'Você precisa estar logado para conectar ao Instagram. Faça login novamente.' };
    }
    
    // Definir URL de redirecionamento
    const redirectUri = window.location.origin + '/instagram/oauth/callback';
    console.log('URL de redirecionamento:', redirectUri);
    
    // Chamar a API para obter a URL de autenticação
    try {
      console.log('Enviando requisição para obter URL de autenticação com token JWT');
      
      // Configurar o token nos headers globais
      API.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
      API.defaults.headers.common['jwt-token'] = jwtToken;
      
      const response = await InstagramAPI.connectInstagramOAuth(redirectUri);
      
      console.log('Resposta da API:', response.status, response.data);
      
      if (response.status !== 200 || !response.data.auth_url) {
        console.error('Erro ao obter URL de autenticação:', response.data);
        return { success: false, error: response.data.message || 'Erro ao iniciar autenticação com Instagram' };
      }
      
      const authUrl = response.data.auth_url;
      console.log('URL de autenticação obtida:', authUrl.substring(0, 50) + '...');
      
      // Abrir janela de autenticação do Instagram
      const authWindow = window.open(authUrl, 'instagram-oauth', 'width=600,height=700');
      
      if (!authWindow) {
        return { success: false, error: 'Não foi possível abrir a janela de autenticação. Verifique se o bloqueador de pop-ups está desativado.' };
      }
      
      console.log('Janela de autenticação aberta, aguardando conclusão...');
      
      // Criar Promise para aguardar o retorno da autenticação
      return new Promise((resolve) => {
        // Função para capturar e tratar erros específicos do Facebook/Instagram
        const handleFacebookError = (errorWindow: Window, errorData: any) => {
          try {
            console.error('Erro Facebook OAuth:', errorData);
            
            // Verificar se é o erro 101 (erro de validação da aplicação)
            if (errorData?.error?.code === 101) {
              errorWindow.close();
              resolve({ 
                success: false, 
                error: `Erro de configuração da aplicação no Facebook Developers Portal (Código: 101). 
                \n\nPara resolver este problema:
                \n1. Verifique se o App ID e App Secret estão corretos no backend
                \n2. Confirme se a aplicação está corretamente configurada para Instagram Basic Display API
                \n3. Verifique se o redirect_uri (${redirectUri}) está configurado como URL válida de redirecionamento
                \n4. Se sua aplicação estiver em modo de desenvolvimento, adicione os usuários de teste necessários
                \n5. Certifique-se de que a aplicação está ativa e não em processo de revisão` 
              });
              return true;
            }
            
            // Outros erros conhecidos podem ser tratados aqui
            
            return false;
          } catch (e) {
            console.error('Erro ao processar erro do Facebook:', e);
            return false;
          }
        };
        
        // Função para verificar se a autenticação foi concluída
        const checkAuth = async () => {
          try {
            // Verificar se a janela foi fechada
            if (authWindow.closed) {
              console.log('Janela de autenticação foi fechada pelo usuário');
              
              // Tentar verificar se temos credenciais mesmo assim
              try {
                const checkResponse = await InstagramAPI.checkInstagramCredentials();
                if (checkResponse.data?.has_credentials) {
                  console.log('Autenticação concluída com sucesso após fechamento da janela!');
                  resolve({ success: true });
                  return;
                }
              } catch {}
              
              resolve({ success: false, error: 'Autenticação cancelada pelo usuário' });
              return;
            }
            
            // Tentar capturar erros na URL ou no conteúdo da página
            try {
              const currentUrl = authWindow.location.href;
              
              // Se retornou para nossa URL de callback, verificar se a autenticação foi bem-sucedida
              if (currentUrl.startsWith(redirectUri) || currentUrl.includes('callback')) {
                console.log('Redirecionado para callback, verificando credenciais...');
                
                // Esperar um pouco para o backend processar
                setTimeout(async () => {
                  try {
                    const checkResponse = await InstagramAPI.checkInstagramCredentials();
                    if (checkResponse.data?.has_credentials) {
                      console.log('Autenticação concluída com sucesso!');
                      authWindow.close();
                      resolve({ success: true });
                      return;
                    } else {
                      // Se chegou no callback mas não temos credenciais, pode ter ocorrido um erro
                      const pageContent = authWindow.document.body.innerText;
                      
                      // Tentar encontrar mensagens de erro no conteúdo da página
                      try {
                        if (pageContent.includes('error') || pageContent.includes('Error')) {
                          const errorData = JSON.parse(pageContent);
                          if (handleFacebookError(authWindow, errorData)) {
                            return;
                          }
                        }
                      } catch {}
                      
                      // Se ainda estamos aqui, continuar verificando
                      setTimeout(checkAuth, 2000);
                    }
                  } catch (error) {
                    console.error('Erro ao verificar credenciais após callback:', error);
                    setTimeout(checkAuth, 2000);
                  }
                }, 3000);
                return;
              }
              
              // Tentar capturar erros diretos da página
              try {
                const pageContent = authWindow.document.body.innerText;
                if (pageContent.includes('error') && pageContent.includes('code')) {
                  try {
                    const errorData = JSON.parse(pageContent);
                    if (handleFacebookError(authWindow, errorData)) {
                      return;
                    }
                  } catch {}
                }
              } catch {}
            } catch {}
            
            // Verificar credenciais normalmente
            console.log('Verificando se a autenticação foi concluída...');
            const checkResponse = await InstagramAPI.checkInstagramCredentials();
            
            console.log('Resposta da verificação:', checkResponse.data);
            
            if (checkResponse.data?.has_credentials) {
              console.log('Autenticação concluída com sucesso!');
              authWindow.close();
              resolve({ success: true });
              return;
            }
            
            // Continuar verificando a cada 2 segundos
            setTimeout(checkAuth, 2000);
          } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            setTimeout(checkAuth, 2000);
          }
        };
        
        // Iniciar verificação após 2 segundos
        setTimeout(checkAuth, 2000);
      });
    } catch (error) {
      console.error('Erro ao conectar ao Instagram:', error);
      
      // Verificar se o erro é do Facebook OAuth
      const fbError = error?.response?.data?.error;
      if (fbError?.code === 101) {
        return { 
          success: false, 
          error: `Erro de configuração da aplicação no Facebook (Código: 101). Verifique o App ID, App Secret e configurações de redirecionamento.` 
        };
      }
      
      return { success: false, error: 'Falha ao iniciar autenticação com Instagram' };
    }
  } catch (error) {
    console.error('Erro no processo de autenticação OAuth:', error);
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
