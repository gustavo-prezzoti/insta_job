import ScheduleAPI from '@/api/Schedule';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScheduledPost } from '@/types/schedule';
import { addDays, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Edit, Instagram, Play, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScheduleCardProps {
  post: ScheduledPost;
  index: number;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}

const ScheduleCard = ({ post, index, onEdit, onDelete }: ScheduleCardProps) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { toast } = useToast();
  const { getUser } = useAuth();

  // Edit form state
  const [formData, setFormData] = useState({
    caption: '',
    tags: '',
    scheduledDate: undefined as Date | undefined,
    scheduledTime: '',
    type: '' as 'feed' | 'reel' | 'story',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Generate time options in 10-minute intervals
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Initialize form data when edit modal opens
  useEffect(() => {
    if (editModalOpen && post) {
      const scheduleDate = parseISO(post.schedule_for);

      setFormData({
        caption: post.caption || '',
        tags: post.tags || '',
        scheduledDate: scheduleDate,
        scheduledTime: format(scheduleDate, 'HH:mm'),
        type: post.type || 'reel',
      });
    }
  }, [editModalOpen, post]);

  // Handle form submission for updating a post
  const handleUpdatePost = async () => {
    if (!formData.scheduledDate || !formData.scheduledTime) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Data e hora são obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUpdating(true);

      // Combine date and time into a single ISO string
      const [hours, minutes] = formData.scheduledTime.split(':');
      const scheduledDateTime = new Date(formData.scheduledDate);
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

      const user = await getUser();
      if (!user) {
        toast({
          title: 'Erro de autenticação',
          description: 'Faça login novamente',
          variant: 'destructive',
        });
        return;
      }

      // Get JWT token
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Erro de autenticação',
          description: 'Token não encontrado',
          variant: 'destructive',
        });
        return;
      }

      // Call the API to update the post
      const response = await ScheduleAPI.updateSchedule(token, {
        id: post.id,
        type: formData.type,
        schedule_date: scheduledDateTime.toISOString(),
        caption: formData.caption,
        hashtags: formData.tags,
      });

      if (response.status === 200) {
        toast({
          title: 'Sucesso!',
          description: 'Post atualizado com sucesso',
        });
        setEditModalOpen(false);

        // Call the parent component's onEdit function to refresh the list
        onEdit(post.id);
      } else {
        throw new Error(response.data?.message || 'Erro ao atualizar o post');
      }
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      toast({
        title: 'Erro ao atualizar',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar o post',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!post) return null;

  return (
    <>
      <motion.div
        key={post?.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10"
      >
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail with Play Button Overlay */}
          <div className="md:w-32 lg:w-48 flex-shrink-0 relative">
            <div className="aspect-[9/16] h-full relative cursor-pointer" onClick={() => setVideoModalOpen(true)}>
              <div className="w-full h-full">
                <video className="w-full h-full object-cover" muted playsInline>
                  <source src={post?.video_url} type="video/mp4" />
                </video>
              </div>
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors">
                <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                  <Play size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Detalhes */}
          <div className="flex-grow p-4 md:p-6 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
              <h2 className="text-xl font-medium text-white mb-1 md:mb-0">{post?.caption}</h2>

              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs text-white rounded-full px-2 py-1 capitalize ${
                    post?.type === 'feed'
                      ? 'bg-viral-green-500/40'
                      : post?.type === 'reel'
                      ? 'bg-viral-accent-purple/50'
                      : 'bg-viral-blue-500/40'
                  }`}
                >
                  {post?.type}
                </span>

                <Instagram size={18} className="text-white/70" />
              </div>
            </div>

            <div className="text-white/70 text-sm mb-4 line-clamp-2">{post?.caption}</div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center text-white/80 mb-3 md:mb-0">
                <CalendarIcon size={16} className="mr-2" />
                <span className="mr-4">{format(parseISO(post?.schedule_for), "dd 'de' MMMM", { locale: ptBR })}</span>
                <Clock size={16} className="mr-2" />
                <span>{format(parseISO(post?.schedule_for), 'HH:mm')}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditModalOpen(true)}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <Edit size={14} className="mr-1" /> Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(post?.id)}
                  className="bg-transparent border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 size={14} className="mr-1" /> Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="sm:max-w-[85vw] max-h-[90vh] p-0 bg-black/90 border-none">
          <div className="flex items-center justify-center w-full h-full">
            <video className="w-full h-auto max-h-[85vh]" controls autoPlay src={post?.video_url} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Post Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[550px] bg-zinc-950 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">Editar Post</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Post Type */}
            <div className="space-y-2">
              <Label htmlFor="post-type" className="text-white/80">
                Tipo de Post
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as 'feed' | 'reel' | 'story' })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="feed" className="text-white">
                    Feed
                  </SelectItem>
                  <SelectItem value="reel" className="text-white">
                    Reel
                  </SelectItem>
                  <SelectItem value="story" className="text-white">
                    Story
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption" className="text-white/80">
                Legenda
              </Label>
              <Textarea
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="bg-white/5 border-white/10 text-white min-h-[100px]"
                placeholder="Adicione uma legenda para o seu post..."
              />
            </div>

            {/* Tags/Hashtags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-white/80">
                Hashtags
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="#viral #trend"
              />
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white/80">
                  Data
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className={cn(
                        'w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10',
                        !formData.scheduledDate && 'text-white/60',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.scheduledDate ? (
                        format(formData.scheduledDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800">
                    <Calendar
                      mode="single"
                      selected={formData.scheduledDate}
                      onSelect={(date) => setFormData({ ...formData, scheduledDate: date })}
                      initialFocus
                      disabled={(date) => date < addDays(new Date(), -1)}
                      className="bg-zinc-900 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Picker */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-white/80">
                  Horário
                </Label>
                <Select
                  value={formData.scheduledTime}
                  onValueChange={(time) => setFormData({ ...formData, scheduledTime: time })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[200px]">
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time} className="text-white">
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <X size={14} className="mr-1" /> Cancelar
            </Button>
            <Button
              onClick={handleUpdatePost}
              disabled={isUpdating}
              className="bg-viral-accent-purple hover:bg-viral-accent-purple/80"
            >
              {isUpdating ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save size={14} className="mr-1" /> Salvar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScheduleCard;
