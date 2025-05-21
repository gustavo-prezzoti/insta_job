import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      // Check if user needs to change password
      if (user.force_password_change) {
        navigate('/update-password');
      } else {
        navigate('/search');
      }
    } else if (localStorage.getItem('token')) {
      navigate('/search');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, insira o e-mail utilizado na hora da compra.',
        variant: 'destructive',
      });
      return;
    }

    if (!password) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, insira sua senha.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);

      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo ao VIRALYX.AI.',
      });

      // Navigate based on force_password_change flag
      if (user?.force_password_change) {
        navigate('/update-password');
      } else {
        navigate('/search');
      }
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        description: 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout showNavigation={false}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="max-w-md w-full glass-card rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-white/10 p-2 flex items-center justify-center">
                  <LogIn className="h-6 w-6 text-viral-accent-purple" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white">Login</h1>
              <p className="text-white/60 mt-2">Acesse sua conta para continuar</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    placeholder="exemplo@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    placeholder="Digite sua senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-viral-accent-purple hover:bg-viral-accent-purple/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                Ainda não é assinante?{' '}
                <a href="#" className="text-viral-accent-pink hover:underline">
                  Assine agora
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
