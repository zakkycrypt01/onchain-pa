/**
 * Terminal Command Shortcuts & Keybindings
 * 
 * This module provides keyboard shortcuts and command aliases
 * for quick interaction with the agent.
 */

export type CommandShortcut = {
  keys: string[];
  description: string;
  command: string;
  aliases: string[];
};

export const COMMAND_SHORTCUTS: CommandShortcut[] = [
  {
    keys: ["Ctrl+T"],
    description: "List transaction history",
    command: "list all my transaction details",
    aliases: ["tx", "hist", "transactions", "t"],
  },
  {
    keys: ["Ctrl+B"],
    description: "Check wallet balance",
    command: "get my wallet details and balance",
    aliases: ["bal", "balance", "b"],
  },
  {
    keys: ["Ctrl+S"],
    description: "Send transaction",
    command: "help me send a transaction",
    aliases: ["send", "transfer", "s"],
  },
  {
    keys: ["Ctrl+W"],
    description: "Get wallet details",
    command: "get my wallet details",
    aliases: ["wallet", "details", "w"],
  },
  {
    keys: ["Ctrl+H"],
    description: "Show help",
    command: "show me available commands and what you can do",
    aliases: ["help", "h", "?"],
  },
  {
    keys: ["Ctrl+C"],
    description: "Clear context",
    command: "clear conversation history",
    aliases: ["clear", "reset", "c"],
  },
  {
    keys: ["Ctrl+N"],
    description: "Start new transaction",
    command: "I want to create a new transaction",
    aliases: ["new", "n"],
  },
  {
    keys: ["Ctrl+D"],
    description: "Swap tokens",
    command: "help me swap tokens on DEX",
    aliases: ["swap", "dex", "d"],
  },
];

/**
 * Parse user input and expand shortcuts/aliases to full commands
 * @param input User input string
 * @returns Expanded command or original input
 */
export function parseCommandInput(input: string): string {
  const trimmedInput = input.trim().toLowerCase();

  // Check if input matches any alias
  for (const shortcut of COMMAND_SHORTCUTS) {
    for (const alias of shortcut.aliases) {
      if (trimmedInput === alias || trimmedInput.startsWith(alias + " ")) {
        // Extract arguments if present (e.g., "tx 20" for last 20 transactions)
        const args = trimmedInput.slice(alias.length).trim();
        return args ? `${shortcut.command} ${args}` : shortcut.command;
      }
    }
  }

  return input;
}

/**
 * Get help text for all available shortcuts
 */
export function getHelpText(): string {
  let helpText = `
╔════════════════════════════════════════════════════════════════╗
║              ONCHAIN AI AGENT - COMMAND SHORTCUTS              ║
╠════════════════════════════════════════════════════════════════╣
║ Keyboard Shortcuts & Command Aliases:                         ║
║                                                                ║
`;

  COMMAND_SHORTCUTS.forEach((shortcut) => {
    const keysStr = shortcut.keys.join(" or ");
    const aliasesStr = shortcut.aliases.join(", ");
    helpText += `║ ${keysStr.padEnd(20)} | ${aliasesStr.padEnd(15)} │\n`;
    helpText += `║   ${shortcut.description.padEnd(58)} │\n`;
  });

  helpText += `║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║ QUICK EXAMPLES:                                                ║
║   • Type "tx" or press Ctrl+T to see transaction history       ║
║   • Type "bal" or press Ctrl+B to check balance                ║
║   • Type "wallet" or press Ctrl+W for wallet details           ║
║   • Type "help" or press Ctrl+H for this menu                  ║
║                                                                ║
║ NATURAL LANGUAGE: You can also ask in natural language         ║
║   • "Show me my transactions"                                  ║
║   • "What's my current balance?"                               ║
║   • "Send 0.1 ETH to address 0x..."                            ║
╚════════════════════════════════════════════════════════════════╝
  `;

  return helpText;
}

/**
 * Format keyboard shortcut for display
 */
export function formatKeyBinding(keys: string[]): string {
  return keys.map((key) => key.replace(/\+/g, " + ")).join(" / ");
}

/**
 * Get shortcut by alias
 */
export function getShortcutByAlias(alias: string): CommandShortcut | undefined {
  return COMMAND_SHORTCUTS.find((shortcut) =>
    shortcut.aliases.includes(alias.toLowerCase())
  );
}

/**
 * Detect keyboard shortcut from input (for CLI/terminal parsing)
 */
export function detectKeyboardShortcut(input: string): CommandShortcut | null {
  const keyCombos = ["ctrl+t", "ctrl+b", "ctrl+s", "ctrl+w", "ctrl+h", "ctrl+c", "ctrl+n", "ctrl+d"];
  const normalizedInput = input.toLowerCase().replace(/[ -]/g, "+");

  for (const combo of keyCombos) {
    if (normalizedInput === combo) {
      return COMMAND_SHORTCUTS.find((s) => s.keys.includes(combo.toUpperCase()))!;
    }
  }

  return null;
}
