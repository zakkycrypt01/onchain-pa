/**
 * Terminal Theme Configuration
 * Centralized color and styling configuration for the terminal UI
 */

export const TERMINAL_THEMES = {
  dark: {
    background: "linear-gradient(135deg, #0a0e27 0%, #16213e 100%)",
    foreground: "#e0e0e0",
    border: "rgba(34, 211, 238, 0.5)",
    borderGlow: "rgba(34, 211, 238, 0.1)",
    success: "#22c55e",
    successGlow: "rgba(34, 197, 94, 0.6)",
    error: "#ef4444",
    errorGlow: "rgba(239, 68, 68, 0.6)",
    warning: "#eab308",
    warningGlow: "rgba(234, 179, 8, 0.6)",
    info: "#3b82f6",
    infoGlow: "rgba(59, 130, 246, 0.6)",
    accent: "#22d3ee",
    accentGlow: "rgba(34, 211, 238, 0.6)",
    header: "#111827",
    headerBorder: "rgba(34, 211, 238, 0.5)",
    output: "#d1d5db",
    command: "#22d3ee",
    processing: "#fbbf24",
    prompt: "#22d3ee",
    system: "#60a5fa",
    hover: "rgba(255, 255, 255, 0.05)",
  },
  light: {
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    foreground: "#1e293b",
    border: "rgba(59, 130, 246, 0.6)",
    borderGlow: "rgba(59, 130, 246, 0.1)",
    success: "#16a34a",
    successGlow: "rgba(22, 163, 74, 0.3)",
    error: "#dc2626",
    errorGlow: "rgba(220, 38, 38, 0.3)",
    warning: "#d97706",
    warningGlow: "rgba(217, 119, 6, 0.3)",
    info: "#2563eb",
    infoGlow: "rgba(37, 99, 235, 0.3)",
    accent: "#0ea5e9",
    accentGlow: "rgba(14, 165, 233, 0.3)",
    header: "#f1f5f9",
    headerBorder: "rgba(59, 130, 246, 0.4)",
    output: "#334155",
    command: "#0ea5e9",
    processing: "#d97706",
    prompt: "#0ea5e9",
    system: "#2563eb",
    hover: "rgba(0, 0, 0, 0.05)",
  },
};

export const COMMAND_PREFIXES = {
  command: "root@onchain-pa:~$",
  error: "[Error]",
  success: "[Success]",
  processing: "[Processing]",
  system: "[System]",
  output: ">>",
};

export const TERMINAL_CONFIG = {
  maxHistorySize: 1000,
  autoScrollDelay: 100,
  typingSpeed: 50,
  animationDuration: 200,
  debounceDelay: 300,
};

export type TerminalTheme = keyof typeof TERMINAL_THEMES;
export type CommandType = keyof typeof COMMAND_PREFIXES;
