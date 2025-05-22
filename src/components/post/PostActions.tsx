import InstagramAPI from '@/api/Instagram';
import InstagramLoginModal from '@/components/search/InstagramLoginModal';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  checkInstagramCredentials, 
  loginWithInstagramOAuth, 
  logoutFromInstagram,
  revokeInstagramOAuth
} from '@/services/instagramService';
import { Calendar, Instagram, Loader2, LogOutIcon, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PostActionsProps {
  isPosting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  postType: string;
  hasCredentials: boolean;
  authError?: string | null;
  isScheduled: boolean;
}

const PostActions = ({
  isPosting,
  onSubmit,
  postType,
  hasCredentials: initialHasCredentials,
  authError: propAuthError,
  isScheduled,
}: PostActionsProps) => {
  const [hasCredentials, setHasCredentials] = useState(initialHasCredentials);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isValidatingAuth, setIsValidatingAuth] = useState(true);
  const [instagramUsername, setInstagramUsername] = useState<string | null>(null);
  const [instagramUsernames, setInstagramUsernames] = useState<string[]>([]);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { toast } = useToast();

  // Forçar a exibição do modal de login ao inicializar o componente se não houver credenciais
  useEffect(() => {
    const checkAndShowLoginModal = async () => {
      setIsValidatingAuth(true);
      try {
        // Verificar credenciais do Instagram
        const { hasCredentials, username, usernames } = await checkInstagramCredentials();

        setHasCredentials(hasCredentials);
        setInstagramUsername(username || null);
        setInstagramUsernames(usernames || []);

        // Se estivermos na página de post-config e não tivermos credenciais, mostrar o modal
        if (window.location.pathname === '/post-config' && !hasCredentials) {
          console.log('Abrindo modal de login automaticamente na página post-config');
          setTimeout(() => {
            setShowLoginModal(true);
          }, 500);
        }
      } catch (error) {
        setHasCredentials(false);
      } finally {
        setIsValidatingAuth(false);
      }
    };

    setTimeout(() => {
      checkAndShowLoginModal();
    }, 3000);
  }, [initialHasCredentials]);

  // Determinar qual texto mostrar com base no tipo de postagem
  const getPostTypeText = () => {
    switch (postType) {
      case 'feed':
        return 'Feed';
      case 'story':
        return 'Story';
      case 'reel':
      default:
        return 'Reels';
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const disconnectInstagramAccount = async (username: string) => {
    try {
      setIsDisconnecting(true);

      // Usar o novo endpoint de revogação OAuth
      const result = await revokeInstagramOAuth(username);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao desconectar Instagram');
      }
      
      // Exibir as contas que foram revogadas
      const revokedAccounts = result.revokedAccounts || [];
      console.log(`Conta(s) ${revokedAccounts.join(', ')} desconectada(s) com sucesso via OAuth`);

      // Atualizar o estado local
      setHasCredentials(false);
      setInstagramUsername(null);
      setInstagramUsernames([]);

      toast({
        title: 'Conta removida',
        description: `Sua conta do Instagram ${username} foi desconectada.`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Erro ao desconectar conta do Instagram:', error);
      
      // Tentar o método antigo como fallback
      try {
        console.log('Tentando método antigo de desconexão como fallback');
        
        // Chamar o endpoint de desconexão usando a API do Instagram (método antigo)
        await InstagramAPI.disconnectInstagram({ username });
        
        // Continuar com o processo local de logout
        await logoutFromInstagram();
        
        // Atualizar o estado local
        setHasCredentials(false);
        setInstagramUsername(null);
        setInstagramUsernames([]);
        
        console.log('Método antigo de desconexão bem-sucedido');
        
        toast({
          title: 'Conta removida',
          description: 'Sua conta do Instagram foi desconectada (usando método alternativo).',
          variant: 'success',
        });
      } catch (fallbackError) {
        console.error('Erro também no método antigo de desconexão:', fallbackError);
        
        toast({
          title: 'Erro ao desconectar',
          description: 'Não foi possível desconectar sua conta do Instagram.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSwitchAccount = async () => {
    if (instagramUsername) {
      await disconnectInstagramAccount(instagramUsername);
    } else {
      // Se não houver username, apenas abrir o modal de login
      setShowLoginModal(true);
    }
  };

  const handleChangeAccount = async (username: string) => {
    if (username === instagramUsername) return;

    // Verificar se é a opção para remover a conta
    if (username === 'remove_account') {
      if (instagramUsername) {
        await disconnectInstagramAccount(instagramUsername);
      }
      return;
    }

    // Verificar se é a opção para adicionar nova conta
    if (username === 'add_new_account') {
      setShowLoginModal(true);
      return;
    }

    setInstagramUsername(username);
    toast({
      title: 'Conta alterada',
      description: `Agora você está usando a conta ${username}`,
      variant: 'success',
    });
  };

  const handleInstagramLogin = async () => {
    try {
      setLoginError(null);
      console.log('Iniciando processo de login com OAuth');

      const result = await loginWithInstagramOAuth();

      if (result.success) {
        setHasCredentials(true);
        
        // Atualizar as informações do Instagram
        const { hasCredentials, username, usernames } = await checkInstagramCredentials();
        
        if (hasCredentials && username) {
        setInstagramUsername(username);
        setInstagramUsernames(usernames || []);
        }

        setShowLoginModal(false);
        toast({
          title: 'Login realizado com sucesso',
          description: 'Sua conta do Instagram foi conectada.',
          variant: 'success',
        });
      } else {
        setLoginError(result.error || 'Não foi possível fazer login no Instagram.');
      }
    } catch (error) {
      setLoginError('Erro de conexão ao serviço do Instagram.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasCredentials && !isValidatingAuth) {
      handleLoginClick();
      return;
    }

    if (isPosting) {
      return;
    }

    try {
      await onSubmit(e);
    } catch (error) {
      toast({
        title: 'Erro ao publicar',
        description: 'Ocorreu um erro ao tentar publicar. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      {hasCredentials && (
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center w-full md:w-auto mb-3 md:mb-0">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 mr-4">
              <Instagram className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
              <span className="text-sm font-medium text-white/80">Conectado como</span>
              <Select value={instagramUsername || ''} onValueChange={handleChangeAccount}>
                <SelectTrigger
                  className="w-full md:w-[200px] h-9 text-sm bg-gradient-to-r from-purple-500/10 to-pink-500/10
                  border border-white/20 rounded-md hover:border-pink-400/50 transition-all duration-200
                  focus:ring-pink-400/30 focus:border-pink-400/50 focus:ring-2 focus:ring-offset-0"
                >
                  <SelectValue placeholder="Selecione uma conta" className="font-medium" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900/95 border border-white/20 rounded-md shadow-xl backdrop-blur-sm">
                  <div className="p-1">
                    {instagramUsernames.map((username) => (
                      <SelectItem
                        key={username}
                        value={username}
                        className="flex items-center text-sm rounded-sm transition-colors hover:bg-pink-500/20 focus:bg-pink-500/20 focus:text-white p-2"
                      >
                        <div className="flex items-center">
                          <Instagram className="h-3.5 w-3.5 mr-2 text-pink-400" />
                          {username}
                        </div>
                      </SelectItem>
                    ))}
                  </div>

                  <div className="h-px bg-white/10 mx-1 my-1" />

                  <div className="p-1">
                    <SelectItem
                      value="add_new_account"
                      className="flex items-center text-sm rounded-sm transition-colors hover:bg-green-500/20 focus:bg-green-500/20 focus:text-white p-2"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5 mr-2 text-green-400"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Adicionar nova conta
                      </div>
                    </SelectItem>
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!instagramUsernames.length && (
              <Button
                onClick={handleSwitchAccount}
                variant="ghost"
                size="sm"
                className="text-xs flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Adicionar conta
              </Button>
            )}

            <Button
              onClick={() => instagramUsername && disconnectInstagramAccount(instagramUsername)}
              variant="ghost"
              size="sm"
              disabled={isDisconnecting}
              className="text-xs flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-white/20 rounded-md"
            >
              {isDisconnecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOutIcon className="h-3.5 w-3.5" />}
              {isDisconnecting ? 'Desconectando...' : 'Desconectar conta'}
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="mt-4">
        <Button
          type="submit"
          disabled={isPosting || isValidatingAuth}
          className={`w-full h-[70px] rounded-xl shadow-lg text-white font-medium text-base ${
            hasCredentials && !isValidatingAuth
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 shadow-[0_0_15px_rgba(124,58,237,0.5)]'
              : 'bg-gradient-to-r from-indigo-400/70 to-purple-500/70 hover:from-indigo-500 hover:to-purple-600'
          } transition-all duration-300 px-8`}
        >
          {isValidatingAuth ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Verificando...
            </>
          ) : isPosting ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              {isScheduled ? 'Agendando postagem...' : `Publicando no Instagram ${getPostTypeText()}...`}
            </>
          ) : (
            <>
              {isScheduled ? <Calendar className="mr-3 h-5 w-5" /> : <Instagram className="mr-3 h-6 w-6" />}
              <span className="font-semibold">
              {hasCredentials
                ? isScheduled
                  ? `Agendar para o Instagram ${getPostTypeText()}`
                  : `Publicar no Instagram ${getPostTypeText()}`
                : 'Fazer login no Instagram para publicar'}
              </span>
            </>
          )}
        </Button>

        {!hasCredentials && loginError && !isValidatingAuth && (
          <p className="text-center text-red-400 mt-3 text-sm">{loginError}</p>
        )}
      </form>

      <InstagramLoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onLogin={handleInstagramLogin}
        errorMessage={loginError}
      />
    </>
  );
};

export default PostActions;
