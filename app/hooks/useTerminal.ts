import { useState, useCallback, useRef } from "react";

export interface TerminalCommand {
  id: string;
  type: "command" | "output" | "error" | "success" | "processing" | "prompt" | "system";
  content: string;
  timestamp?: Date;
  details?: string[];
  executionTime?: number;
}

export function useTerminalHistory() {
  const [history, setHistory] = useState<TerminalCommand[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addCommand = useCallback((cmd: TerminalCommand) => {
    setHistory((prev) => [...prev, cmd]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  const getLastCommand = useCallback(() => {
    return history[history.length - 1] || null;
  }, [history]);

  const navigateHistory = useCallback((direction: "up" | "down") => {
    if (history.length === 0) return null;
    
    let newIndex = historyIndex;
    if (direction === "up") {
      newIndex = Math.min(newIndex + 1, history.length - 1);
    } else {
      newIndex = Math.max(newIndex - 1, -1);
    }
    
    setHistoryIndex(newIndex);
    return newIndex >= 0 ? history[newIndex] : null;
  }, [history, historyIndex]);

  return {
    history,
    addCommand,
    clearHistory,
    getLastCommand,
    navigateHistory,
    historyIndex,
  };
}

export function useTerminalState() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">(
    "disconnected"
  );
  const [commandStats, setCommandStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    totalTime: 0,
  });
  const processingTimeRef = useRef<number>(0);

  const recordCommandExecution = useCallback(
    (success: boolean, executionTime: number) => {
      setCommandStats((prev) => ({
        total: prev.total + 1,
        successful: prev.successful + (success ? 1 : 0),
        failed: prev.failed + (success ? 0 : 1),
        totalTime: prev.totalTime + executionTime,
      }));
    },
    []
  );

  const resetStats = useCallback(() => {
    setCommandStats({ total: 0, successful: 0, failed: 0, totalTime: 0 });
  }, []);

  return {
    isProcessing,
    setIsProcessing,
    connectionStatus,
    setConnectionStatus,
    commandStats,
    recordCommandExecution,
    resetStats,
    processingTimeRef,
  };
}

export function useTerminalInput() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearInput = useCallback(() => {
    setInput("");
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const setSuggestion = useCallback((text: string) => {
    setInput(text);
    focusInput();
  }, [focusInput]);

  return {
    input,
    setInput,
    suggestions,
    setSuggestions,
    clearInput,
    focusInput,
    setSuggestion,
    inputRef,
  };
}

export function useTerminalTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [fontSize, setFontSize] = useState(14);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 2, 24));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 2, 10));
  }, []);

  const resetFontSize = useCallback(() => {
    setFontSize(14);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme,
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
  };
}
