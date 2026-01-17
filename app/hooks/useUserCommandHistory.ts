import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@/app/contexts/UserContext';
import type { TerminalCommand } from '@/app/components/TerminalUI';

export const useUserCommandHistory = () => {
  const { user } = useUser();
  const [commands, setCommands] = useState<TerminalCommand[]>([
    {
      id: '0',
      type: 'prompt',
      content: 'ONCHAIN-PA-SESSION --v1.0.4',
    },
  ]);

  const storageKey = user ? `commands_${user.id}` : null;

  // Load commands from localStorage on user change
  useEffect(() => {
    if (storageKey) {
      const storedCommands = localStorage.getItem(storageKey);
      if (storedCommands) {
        try {
          const parsed = JSON.parse(storedCommands);
          setCommands(parsed);
        } catch (error) {
          console.error('Failed to load command history:', error);
        }
      }
    }
  }, [user?.id, storageKey]);

  // Save commands to localStorage whenever they change
  const addCommand = useCallback((cmd: TerminalCommand) => {
    setCommands((prev) => {
      const updated = [...prev, cmd];
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });
  }, [storageKey]);

  const clearCommands = useCallback(() => {
    const cleared = [
      {
        id: '0',
        type: 'prompt' as const,
        content: 'ONCHAIN-PA-SESSION --v1.0.4',
      },
    ];
    setCommands(cleared);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(cleared));
    }
  }, [storageKey]);

  return {
    commands,
    setCommands,
    addCommand,
    clearCommands,
  };
};
