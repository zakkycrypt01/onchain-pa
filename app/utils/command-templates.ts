/**
 * Command Templates & Macros
 * Pre-built command templates and macro system
 */

export interface CommandTemplate {
  id: string;
  name: string;
  description: string;
  command: string;
  variables?: Record<string, { label: string; default: string }>;
  category: string;
}

export const COMMAND_TEMPLATES: CommandTemplate[] = [
  {
    id: "check-balance",
    name: "Check Balance",
    description: "Get your current wallet balance",
    command: "bal",
    category: "wallet",
  },
  {
    id: "get-wallet-details",
    name: "Get Wallet Details",
    description: "View comprehensive wallet information",
    command: "wallet",
    category: "wallet",
  },
  {
    id: "view-transactions",
    name: "View Transactions",
    description: "List recent transaction history",
    command: "tx",
    category: "wallet",
  },
  {
    id: "swap-tokens",
    name: "Swap Tokens",
    description: "Swap tokens on DEX",
    command: "swap",
    variables: {
      from_amount: { label: "Amount to swap", default: "1" },
      from_token: { label: "Token to swap from", default: "ETH" },
      to_token: { label: "Token to swap to", default: "USDC" },
    },
    category: "trading",
  },
  {
    id: "send-transaction",
    name: "Send Transaction",
    description: "Send tokens to an address",
    command: "send",
    variables: {
      amount: { label: "Amount to send", default: "0.1" },
      address: { label: "Recipient address", default: "0x..." },
      token: { label: "Token to send", default: "ETH" },
    },
    category: "wallet",
  },
];

export function getTemplate(id: string): CommandTemplate | undefined {
  return COMMAND_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: string): CommandTemplate[] {
  return COMMAND_TEMPLATES.filter((t) => t.category === category);
}

export function fillTemplate(
  template: CommandTemplate,
  variables: Record<string, string>
): string {
  let command = template.command;
  Object.entries(variables).forEach(([key, value]) => {
    command = command.replace(`{{${key}}}`, value);
  });
  return command;
}

export function expandMacro(macro: string): string {
  const macros: Record<string, string> = {
    "@balance": "bal",
    "@wallet": "wallet",
    "@tx": "tx",
    "@help": "help",
    "@clear": "clear",
    "@swap": "swap",
    "@send": "send",
  };
  
  return macros[macro] || macro;
}

export function parseMacros(input: string): string {
  const macroPattern = /@\w+/g;
  return input.replace(macroPattern, (match) => expandMacro(match));
}
