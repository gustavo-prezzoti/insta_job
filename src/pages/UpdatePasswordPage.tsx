import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, LockKeyhole } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdatePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updatePassword } = useAuth();

  useEffect(() => {
    // If user is not logged in or doesn't need to change password, redirect to search
    return;
    if (!user) {
      navigate('/login');
      return;
    }

    if (user && !user.force_password_change) {
      navigate('/search');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate inputs
    if (!currentPassword) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, insira sua senha atual.',
        variant: 'destructive',
      });
      return;
    }

    if (!newPassword) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, insira sua nova senha.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'Sua nova senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Senhas não coincidem',
        description: 'A confirmação da senha não coincide com a nova senha.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await updatePassword(currentPassword, newPassword);

      toast({
        title: 'Senha atualizada com sucesso',
        description: 'Sua senha foi atualizada com sucesso.',
      });

      navigate('/search');
    } catch (error) {
      toast({
        title: 'Erro ao atualizar senha',
        description: 'Verifique sua senha atual e tente novamente.',
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
                  <LockKeyhole className="h-6 w-6 text-viral-accent-purple" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white">Atualizar Senha</h1>
              <p className="text-white/60 mt-2">É necessário atualizar sua senha antes de continuar</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-white">
                    Senha Atual
                  </Label>
                  <Input
                    id="currentPassword"
                    placeholder="Digite sua senha atual"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-white">
                    Nova Senha
                  </Label>
                  <Input
                    id="newPassword"
                    placeholder="Digite sua nova senha"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirmar Nova Senha
                  </Label>
                  <Input
                    id="confirmPassword"
                    placeholder="Confirme sua nova senha"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Atualizar Senha
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default UpdatePasswordPage;
