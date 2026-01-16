import React, { useEffect } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({
  id,
  message,
  type,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const bgColor = {
    success: "bg-green-500/20 border-green-500",
    error: "bg-red-500/20 border-red-500",
    warning: "bg-yellow-500/20 border-yellow-500",
    info: "bg-blue-500/20 border-blue-500",
  };

  const textColor = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  const iconMap = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={`${bgColor[type]} border px-4 py-3 rounded-lg flex items-center gap-3 animate-slide-in`}
    >
      <span className={`text-xl font-bold ${textColor[type]}`}>{iconMap[type]}</span>
      <span className="text-white text-sm">{message}</span>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => (
  <div className="fixed bottom-4 right-4 space-y-2 z-50">
    {toasts.map((toast) => (
      <ToastItem key={toast.id} {...toast} onClose={onClose} />
    ))}
  </div>
);

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback(
    (message: string, type: Toast["type"] = "info", duration = 3000) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      return id;
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = React.useCallback(
    (message: string, duration?: number) => addToast(message, "success", duration),
    [addToast]
  );

  const error = React.useCallback(
    (message: string, duration?: number) => addToast(message, "error", duration),
    [addToast]
  );

  const warning = React.useCallback(
    (message: string, duration?: number) => addToast(message, "warning", duration),
    [addToast]
  );

  const info = React.useCallback(
    (message: string, duration?: number) => addToast(message, "info", duration),
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}

export default ToastContainer;
