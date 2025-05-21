import ScheduleAPI from '@/api/Schedule';
import { supabase } from '@/integrations/supabase/client';
import { ScheduledPost } from '@/types/schedule';

// Função para salvar um agendamento de postagem
export const schedulePost = async (
  videoId: string,
  caption: string,
  scheduledFor: Date,
  platform: 'instagram' | 'tiktok' | 'facebook' | 'youtube',
): Promise<boolean> => {
  try {
    // Verificando se o usuário está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('Usuário não autenticado');
      return false;
    }

    const { error } = await supabase.from('scheduled_posts').insert({
      video_id: videoId,
      user_id: user.id,
      caption,
      scheduled_for: scheduledFor.toISOString(),
      platform,
    });

    if (error) {
      console.error('Erro ao agendar postagem:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao agendar postagem:', error);
    return false;
  }
};

// Função para buscar agendamentos de postagem
export const getScheduledPosts = async (): Promise<ScheduledPost[]> => {
  try {
    // Verificando se o usuário está autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Usuário não autenticado', authError);
      return [];
    }

    // Obtendo o token JWT do usuário
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (!token) {
      console.error('Token de autenticação não encontrado');
      return [];
    }

    // Fazendo a chamada à API usando ScheduleAPI
    const { data } = await ScheduleAPI.getSchedule();

    if (!data) {
      console.error('Nenhum dado retornado da API');
      return [];
    }

    return data as ScheduledPost[];
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return [];
  }
};

// Função para excluir um agendamento
export const deleteScheduledPost = async (postId: string): Promise<boolean> => {
  try {
    const response = await ScheduleAPI.deleteSchedule(postId);

    if (response.status !== 200) {
      console.error('Erro ao excluir agendamento:', response.data);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    return false;
  }
};
