import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { addDays, format, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, CalendarIcon, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PostFormProps {
  caption: string;
  setCaption: (caption: string) => void;
  hashtags: string;
  setHashtags: (hashtags: string) => void;
  postType: 'reel' | 'feed' | 'story';
  setPostType: (postType: 'reel' | 'feed' | 'story') => void;
  isScheduled: boolean;
  setIsScheduled: (isScheduled: boolean) => void;
  scheduledDate: Date | undefined;
  setScheduledDate: (date: Date | undefined) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
}

const PostForm = ({
  caption,
  setCaption,
  hashtags,
  setHashtags,
  postType,
  setPostType,
  isScheduled,
  setIsScheduled,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
}: PostFormProps) => {
  // Estado para controlar a data de expiração da assinatura
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  const { getUser } = useAuth();

  // Gerar opções de tempo em intervalos de 10 minutos
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

  // Verificar data de expiração da assinatura ao carregar o componente
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setIsLoadingSubscription(true);

        const user = await getUser();

        if (!user) {
          setSubscriptionError('Usuário não autenticado');
          return false;
        }

        if (!user.is_active) {
          setSubscriptionError('Usuário não ativo');
          return false;
        }

        if (!user.has_subscription) {
          setSubscriptionError('Usuário não tem assinatura ativa');
          return false;
        }

        if (user.subscription_end_date) {
          setSubscriptionEndDate(new Date(user.subscription_end_date));
          return false;
        }

        const defaultEndDate = addDays(new Date(), 30);
        setSubscriptionEndDate(defaultEndDate);
        return true;
      } catch (error) {
        console.error('Erro ao verificar assinatura:', error);
        setSubscriptionError('Falha ao verificar status da assinatura');
        return false;
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  // Verificar se a data selecionada está dentro do período de assinatura
  const isDateWithinSubscription = (date?: Date): boolean => {
    if (!date || !subscriptionEndDate) return false;
    return !isAfter(date, subscriptionEndDate);
  };

  // Limitar datas selecionáveis no calendário
  const isDateSelectable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Não permitir datas no passado
    if (isBefore(date, today)) return false;

    // Se tivermos uma data de expiração da assinatura, não permitir datas após ela
    if (subscriptionEndDate) {
      const endDate = new Date(subscriptionEndDate);
      endDate.setHours(23, 59, 59, 999);
      return !isAfter(date, endDate);
    }

    return true;
  };

  // Limitar a data máxima selecionável no calendário
  const maxSelectableDate = subscriptionEndDate || undefined;

  return (
    <div className="space-y-6">
      {/* Tipo de postagem */}
      <div className="space-y-3">
        <label className="text-lg font-medium text-white flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-viral-accent-purple text-white text-xs">
            1
          </span>
          Tipo de postagem
        </label>
        <RadioGroup
          value={postType}
          onValueChange={(value) => setPostType(value as 'reel' | 'feed' | 'story')}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-3 rounded-lg border border-white/10 hover:border-viral-accent-purple/50 transition-all">
            <RadioGroupItem value="reel" id="reel" className="border-white/30 text-viral-accent-purple" />
            <Label htmlFor="reel" className="text-white cursor-pointer">
              Reels
            </Label>
          </div>
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-3 rounded-lg border border-white/10 hover:border-viral-accent-purple/50 transition-all">
            <RadioGroupItem value="feed" id="feed" className="border-white/30 text-viral-accent-purple" />
            <Label htmlFor="feed" className="text-white cursor-pointer">
              Feed
            </Label>
          </div>
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-3 rounded-lg border border-white/10 hover:border-viral-accent-purple/50 transition-all">
            <RadioGroupItem value="story" id="story" className="border-white/30 text-viral-accent-purple" />
            <Label htmlFor="story" className="text-white cursor-pointer">
              Story
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Opção de agendamento */}
      <div className="space-y-3">
        <label className="text-lg font-medium text-white flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-viral-accent-purple text-white text-xs">
            2
          </span>
          Quando publicar?
        </label>
        <RadioGroup
          value={isScheduled ? 'schedule' : 'now'}
          onValueChange={(value) => setIsScheduled(value === 'schedule')}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-3 rounded-lg border border-white/10 hover:border-viral-accent-purple/50 transition-all">
            <RadioGroupItem value="now" id="now" className="border-white/30 text-viral-accent-purple" />
            <Label htmlFor="now" className="text-white cursor-pointer flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Publicar agora
            </Label>
          </div>
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-3 rounded-lg border border-white/10 hover:border-viral-accent-purple/50 transition-all">
            <RadioGroupItem value="schedule" id="schedule" className="border-white/30 text-viral-accent-purple" />
            <Label htmlFor="schedule" className="text-white cursor-pointer flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Agendar publicação
            </Label>
          </div>
        </RadioGroup>

        {/* Alerta sobre status da assinatura */}
        {isScheduled && subscriptionEndDate && (
          <Alert variant="default" className="bg-viral-accent-pink/10 border border-viral-accent-pink/30 text-white">
            <AlertCircle className="h-4 w-4 text-viral-accent-pink mr-2" />
            <AlertDescription className="text-xs text-white/80">
              Sua assinatura é válida até {format(subscriptionEndDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.
              Posts agendados após esta data não serão publicados.
            </AlertDescription>
          </Alert>
        )}

        {isScheduled && subscriptionError && (
          <Alert variant="destructive" className="bg-red-500/10 border border-red-500/30">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <AlertDescription className="text-xs">
              {subscriptionError}. Agendamentos podem ser limitados.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Campos de agendamento */}
      {isScheduled && (
        <div className="p-5 bg-white/5 rounded-xl border border-white/10 transition-all hover:border-viral-accent-purple/30 space-y-5">
          <h3 className="text-white/80 font-medium flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-viral-accent-pink text-white text-xs">
              !
            </span>
            Detalhes do agendamento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-viral-accent-pink" />
                Data da publicação
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-viral-accent-pink/50',
                      !scheduledDate && 'text-white/60',
                      !isDateWithinSubscription(scheduledDate) && scheduledDate && 'border-red-500/50 text-red-200',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? (
                      format(scheduledDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-zinc-900 border-white/20">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    disabled={(date) => !isDateSelectable(date)}
                    locale={ptBR}
                    fromDate={new Date()}
                    toDate={maxSelectableDate}
                    className="pointer-events-auto"
                    classNames={{
                      caption: 'text-white',
                      day_selected: 'bg-viral-accent-pink text-white',
                      day_today: 'text-white border border-viral-accent-purple',
                      day: 'text-white hover:bg-viral-accent-purple/30',
                      day_disabled: 'text-white/30 hover:bg-transparent cursor-not-allowed',
                      head_cell: 'text-white/60',
                    }}
                  />
                </PopoverContent>
              </Popover>

              {scheduledDate && !isDateWithinSubscription(scheduledDate) && (
                <p className="text-xs text-red-400 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Data além do período da sua assinatura.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                <Clock className="h-4 w-4 text-viral-accent-pink" />
                Horário da publicação
              </label>
              <Select value={scheduledTime} onValueChange={setScheduledTime}>
                <SelectTrigger className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-viral-accent-pink/50">
                  <SelectValue placeholder="Selecione um horário">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {scheduledTime || 'Selecione um horário'}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto bg-zinc-900 border-white/20">
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time} className="text-white hover:bg-viral-accent-purple/30">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs text-white/60 flex items-center">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-viral-accent-pink/20 text-viral-accent-pink mr-2">
                <Clock className="h-3 w-3" />
              </span>
              {isLoadingSubscription
                ? 'Verificando status da sua assinatura...'
                : subscriptionEndDate
                ? `Sua assinatura permite agendamentos até ${format(subscriptionEndDate, 'dd/MM/yyyy', {
                    locale: ptBR,
                  })}`
                : 'Verifique seu plano para agendamentos futuros'}
            </p>
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className="space-y-3">
        <label className="text-lg font-medium text-white flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-viral-accent-purple text-white text-xs">
            3
          </span>
          Legenda
        </label>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Escreva uma legenda para seu vídeo..."
          className="h-24 bg-white/10 border-white/30 text-white placeholder:text-white/40 resize-none focus:border-viral-accent-purple/50"
        />
      </div>

      {/* Hashtags */}
      <div className="space-y-3">
        <label className="text-lg font-medium text-white flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-viral-accent-purple text-white text-xs">
            4
          </span>
          Hashtags
        </label>
        <Textarea
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="#viral #trending #tiktok"
          className="h-16 bg-white/10 border-white/30 text-white placeholder:text-white/40 resize-none focus:border-viral-accent-purple/50"
        />
      </div>
    </div>
  );
};

export default PostForm;
