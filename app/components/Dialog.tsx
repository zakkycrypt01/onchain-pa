import React, { useEffect } from "react";
import { Button } from "./Button";

interface DialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  description,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className="bg-gray-900 border border-cyan-500/50 rounded-lg p-6 max-w-md w-full mx-4 animate-scale-in"
        style={{
          boxShadow: "0 0 30px rgba(34, 211, 238, 0.2)",
        }}
      >
        <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
        {description && <p className="text-gray-300 text-sm mb-4">{description}</p>}
        {children && <div className="mb-6 text-gray-300">{children}</div>}

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              variant={isDangerous ? "danger" : "primary"}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export function useDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Partial<DialogProps>>({});

  const open = React.useCallback((options: Partial<DialogProps>) => {
    setConfig(options);
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, open, close, config };
}

export default Dialog;
