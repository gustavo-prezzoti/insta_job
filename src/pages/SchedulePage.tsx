import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { ScheduledPost } from '@/types/schedule';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Componentes
import ScheduleAPI from '@/api/Schedule';
import DeleteConfirmationDialog from '@/components/schedule/DeleteConfirmationDialog';
import NoSchedules from '@/components/schedule/NoSchedules';
import ScheduleCard from '@/components/schedule/ScheduleCard';
import ScheduleHeader from '@/components/schedule/ScheduleHeader';
import ScheduleLoading from '@/components/schedule/ScheduleLoading';
import { deleteScheduledPost } from '@/services/scheduleService';

const SchedulePage = () => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Carregando os agendamentos do banco de dados
  useEffect(() => {
    const fetchScheduledPosts = async () => {
      try {
        setIsLoading(false);
        const { data } = await ScheduleAPI.getSchedule();
        /*
        [
    {
      "id": "61c39035-2234-4710-90c6-ed634db71254",
      "user_id": "bcdd5542-78e2-4522-9726-c4cd60863f66",
      "caption": "Super charger",
      "tags": "#viral #trend",
      "schedule_for": "2025-05-14T18:21:22",
      "type": "reel",
      "video_url": "https://v39-eu.tiktokcdn.com/9f49689818b2230d0b1bc5df83976659/68265406/video/tos/useast2a/tos-useast2a-pve-0068/o0eGGIAmQUWQGGRuIEGaDkL5fGaF8FeecYAmS7/?a=1233&bti=NEBzNTY6QGo6OjZALnAjNDQuYCMxNDNg&ch=0&cr=0&dr=0&er=0&lr=all&net=0&cd=0%7C0%7C0%7C0&cv=1&br=780&bt=390&cs=0&ds=6&ft=td_Lr8QLodzR12NvJYZcWIxRZS_YIq_45SY&mime_type=video_mp4&qs=4&rc=aDM5MzlnNGdoOmU0NTplO0BpajRmbXE5cnFpcDMzNzczM0BiYjBiNWAuNjAxNDJgYzFeYSNqM3IvMmRjMTBgLS1kMTZzcw%3D%3D&vvpl=1&l=2025051420520978120D1FD3CB4844D524&btag=e000b5000",
      "status": "pendente",
      "created_at": "2025-05-14T20:53:10.19966+00:00",
      "updated_at": "2025-05-14T20:53:10.199671+00:00",
      "username": "postagensai",
      "error_message": null
  },*/
        setScheduledPosts(data);
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
        toast({
          title: 'Erro ao carregar agendamentos',
          description: 'Não foi possível carregar seus agendamentos. Tente novamente mais tarde.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduledPosts();
  }, [0]);

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleEditPost = (postId: string) => {
    // Funcionalidade de edição (simulada por enquanto)
    toast({
      title: 'Edição',
      description: 'Funcionalidade de edição em desenvolvimento.',
    });
  };

  const confirmDelete = async () => {
    if (postToDelete) {
      try {
        const response = await deleteScheduledPost(postToDelete);

        if (response) {
          // Atualizando o estado local
          setScheduledPosts((prev) => prev.filter((post) => post.id !== postToDelete));

          toast({
            title: 'Agendamento excluído',
            description: 'O agendamento foi excluído com sucesso.',
          });
        } else {
          toast({
            title: 'Erro ao excluir',
            description: 'Não foi possível excluir o agendamento. Tente novamente.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        toast({
          title: 'Erro ao excluir',
          description: 'Não foi possível excluir o agendamento. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setDeleteDialogOpen(false);
        setPostToDelete(null);
      }
    }
  };

  // Renderização do loading state
  if (isLoading) {
    return <ScheduleLoading />;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12 pb-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
          <ScheduleHeader />

          {scheduledPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {scheduledPosts.map((post, index) => (
                <ScheduleCard
                  key={post.id}
                  post={post}
                  index={index}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          ) : (
            <NoSchedules />
          )}
        </motion.div>

        {/* Diálogo de confirmação para excluir */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
        />
      </div>
    </MainLayout>
  );
};

export default SchedulePage;
