import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

interface ToastProps {
  title: string;
  description: string;
  type?: ToastType;
}

export const useToast = () => {
  const [toastState, setToastState] = useState<ToastState>({ message: '', type: 'info', visible: false });

  const toast = useCallback((props: ToastProps) => {
    setToastState({ message: props.description, type: props.type || 'info', visible: true });
    setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
  }, []);

  return { toast, toastState };
};
