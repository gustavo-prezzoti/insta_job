import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, RefreshCw, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import InstagramAPI from '@/api/Instagram';
import { Button } from '@/components/ui/button';

// Define error type for better TypeScript support
interface ApiError {
  response?: {
    data?: {
      detail?: string;
      message?: string;
      accounts?: Array<{id: number, username: string}>;
      status?: string;
    };
    status?: number;
  };
  message?: string;
}

// Helper to generate a unique callback ID
const generateCallbackId = (): string => {
  return `cb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Store used auth codes to prevent reuse
const storeUsedAuthCode = (code: string): void => {
  try {
    // Get existing used codes
    const existingCodesJson = sessionStorage.getItem('instagram_used_auth_codes') || '[]';
    const existingCodes = JSON.parse(existingCodesJson) as string[];
    
    // Add new code if not already in list
    if (!existingCodes.includes(code)) {
      existingCodes.push(code);
      // Keep only last 10 codes to prevent storage bloat
      const recentCodes = existingCodes.slice(-10);
      sessionStorage.setItem('instagram_used_auth_codes', JSON.stringify(recentCodes));
    }
  } catch (e) {
    console.error('Error storing used auth code:', e);
  }
};

// Check if an auth code has been used before
const isAuthCodeUsed = (code: string): boolean => {
  try {
    const existingCodesJson = sessionStorage.getItem('instagram_used_auth_codes') || '[]';
    const existingCodes = JSON.parse(existingCodesJson) as string[];
    return existingCodes.includes(code);
  } catch (e) {
    console.error('Error checking used auth code:', e);
    return false;
  }
};

// Global flag to track if any instance is currently processing
const CALLBACK_PROCESSING_KEY = 'instagram_callback_processing';
const CALLBACK_TIMESTAMP_KEY = 'instagram_callback_timestamp';
const CALLBACK_ID_KEY = 'instagram_callback_id';

const InstagramOAuthCallback = () => {
  // State for the regular callback flow
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'duplicate'>('loading');
  const [message, setMessage] = useState('Verificando autenticação...');
  const [accounts, setAccounts] = useState<{id: number, username: string}[]>([]);
  const [errorDetail, setErrorDetail] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [callbackId, setCallbackId] = useState<string>('');
  const [processingCallbackId, setProcessingCallbackId] = useState<string>('');
  const hasProcessedCode = useRef(false); // Ref to track if we've already processed the code
  const currentCode = useRef<string | null>(null); // Keep track of the current code
  const navigate = useNavigate();

  // Check if another callback is already processing
  useEffect(() => {
    const checkForDuplicateCallback = () => {
      // Sempre limpe flags antigas antes de iniciar
      localStorage.removeItem(CALLBACK_PROCESSING_KEY);
      localStorage.removeItem(CALLBACK_TIMESTAMP_KEY);
      localStorage.removeItem(CALLBACK_ID_KEY);
      // Generate a unique ID for this callback instance
      const newCallbackId = generateCallbackId();
      setCallbackId(newCallbackId);
      
      // Check if another callback is already processing
      const existingProcessing = localStorage.getItem(CALLBACK_PROCESSING_KEY);
      const existingTimestamp = localStorage.getItem(CALLBACK_TIMESTAMP_KEY);
      const existingCallbackId = localStorage.getItem(CALLBACK_ID_KEY);
      
      // If processing flag exists, check if it's stale (older than 30 segundos)
      if (existingProcessing === 'true' && existingTimestamp) {
        const now = Date.now();
        const timestamp = parseInt(existingTimestamp, 10);
        
        if (now - timestamp < 30 * 1000) { // 30 segundos
          // Another callback is actively processing
          console.log('Another callback is already processing', existingCallbackId);
          setIsDuplicate(true);
          setProcessingCallbackId(existingCallbackId || '');
          setStatus('duplicate');
          setMessage('Autenticação em andamento');
          setErrorDetail('Já existe um processo de autenticação em andamento. Aguarde a conclusão ou feche esta janela.');
          return true;
        } else {
          // Stale processing flag, clear it
          console.log('Found stale callback processing flag, clearing it');
          localStorage.removeItem(CALLBACK_PROCESSING_KEY);
          localStorage.removeItem(CALLBACK_TIMESTAMP_KEY);
          localStorage.removeItem(CALLBACK_ID_KEY);
        }
      }
      
      // Set this instance as the active processor
      localStorage.setItem(CALLBACK_PROCESSING_KEY, 'true');
      localStorage.setItem(CALLBACK_TIMESTAMP_KEY, Date.now().toString());
      localStorage.setItem(CALLBACK_ID_KEY, newCallbackId);
      
      return false;
    };
    
    // Stop if this instance is a duplicate
    const isDuplicate = checkForDuplicateCallback();
    if (isDuplicate) {
      return;
    }
    
    // Check for code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    currentCode.current = code;
    
    // If code is already used, skip processing
    if (code && isAuthCodeUsed(code)) {
      console.log('Auth code has already been used:', code);
      setStatus('success');
      setMessage('Instagram conectado com sucesso! (código reutilizado)');
      
      // Update local storage to indicate Instagram is connected
      localStorage.setItem('instagram_connected', 'true');
      localStorage.setItem('instagram_auth_successful', 'true');
      
      // Send success message
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ 
          type: 'INSTAGRAM_AUTH_SUCCESS',
          authSuccessful: true,
          reusedCode: true
        }, window.location.origin);
      }
      
      // Auto-close this window
      setTimeout(() => {
        closeWindow();
      }, 2000);
      
      return;
    }
    
    // Otherwise, proceed with normal flow
    // The rest of the initialization logic will happen in the other useEffect
  }, []);

  // Function to close window with multiple fallbacks
  const closeWindow = () => {
    console.log('Attempting to close OAuth window');
    
    // Clear callback processing flags before closing
    if (callbackId && localStorage.getItem(CALLBACK_ID_KEY) === callbackId) {
      localStorage.removeItem(CALLBACK_PROCESSING_KEY);
      localStorage.removeItem(CALLBACK_TIMESTAMP_KEY);
      localStorage.removeItem(CALLBACK_ID_KEY);
    }
    
    try {
      // Send one final success message to parent
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ 
          type: 'INSTAGRAM_AUTH_SUCCESS',
          accounts: accounts,
          authSuccessful: true,
          finalClose: true // Signal this is the final close attempt
        }, window.location.origin);
      }
      
      // Try different approaches to close the window
      window.close();
      
      // If window.close() doesn't work (some browsers block it),
      // try redirecting to a special close page
      setTimeout(() => {
        // If we're still here after 100ms, window.close() didn't work
        window.location.href = 'about:blank';
        
        // Final fallback - if we're STILL here, try one more close
        setTimeout(() => {
          window.close();
        }, 100);
      }, 100);
    } catch (e) {
      console.error('Error closing window:', e);
    }
  };

  // Handle parent window communication and auto-close
  useEffect(() => {
    if (status === 'success') {
      // Tell the opener (parent) window to refresh
      if (window.opener && !window.opener.closed) {
        // Send message to parent window
        console.log('Sending success message to parent window');
        window.opener.postMessage({ 
          type: 'INSTAGRAM_AUTH_SUCCESS',
          accounts: accounts, // Send accounts data to parent window
          authSuccessful: true // Add explicit flag for successful auth
        }, window.location.origin);
        
        // Start countdown for auto-close
        const intervalId = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(intervalId);
              closeWindow();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        // Attempt to close window after 6 seconds regardless of countdown
        const forceCloseTimeout = setTimeout(() => {
          closeWindow();
        }, 6000);
        
        return () => {
          clearInterval(intervalId);
          clearTimeout(forceCloseTimeout);
        };
      }
    } else if (status === 'error') {
      // Also notify parent of error
      if (window.opener && !window.opener.closed) {
        console.log('Sending error message to parent window');
        window.opener.postMessage({ 
          type: 'INSTAGRAM_AUTH_ERROR', 
          error: errorDetail || 'Erro desconhecido'
        }, window.location.origin);
      }
    }
  }, [status, errorDetail, accounts]);

  // Only proceed with OAuth flow if not a duplicate
  useEffect(() => {
    // Skip if this is a duplicate callback
    if (isDuplicate || status === 'duplicate' || hasProcessedCode.current) {
      return;
    }
    
    // Clear authentication in progress flag when component mounts
    localStorage.removeItem('instagram_auth_in_progress');
    localStorage.removeItem('instagram_auth_timestamp');
    
    const completeOAuth = async () => {
      try {
        console.log('Instagram OAuth Callback - Iniciando processo de autenticação');
      
        // Extract temp_code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) {
          console.error('Código de autorização não encontrado na URL');
          setStatus('error');
          setMessage('Código de autorização não encontrado na URL');
          setErrorDetail('Verifique se você foi redirecionado corretamente do Instagram');
          return;
        }

        // Mark this as already processed to prevent loops
        hasProcessedCode.current = true;
        
        console.log('Código de autorização extraído da URL');
        setMessage('Conectando ao Instagram...');

        // Get JWT token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token JWT não encontrado');
          setStatus('error');
          setMessage('Token de autenticação não encontrado');
          setErrorDetail('Por favor, faça login novamente');
          
          // Redirect to login after a delay
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
          return;
        }

        // Call the backend to complete OAuth using the service
        try {
          console.log('Chamando API para completar autenticação OAuth');
          const response = await InstagramAPI.completeOAuthFlow(code);
          
          console.log('Resposta da API recebida:', response.status);
          const data = response.data;
          
          // Mark this code as used
          storeUsedAuthCode(code);
          
          // Update localStorage to indicate Instagram is connected
          localStorage.setItem('instagram_connected', 'true');
          // Explicit flag to prevent modal from reopening
          localStorage.setItem('instagram_auth_successful', 'true');
          console.log('Instagram conectado com sucesso, localStorage atualizado');
          
          setStatus('success');
          setMessage(data.message || 'Instagram conectado com sucesso!');
          setAccounts(data.accounts || []);
          
          toast.success('Conta do Instagram conectada com sucesso!');
          
          // Try closing after a short delay to allow states to update
          setTimeout(() => {
            if (status === 'success') {
              closeWindow();
            }
          }, 1000);
        } catch (apiError: unknown) {
          console.error('Erro na API durante autenticação OAuth:', apiError);

          // Check if we still have a success response but with error formatting
          const error = apiError as ApiError;
          console.log('Estrutura do erro:', JSON.stringify(error?.response?.data || {}, null, 2));
          
          // Check for 400 error that might be due to code reuse
          if (error?.response?.status === 400) {
            // Mark this code as used to prevent future attempts
            storeUsedAuthCode(code);
            
            // Check if it's a code reuse issue (token already used)
            if (error?.message?.includes('code has been used') || 
                error?.response?.data?.detail?.includes('token')) {
              
              // This could still be a success case if we've already connected in a previous attempt
              const checkConnected = await InstagramAPI.checkInstagramCredentials();
              if (checkConnected.status === 200 && checkConnected.data?.has_credentials) {
                console.log('Verificação de credenciais bem-sucedida após erro de código reutilizado');
                localStorage.setItem('instagram_connected', 'true');
                localStorage.setItem('instagram_auth_successful', 'true');
                
                setStatus('success');
                setMessage('Instagram conectado com sucesso!');
                setAccounts(checkConnected.data.accounts || []);
                
                toast.success('Conta do Instagram conectada com sucesso!');
                setTimeout(() => closeWindow(), 1000);
                return;
              }
            }
          }
          
          // Some APIs return an error structure but actually succeeded
          if (error?.response?.data?.accounts || 
              (error?.response?.data?.message && error.response?.data?.message.includes('success'))) {
            
            console.log('Erro contém resposta de sucesso, tratando como sucesso');
            // Treat as success despite error structure
            localStorage.setItem('instagram_connected', 'true');
            // Explicit flag to prevent modal from reopening
            localStorage.setItem('instagram_auth_successful', 'true');
            
            // Mark this code as used
            storeUsedAuthCode(code);
            
            setStatus('success');
            setMessage('Instagram conectado com sucesso!');
            
            // Try to extract accounts if available
            const accounts = error?.response?.data?.accounts || [];
            setAccounts(accounts);
            
            toast.success('Conta do Instagram conectada com sucesso!');
            
            // Try closing after a short delay
            setTimeout(() => {
              closeWindow();
            }, 1000);
          } else {
            // Real error
            console.error('Erro real na conexão com Instagram');
            setStatus('error');
            setMessage('Erro ao conectar com o Instagram');
            setErrorDetail(
              (error?.response?.data?.detail || error?.message || 'Ocorreu um erro na autenticação')
            );
            
            toast.error('Falha ao conectar Instagram');
          }
        }
      } catch (error) {
        const err = error as Error;
        console.error('Erro na autenticação OAuth:', error);
        setStatus('error');
        setMessage('Erro ao processar a autenticação');
        setErrorDetail(err?.message || 'Erro desconhecido');
        
        toast.error('Erro de conexão');
      }
    };

    completeOAuth();
    
    // Add event listener for beforeunload to ensure parent window gets notified
    const handleBeforeUnload = () => {
      if (status === 'success' && window.opener && !window.opener.closed) {
        window.opener.postMessage({ 
          type: 'INSTAGRAM_AUTH_SUCCESS',
          accounts: accounts,
          authSuccessful: true
        }, window.location.origin);
      }
      
      // Clean up callback processing flag on unload
      if (callbackId && localStorage.getItem(CALLBACK_ID_KEY) === callbackId) {
        localStorage.removeItem(CALLBACK_PROCESSING_KEY);
        localStorage.removeItem(CALLBACK_TIMESTAMP_KEY);
        localStorage.removeItem(CALLBACK_ID_KEY);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Cleanup processing flags when component unmounts
      if (callbackId && localStorage.getItem(CALLBACK_ID_KEY) === callbackId) {
        localStorage.removeItem(CALLBACK_PROCESSING_KEY);
        localStorage.removeItem(CALLBACK_TIMESTAMP_KEY);
        localStorage.removeItem(CALLBACK_ID_KEY);
      }
    };
  }, [navigate, status, isDuplicate, callbackId, accounts]);

  // Force this callback to take over processing (useful if previous callback stalled)
  const forceProcessThisCallback = () => {
    // Set this instance as the active processor
    localStorage.setItem(CALLBACK_PROCESSING_KEY, 'true');
    localStorage.setItem(CALLBACK_TIMESTAMP_KEY, Date.now().toString());
    localStorage.setItem(CALLBACK_ID_KEY, callbackId);
    
    setIsDuplicate(false);
    setStatus('loading');
    setMessage('Verificando autenticação...');
    
    // Reset the hasProcessed flag
    hasProcessedCode.current = false;
    
    // Reload the page to restart the flow
    window.location.reload();
  };

  const handleManualClose = () => {
    // Tell the opener to refresh before closing
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ 
        type: status === 'success' ? 'INSTAGRAM_AUTH_SUCCESS' : 'INSTAGRAM_AUTH_ERROR',
        authSuccessful: status === 'success',
        accounts: accounts
      }, window.location.origin);
      
      // Use the robust close method
      closeWindow();
    } else {
      // If no opener, just redirect
      navigate('/search', { replace: true });
    }
  };

  // Redireciona para /post-config após sucesso e salva contas no localStorage
  useEffect(() => {
    if (status === 'success' && accounts.length > 0) {
      localStorage.setItem('instagram_accounts', JSON.stringify(accounts));
      // Redireciona imediatamente para /post-config
      navigate('/post-config', { replace: true });
    }
  }, [status, accounts, navigate]);

  return (
    <div className="min-h-screen bg-viral-blue-dark flex flex-col items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          {status === 'loading' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 flex flex-col items-center"
            >
              <Loader2 className="h-12 w-12 text-indigo-400 animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-white">{message}</h2>
              <p className="text-white/60 mt-2">Por favor, aguarde enquanto processamos sua autenticação...</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 flex flex-col items-center"
            >
              <div className="bg-green-500/20 p-3 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-white">{message}</h2>
              
              {accounts && accounts.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 bg-white/5 rounded-lg p-3 w-full"
                >
                  <p className="text-white/80 text-sm font-medium mb-2">Contas conectadas:</p>
                  <ul className="space-y-2">
                    {accounts.map(account => (
                      <li key={account.id} className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-2">
                          <span className="text-xs font-bold text-white">{account.username.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-white">{account.username}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              
              <div className="mt-6 border border-green-500/20 bg-green-500/10 rounded-lg px-4 py-3 text-white/80 flex items-center">
                <RefreshCw className="h-4 w-4 text-green-400 mr-2 animate-spin" />
                <span>Fechando a janela em <span className="text-white font-bold">{countdown}</span>s</span>
              </div>
              
              <Button 
                onClick={handleManualClose}
                className="mt-4 bg-white/10 hover:bg-white/20 text-white"
              >
                Fechar agora
              </Button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 flex flex-col items-center"
            >
              <div className="bg-red-500/20 p-3 rounded-full mb-4">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-white">{message}</h2>
              <p className="text-white/60 mt-2 text-center">{errorDetail}</p>

              <Button 
                onClick={handleManualClose}
                className="mt-6 bg-white/10 hover:bg-white/20 text-white"
              >
                Fechar
              </Button>
            </motion.div>
          )}

          {status === 'duplicate' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 flex flex-col items-center"
            >
              <div className="bg-amber-500/20 p-3 rounded-full mb-4">
                <AlertOctagon className="h-12 w-12 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold text-white">Autenticação em andamento</h2>
              <p className="text-white/70 mt-2 text-center">
                Outra janela de autenticação já está processando sua solicitação.
                Por favor, aguarde ou feche esta janela.
              </p>
              <p className="text-xs text-white/40 mt-2">
                ID do processo atual: {processingCallbackId.substring(0, 12)}...
              </p>

              <div className="flex flex-col gap-2 mt-6 w-full">
                <Button 
                  onClick={handleManualClose}
                  className="w-full bg-white/10 hover:bg-white/20 text-white"
                >
                  Fechar esta janela
                </Button>
                
                <Button 
                  onClick={forceProcessThisCallback}
                  variant="destructive" 
                  className="w-full mt-2"
                >
                  Forçar esta janela a processar
                </Button>
                <p className="text-xs text-white/40 mt-1 text-center">
                  Use esta opção apenas se a outra janela estiver travada.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InstagramOAuthCallback; 