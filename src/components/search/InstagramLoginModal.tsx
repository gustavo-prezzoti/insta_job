import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { loginWithInstagramOAuth } from '@/services/instagramService';
import { Instagram, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const { user } = useAuth();
  const { toast } = useToast();

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

    if (!agreeToTerms) {
      setLoginError('Você precisa concordar com os termos e condições para continuar.');
      return;
    }

    // Verificar se o token JWT está disponível
    const token = localStorage.getItem('token');
    if (!token) {
      setLoginError('Você precisa estar logado para conectar sua conta do Instagram. Faça login novamente.');
      toast({
        title: 'Erro de autenticação',
        description: 'Sua sessão expirou. Por favor, faça login novamente.',
        variant: 'destructive',
      });
      // Redirecionar para login após alguns segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      return;
    }

    setIsConnecting(true);

    try {
      console.log('Iniciando login com Instagram OAuth');

      // Iniciar fluxo de autenticação OAuth
      const loginResult = await loginWithInstagramOAuth();

      console.log('Resultado da autenticação OAuth:', loginResult);

      if (loginResult.success) {
        toast({
          title: 'Conectado ao Instagram',
          description: 'Sua conta do Instagram foi conectada com sucesso.',
          variant: 'success',
        });

        await onLogin();
        setLoginError(null);
        onOpenChange(false);
      } else {
        setLoginError(
          loginResult.error || 'Não foi possível conectar sua conta do Instagram. Tente novamente mais tarde.',
        );

        toast({
          title: 'Erro ao conectar',
          description:
            loginResult.error || 'Não foi possível conectar sua conta do Instagram. Tente novamente mais tarde.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao fazer login no Instagram:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao conectar';
      setLoginError(errorMessage);

      toast({
        title: 'Erro ao conectar',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-viral-blue-dark border-white/10 text-white max-w-md">
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

        {loginError && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3 text-sm">
            {loginError.includes('Código: 101') ? (
              <div className="space-y-2">
                <p className="font-semibold">Erro de configuração da aplicação no Facebook:</p>
                <p>{loginError}</p>
                <p className="text-xs">
                  <span className="block font-semibold mt-2">Contate o suporte informando esse erro.</span>
                </p>
              </div>
            ) : (
              loginError
            )}
          </div>
        )}

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
              disabled={isConnecting}
            >
              {isConnecting ? (
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
      </DialogContent>
    </Dialog>
  );
};

export default InstagramLoginModal;
