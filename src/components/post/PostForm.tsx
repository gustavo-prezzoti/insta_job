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
  postType: 'reel' | 'story';
  setPostType: (postType: 'reel' | 'story') => void;
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
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [maxSelectableDate, setMaxSelectableDate] = useState<Date>(new Date());
  const { getUser } = useAuth();

  // Gerar opções de horário a cada 30 minutos
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    setTimeOptions(options);
  };

  useEffect(() => {
    generateTimeOptions();
  }, []);

  // Carregar informações de assinatura para validar datas de agendamento
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setIsLoadingSubscription(true);
      setSubscriptionError(null);

      try {
        const user = await getUser();
        if (!user) {
          setSubscriptionError('Não foi possível verificar sua assinatura');
          setIsLoadingSubscription(false);
          return;
        }

        if (user.subscription_end_date) {
          const endDate = new Date(user.subscription_end_date);
          setSubscriptionEndDate(endDate);

          // Definir data máxima selecionável com base na data de expiração da assinatura
          setMaxSelectableDate(endDate);
        } else {
          // Se não houver uma data de expiração definida, limite para 30 dias no futuro (caso de teste)
          const defaultEndDate = new Date();
          defaultEndDate.setDate(defaultEndDate.getDate() + 30);
          setSubscriptionEndDate(defaultEndDate);
          setMaxSelectableDate(defaultEndDate);
        }
      } catch (error) {
        console.error('Erro ao carregar dados de assinatura:', error);
        setSubscriptionError('Não foi possível verificar sua assinatura');
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    fetchSubscriptionData();
  }, [getUser]);

  // Verificar se a data está dentro do período de assinatura
  const isDateWithinSubscription = (date?: Date): boolean => {
    if (!date || !subscriptionEndDate) return false;
    return date <= subscriptionEndDate;
  };

  // Verificar se a data pode ser selecionada (a partir de hoje até o fim da assinatura)
  const isDateSelectable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && isDateWithinSubscription(date);
  };

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
          onValueChange={(value) => setPostType(value as 'reel' | 'story')}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-3 rounded-lg border border-white/10 hover:border-viral-accent-purple/50 transition-all">
            <RadioGroupItem value="reel" id="reel" className="border-white/30 text-viral-accent-purple" />
            <Label htmlFor="reel" className="text-white cursor-pointer">
              Reels
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
