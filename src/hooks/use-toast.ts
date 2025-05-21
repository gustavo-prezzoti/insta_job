// Este arquivo implementa o hook useToast para oferecer funcionalidade de toast em toda a aplicação
import { useState } from 'react';
import { toast as toastSonner } from 'sonner';

// Tipo para as mensagens de toast
export type ToastType = 'default' | 'destructive' | 'success';

// Tipo para as propriedades do toast
type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastType;
  action?: React.ReactNode;
};

// Hook para gerenciar os toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Função para adicionar um novo toast
  const toast = ({ title, description, variant = 'default', action }: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((toasts) => [...toasts, { id, title, description, variant, action }]);

    toastSonner(title, {
      description,
      action,
    });

    // Remover o toast após 5 segundos
    setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
    }, 5000);
  };

  // Função para remover um toast específico
  const dismissToast = (id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    toast,
    dismissToast,
  };
}

// Esta é uma versão para uso sem hooks
export const toast = ({ title, description, variant = 'default' }: Omit<ToastProps, 'id' | 'action'>) => {
  // Despachamos um evento personalizado que o componente Toaster vai capturar
  const event = new CustomEvent('toast', {
    detail: {
      title,
      description,
      variant,
    },
  });
  window.dispatchEvent(event);
};
