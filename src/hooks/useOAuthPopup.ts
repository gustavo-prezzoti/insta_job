import { useRef, useCallback, useState } from 'react';

export function useOAuthPopup() {
  const popupRef = useRef<Window | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Abre o popup e inicia o monitoramento
  const openPopup = useCallback(async (getAuthUrl: () => Promise<string>) => {
    setError(null);
    setIsLoading(true);

    // Abre popup como nova aba ou janela em tela cheia
    const popup = window.open(
      '',
      '_blank',
      `width=${window.screen.width},height=${window.screen.height},top=0,left=0`
    );
    if (!popup) {
      setError('Não foi possível abrir o popup. Libere pop-ups no navegador.');
      setIsLoading(false);
      return;
    }
    popupRef.current = popup;
    setIsOpen(true);

    try {
      // Busca a URL do backend
      const url = await getAuthUrl();
      popup.location.href = url;
    } catch (err) {
      popup.close();
      setError('Erro ao buscar URL de autenticação');
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    // Escuta mensagens do popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'INSTAGRAM_AUTH_SUCCESS') {
        setIsLoading(false);
        setIsOpen(false);
        window.removeEventListener('message', handleMessage);
        popup.close();
      } else if (event.data?.type === 'INSTAGRAM_AUTH_ERROR') {
        setError(event.data.error || 'Erro desconhecido');
        setIsLoading(false);
        setIsOpen(false);
        window.removeEventListener('message', handleMessage);
        popup.close();
      }
    };
    window.addEventListener('message', handleMessage);

    // Monitora fechamento manual do popup
    const interval = setInterval(() => {
      if (popup.closed) {
        setIsOpen(false);
        setIsLoading(false);
        clearInterval(interval);
        window.removeEventListener('message', handleMessage);
      }
    }, 500);
  }, []);

  // Fecha o popup manualmente
  const closePopup = useCallback(() => {
    popupRef.current?.close();
    setIsOpen(false);
    setIsLoading(false);
  }, []);

  return { openPopup, closePopup, isOpen, isLoading, error };
} 