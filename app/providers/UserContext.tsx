'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface UserSession {
  userId: string;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

export interface UserCommandHistory {
  [userId: string]: string[];
}

interface UserContextType {
  currentUser: UserSession | null;
  setCurrentUser: (user: UserSession) => void;
  commandHistory: UserCommandHistory;
  addCommandToHistory: (userId: string, command: string) => void;
  getUserCommandHistory: (userId: string) => string[];
  clearUserHistory: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [commandHistory, setCommandHistory] = useState<UserCommandHistory>({});

  const addCommandToHistory = (userId: string, command: string) => {
    setCommandHistory((prev) => ({
      ...prev,
      [userId]: [...(prev[userId] || []), command],
    }));
  };

  const getUserCommandHistory = (userId: string): string[] => {
    return commandHistory[userId] || [];
  };

  const clearUserHistory = (userId: string) => {
    setCommandHistory((prev) => ({
      ...prev,
      [userId]: [],
    }));
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        commandHistory,
        addCommandToHistory,
        getUserCommandHistory,
        clearUserHistory,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
}
