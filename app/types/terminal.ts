/**
 * Terminal Type Definitions
 * Core types used throughout the terminal application
 */

export type CommandStatus = "pending" | "executing" | "success" | "error" | "cancelled";

export type TerminalMode = "command" | "interactive" | "visual";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface CommandResult {
  command: string;
  status: CommandStatus;
  output?: string;
  error?: string;
  duration: number;
  timestamp: Date;
}

export interface UserPreferences {
  theme: "dark" | "light";
  fontSize: number;
  autoComplete: boolean;
  showTimestamps: boolean;
  showStats: boolean;
  soundEnabled: boolean;
  maxHistorySize: number;
}

export interface ConnectionConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

export interface TerminalSession {
  id: string;
  name: string;
  createdAt: Date;
  lastUsed: Date;
  commands: CommandResult[];
  settings: Partial<UserPreferences>;
}

export interface CommandAutocompleteOption {
  label: string;
  description: string;
  value: string;
  category: string;
}
