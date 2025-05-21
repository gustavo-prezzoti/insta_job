import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Camera, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileModal = ({ open, onOpenChange }: ProfileModalProps) => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // Criar URL para preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      if (
        (currentPassword.trim() !== '' && newPassword.trim() === '') ||
        (currentPassword.trim() === '' && newPassword.trim() !== '')
      ) {
        // Show error if only one password field is filled
        toast({
          title: 'Campos incompletos',
          description: 'Para alterar a senha, preencha tanto a senha atual quanto a nova senha.',
          variant: 'destructive',
        });
        setIsUpdating(false);
        return;
      }

      // Update profile data (name and avatar)
      const response = await updateUserProfile({
        name,
        avatarFile,
        currentPassword,
        newPassword,
      });

      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      });

      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: 'Não foi possível atualizar seu perfil. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-viral-blue border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Seu Perfil</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center">
          <div className="relative mb-6 group">
            <Avatar className="h-24 w-24 border-4 border-viral-accent-purple">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} />
              ) : (
                <>
                  <AvatarImage src={user?.avatarUrl || ''} />
                  <AvatarFallback className="bg-viral-accent-purple text-white text-3xl">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </>
              )}
            </Avatar>

            <label className="absolute bottom-0 right-0 bg-viral-accent-purple rounded-full p-2 cursor-pointer hover:bg-viral-accent-purple/90 transition-all">
              <Camera size={16} className="text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none px-4 py-1 mb-6"
          >
            Usuário Premium
          </Badge>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <label htmlFor="name" className="text-sm text-white/70 block mb-1">
                Seu nome
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Digite seu nome"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 block mb-1">Email</label>
              <div className="bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white/70">
                {user?.email || 'email@exemplo.com'}
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-medium text-white mb-3">Alterar senha</h3>

              <div className="space-y-3">
                <div>
                  <label htmlFor="currentPassword" className="text-sm text-white/70 block mb-1">
                    Senha atual
                  </label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white pr-10"
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-white/70" />
                      ) : (
                        <Eye className="h-5 w-5 text-white/70" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="text-sm text-white/70 block mb-1">
                    Nova senha
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white pr-10"
                      placeholder="Digite sua nova senha"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-white/70" />
                      ) : (
                        <Eye className="h-5 w-5 text-white/70" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-viral-accent-purple hover:bg-viral-accent-purple/90"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  'Salvar alterações'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
