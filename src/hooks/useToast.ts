/**
 * Hook para exibir notificações de erro de forma consistente
 */

import { useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type: "error" | "success" | "warning" | "info";
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Remove automaticamente após a duração especificada
    const duration = toast.duration || 5000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showError = useCallback(
    (message: string, duration?: number) => {
      return addToast({ message, type: "error", duration });
    },
    [addToast]
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      return addToast({ message, type: "success", duration });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      return addToast({ message, type: "warning", duration });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      return addToast({ message, type: "info", duration });
    },
    [addToast]
  );

  return {
    toasts,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    removeToast,
  };
}
