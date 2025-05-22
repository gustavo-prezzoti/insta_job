import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { loginWithInstagramOAuth } from '@/services/instagramService';
import { Instagram, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InstagramAPI from '@/api/Instagram';

// Function to check and clear stale authentication flags
const clearStaleAuthFlags = (): void => {
  const authInProgress = localStorage.getItem('instagram_auth_in_progress');
  const authTimestamp = localStorage.getItem('instagram_auth_timestamp');
  
  if (authInProgress) {
    // If timestamp exists, check if stale
    if (authTimestamp) {
      const now = Date.now();
      const timestamp = parseInt(authTimestamp, 10);
      
      // Flag is stale if older than 2 minutes or invalid
      if (isNaN(timestamp) || now - timestamp > 2 * 60 * 1000) {
        console.log('Clearing stale authentication flag (timestamp check)');
        localStorage.removeItem('instagram_auth_in_progress');
        localStorage.removeItem('instagram_auth_timestamp');
      }
    } else {
      // No timestamp, so flag is stale
      console.log('Clearing stale authentication flag (no timestamp)');
      localStorage.removeItem('instagram_auth_in_progress');
    }
  }
};

interface InstagramLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => Promise<void>;
  errorMessage?: string | null;
}

const InstagramLoginModal = ({
  open,
  onOpenChange,
  onLogin,
  errorMessage: propErrorMessage,
}: InstagramLoginModalProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authSuccessful, setAuthSuccessful] = useState(false); // Track authentication success
  const [successAccounts, setSuccessAccounts] = useState<any[]>([]);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [authState, setAuthState] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // When modal opens, clear stale flags
  useEffect(() => {
    if (open) {
      clearStaleAuthFlags();
      setAuthSuccessful(false); // Reset auth success flag when modal opens
      setAuthState('idle');
      setRedirectCountdown(5);
    }
  }, [open]);

  // Listen for messages from the OAuth callback window
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Verify origin to prevent XSS attacks
      if (event.origin !== window.location.origin) return;
      
      console.log('InstagramLoginModal received message:', event.data);
      
      // Check if this is our OAuth success message
      if (event.data?.type === 'INSTAGRAM_AUTH_SUCCESS') {
        console.log('Received authentication success message');
        
        // Extract account information if available
        const accounts = event.data.accounts || [];
        setSuccessAccounts(accounts);
        
        const accountNames = accounts.map((acc: {username: string}) => acc.username).join(', ');
        const accountMessage = accountNames ? `Conta conectada: ${accountNames}` : 'Conta conectada com sucesso';
        
        // Show success message
        toast({
          title: 'Conectado ao Instagram',
          description: accountMessage,
          variant: 'success',
        });
        
        // Update local state to reflect connection
        localStorage.setItem('instagram_connected', 'true');
        
        // Mark authentication as successful to prevent modal from reopening
        setAuthSuccessful(true);
        
        // Change modal state to success
        setAuthState('success');
        
        // Start countdown for auto-redirection
        startRedirectCountdown();
        
        // Call the login handler
        await onLogin();
        setLoginError(null);
      }
      // Handle error message from popup
      else if (event.data?.type === 'INSTAGRAM_AUTH_ERROR') {
        console.log('Received authentication error message:', event.data.error);
        
        setLoginError(event.data.error || 'Erro ao conectar com Instagram');
        setAuthState('error');
        
        toast({
          title: 'Erro ao conectar',
          description: event.data.error || 'Ocorreu um erro ao conectar ao Instagram.',
          variant: 'destructive',
        });
      }
    };
    
    // Add the message event listener
    window.addEventListener('message', handleMessage);
    
    // Clean up
    return () => window.removeEventListener('message', handleMessage);
  }, [onLogin, toast]);

  // Start countdown for redirection after successful authentication
  const startRedirectCountdown = () => {
    const countdownInterval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Redirect to post config
          navigate('/post-config');
          // Close modal
          onOpenChange(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Return cleanup function
    return () => clearInterval(countdownInterval);
  };

  // Atualizar o erro interno se receber um novo erro como prop
  useEffect(() => {
    if (propErrorMessage) {
      setLoginError(propErrorMessage);
    }
  }, [propErrorMessage, open]);

  // Limpar erros e campos quando o modal é fechado
  useEffect(() => {
    if (!open) {
      setLoginError(null);
      setAgreeToTerms(false);
    }
  }, [open]);

  useEffect(() => {
    if (user?.sessions?.length > 0) {
      onOpenChange(false);
    }
  }, [user?.sessions, onOpenChange]);

  const handleInstagramLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    setAuthState('connecting');

    if (!agreeToTerms) {
      setLoginError('Você precisa concordar com os termos e condições para continuar.');
      setAuthState('error');
      return;
    }

    // Verificar se o token JWT está disponível
    const token = localStorage.getItem('token');
    if (!token) {
      setLoginError('Você precisa estar logado para conectar sua conta do Instagram. Faça login novamente.');
      setAuthState('error');
        toast({
        title: 'Erro de autenticação',
        description: 'Sua sessão expirou. Por favor, faça login novamente.',
          variant: 'destructive',
        });
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      return;
    }
    clearStaleAuthFlags();
    if (localStorage.getItem('instagram_auth_in_progress') === 'true') {
      toast({
        title: 'Autenticação em andamento',
        description: 'Já existe um processo de autenticação em andamento. Por favor, conclua ou cancele antes de tentar novamente.',
        variant: 'destructive',
      });
      setAuthState('error');
      return;
    }
    setIsConnecting(true);
    try {
      const response = await InstagramAPI.getInstagramAuthUrl();
      if (response.status !== 200 || !response.data.auth_url) {
        setLoginError(response.data.message || 'Erro ao obter URL de autenticação');
        setAuthState('error');
        setIsConnecting(false);
        return;
      }
      // Redireciona a página inteira para o OAuth
      window.location.href = response.data.auth_url;
    } catch (error) {
      setLoginError('Erro ao buscar URL de autenticação');
      setAuthState('error');
      setIsConnecting(false);
    }
  };

  // Handle direct navigation to post config page
  const handleContinueToPost = () => {
    navigate('/post-config');
    onOpenChange(false);
  };

  const renderModalContent = () => {
    if (authState === 'success') {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="bg-green-500/20 p-4 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          
          <h3 className="text-xl font-medium text-white mb-3">Conectado ao Instagram!</h3>
          <p className="text-white/70">Sua conta foi conectada com sucesso.</p>
          
          {successAccounts && successAccounts.length > 0 && (
            <div className="mt-4 bg-white/5 rounded-lg p-3 w-full">
              <p className="text-white/80 text-sm font-medium mb-2">Contas conectadas:</p>
              <ul className="space-y-2">
                {successAccounts.map((account) => (
                  <li key={account.id} className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold text-white">{account.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-white">{account.username}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-6 border border-green-500/20 bg-green-500/10 rounded-lg px-4 py-3 text-white/80 flex items-center">
            <RefreshCw className="h-4 w-4 text-green-400 mr-2 animate-spin" />
            <span>Redirecionando para configurar postagem em <span className="text-white font-bold">{redirectCountdown}</span>s</span>
          </div>
          
          <Button 
            onClick={handleContinueToPost}
            className="w-full mt-5 bg-green-500/20 hover:bg-green-500/30 text-white"
          >
            Continuar agora
          </Button>
        </motion.div>
      );
    }
    
    // Default content (error or initial state)
  return (
      <>
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 justify-center">
            <Instagram className="h-6 w-6" />
            <span>Conectar ao Instagram</span>
          </DialogTitle>
          <DialogDescription className="text-white/70 text-center">
            Conecte sua conta para postar conteúdo automaticamente
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center my-4">
          <div className="relative w-24 h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
            <Instagram className="h-12 w-12 text-white" />
          </div>
        </div>

        <div className="space-y-4 text-center px-4">
          <h3 className="text-xl font-medium text-white">Publique sem esforço no Instagram</h3>
          <p className="text-white/70 text-sm">
            Ao conectar sua conta do Instagram, você poderá publicar vídeos diretamente no seu feed, stories ou reels sem precisar baixar os arquivos.
          </p>
        </div>

        {((loginError) && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3 text-sm">
            {loginError}
          </div>
        ))}

        {((isConnecting) && (
          <div className="flex items-center justify-center mt-4">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Conectando ao Instagram...</span>
          </div>
        ))}

        <form onSubmit={handleInstagramLogin} className="space-y-4 mt-4">
          <div className="flex items-start space-x-2 justify-center">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-white/70 text-left">
              Li e concordo com os{' '}
              <a href="#" className="text-viral-accent-pink hover:underline">
                termos e condições
              </a>{' '}
              do aplicativo
            </label>
          </div>

          <div className="pt-2">
          <Button
            type="submit"
            className="w-full py-6 font-medium text-base bg-gradient-to-r from-pink-500 to-viral-accent-purple hover:opacity-90 text-white shadow-lg"
            disabled={isConnecting || authState === 'connecting'}
          >
            {authState === 'connecting' || isConnecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <Instagram className="mr-2 h-5 w-5" />
                Conectar com Instagram
              </>
            )}
          </Button>
          </div>
        </form>

        <div className="mt-2 text-xs text-center text-white/50">
          Você será redirecionado para o site oficial do Instagram para autorizar o acesso
        </div>
      </>
    );
  };

  return (
    <Dialog open={open && !authSuccessful} onOpenChange={(newOpen) => {
      // Prevent reopening if we've successfully authenticated
      if (newOpen && authSuccessful) {
        return;
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="bg-viral-blue-dark border-white/10 text-white max-w-md">
        {renderModalContent()}
      </DialogContent>
    </Dialog>
  );
};

export default InstagramLoginModal;
