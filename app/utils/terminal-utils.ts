/**
 * Terminal Utilities
 * Helper functions for terminal command processing and formatting
 */

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, 500);
}

export function validateCommand(command: string): { valid: boolean; error?: string } {
  if (!command || command.trim().length === 0) {
    return { valid: false, error: "Command cannot be empty" };
  }

  if (command.length > 500) {
    return { valid: false, error: "Command is too long (max 500 characters)" };
  }

  return { valid: true };
}

export function formatExecutionTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function highlightSyntax(command: string): string {
  // Add syntax highlighting for common patterns
  return command
    .replace(/^(\w+)/g, '<span class="font-bold text-cyan-400">$1</span>')
    .replace(/--(\w+)/g, '<span class="text-green-400">--$1</span>')
    .replace(/(-\w)/g, '<span class="text-blue-400">$1</span>');
}

export function parseCommandFlags(command: string): Record<string, string | boolean> {
  const flags: Record<string, string | boolean> = {};
  const parts = command.split(/\s+/);
  
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith("--")) {
      const [key, value] = part.slice(2).split("=");
      flags[key] = value || true;
    } else if (part.startsWith("-")) {
      flags[part.slice(1)] = true;
    }
  }
  
  return flags;
}

export function extractCommandName(command: string): string {
  return command.split(/\s+/)[0] || "";
}

export function getCommandDescription(command: string): string {
  const descriptions: Record<string, string> = {
    tx: "List transaction history",
    bal: "Check wallet balance",
    wallet: "Get wallet details",
    send: "Send a transaction",
    swap: "Swap tokens on DEX",
    help: "Show available commands",
    clear: "Clear terminal history",
  };
  
  const cmd = extractCommandName(command).toLowerCase();
  return descriptions[cmd] || "Execute command";
}
