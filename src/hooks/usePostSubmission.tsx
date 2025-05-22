import InstagramAPI from '@/api/Instagram';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useInstagramCredentials } from '@/hooks/useInstagramCredentials';
import { cleanupVideosAfterPosting, publishToInstagramWithOAuth } from '@/services/instagramService';
import { VideoResult } from '@/types/video';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePostSubmission = (
  selectedVideo: VideoResult | null,
  caption: string,
  hashtags: string,
  postType: 'reel' | 'story',
  isScheduled: boolean,
  scheduledDate: Date | undefined,
  scheduledTime: string,
  authError: string | null,
  setSelectedVideo: (video: VideoResult) => void,
) => {
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { hasCredentials } = useInstagramCredentials();
  const { getUser } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isPosting) {
      console.log('Já está processando uma postagem, aguarde...');
      return;
    }

    if (!hasCredentials) {
      toast({
        title: 'Erro de autenticação',
        description: 'Ocorreu um erro ao verificar sua autenticação. Tente novamente.',
        variant: 'destructive',
      });
      return;
    }

    if (!caption.trim()) {
      toast({
        title: 'Legenda obrigatória',
        description: 'Por favor, adicione uma legenda para seu vídeo.',
        variant: 'destructive',
      });
      return;
    }

    let scheduledDateTime: Date | null = null;

    // Validar agendamento se estiver ativo
    if (isScheduled) {
      if (!scheduledDate) {
        toast({
          title: 'Data obrigatória',
          description: 'Por favor, selecione uma data para o agendamento.',
          variant: 'destructive',
        });
        return;
      }

      if (!scheduledTime) {
        toast({
          title: 'Horário obrigatório',
          description: 'Por favor, selecione um horário para o agendamento.',
          variant: 'destructive',
        });
        return;
      }

      // Combinando data e hora para criar o timestamp completo
      const [hours, minutes] = scheduledTime.split(':').map(Number);
      scheduledDateTime = new Date(scheduledDate);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      // Verificar se a data/hora não está no passado
      if (scheduledDateTime < new Date()) {
        toast({
          title: 'Data inválida',
          description: 'A data e hora de agendamento não podem estar no passado.',
          variant: 'destructive',
        });
        return;
      }

      try {
        const user = await getUser();

        if (!user) {
          toast({
            title: 'Erro de autenticação',
            description: 'Ocorreu um erro ao verificar sua autenticação. Tente novamente.',
            variant: 'destructive',
          });
          return;
        }

        const subscriptionEndDate = new Date(user.subscription_end_date);

        if (scheduledDateTime > subscriptionEndDate) {
          toast({
            title: 'Agendamento não permitido',
            description: `Você só pode agendar posts para os próximos 30 dias no período de teste.`,
            variant: 'destructive',
          });
          return;
        }
      } catch (err) {
        console.error('Erro ao verificar status da assinatura:', err);
        toast({
          title: 'Erro de verificação',
          description: 'Não foi possível verificar o status da sua assinatura. Tente novamente.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsPosting(true);

    try {
      if (!selectedVideo) {
        toast({
          title: 'Vídeo não selecionado',
          description: 'Por favor, selecione um vídeo para postar.',
          variant: 'destructive',
        });
        setIsPosting(false);
        return;
      }

      if (isScheduled) {
        toast({
          title: 'Agendando postagem',
          description: 'Salvando seu agendamento...',
        });
      } else {
        toast({
          title: 'Preparando postagem',
          description: 'Conectando à API do Instagram...',
        });
      }

      // Usando a nova função publishToInstagramWithOAuth
      const result = await publishToInstagramWithOAuth(
        selectedVideo.videoUrl,
        caption,
        hashtags,
        postType,
        isScheduled ? 'schedule' : 'now',
        isScheduled ? scheduledDateTime : undefined
      );

      if (!result.success) {
        throw new Error(result.error || (isScheduled ? 'Não foi possível agendar a postagem' : 'Não foi possível postar o vídeo'));
      }

      localStorage.removeItem('selectedVideos');

      if (isScheduled) {
        toast({
          title: 'Agendamento concluído!',
          description: `Sua postagem foi agendada para ${scheduledDateTime.toLocaleDateString(
            'pt-BR',
          )} às ${scheduledTime}.`,
          variant: 'success',
        });

        return navigate('/schedule');
      }

      toast({
        title: 'Vídeo publicado!',
        description: `Seu vídeo foi postado no Instagram ${
          postType === 'story' ? 'Story' : 'Reels'
        }.`,
        variant: 'success',
      });

      if (typeof setSelectedVideo === 'function') {
        setSelectedVideo(selectedVideo);
      }

      if (selectedVideo.id && typeof selectedVideo.id === 'string' && selectedVideo.id.includes('-')) {
        await cleanupVideosAfterPosting(selectedVideo.id);
      } else {
        console.log('ID do vídeo não é compatível com UUID, pulando limpeza:', selectedVideo.id);
      }

      navigate('/success');
    } catch (error) {
      console.error('Erro ao postar vídeo:', error);
      toast({
        title: 'Erro na postagem',
        description:
          error instanceof Error ? error.message : 'Ocorreu um erro ao postar seu vídeo. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsPosting(false);
    }
  };

  return {
    isPosting,
    handleSubmit,
  };
};
