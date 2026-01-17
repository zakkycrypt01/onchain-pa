"use client";

import React, { useState, useCallback } from "react";
import TerminalUI, { TerminalManager } from "@/app/components/TerminalUI";
import { parseCommandInput } from "@/app/api/agent/command-shortcuts";
import { COMMAND_TEMPLATES } from "@/app/utils/command-templates";

const HELP_TEXT = `
Available Commands:
  bal      - Check wallet balance
  wallet   - Get wallet details
  tx       - View transaction history
  send     - Send tokens to an address
  swap     - Swap tokens on DEX
  help     - Show this help message
  clear    - Clear terminal history

Aliases:
  @balance - bal
  @wallet  - wallet
  @tx      - tx
  @help    - help
  @clear   - clear
  @swap    - swap
  @send    - send

Keyboard Shortcuts:
  Ctrl+L   - Clear terminal
  Ctrl+C   - Cancel command
  Up/Down  - Navigate history
  Ctrl+H   - Show help
`;

export default function TerminalPage() {
  const [terminalRef, setTerminalRef] = useState<any>(null);
  const [commands, setCommands] = useState<any[]>([]);

  const addCommand = useCallback((cmd: any) => {
    setCommands((prev) => [...prev, cmd]);
  }, []);

  const handleCommand = useCallback(async (input: string): Promise<{ success: boolean; response: string; details?: string[] }> => {
    // Expand command aliases
    const expandedCommand = parseCommandInput(input);
    const baseCommand = expandedCommand.split(/\s+/)[0].toLowerCase();

    // Handle help command locally
    if (baseCommand === "help") {
      return {
        success: true,
        response: HELP_TEXT.trim(),
      };
    }

    // Handle clear command locally
    if (baseCommand === "clear") {
      setCommands([
        {
          id: "0",
          type: "prompt",
          content: "ONCHAIN-PA-SESSION --v1.0.4",
        },
      ]);
      return {
        success: true,
        response: "Terminal cleared",
      };
    }

    try {
      // Send to agent API - both commands and natural language queries
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: expandedCommand,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          response: errorData.error || "Failed to process command",
        };
      }

      const data = await response.json();
      console.log("Agent response:", data);

      // Extract response text from agent
      const responseText = data.response || data.message || "Command executed";
      const details = data.details ? Object.entries(data.details).map(([k, v]) => `${k}: ${v}`) : undefined;

      return {
        success: true,
        response: responseText,
        details,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Command error:", error);
      return {
        success: false,
        response: errorMessage,
      };
    }
  }, [setCommands]);

  return (
    <div className="w-full h-screen">
      <TerminalUI
        title="ONCHAIN-PA-SESSION"
        version="v1.0.4"
        onCommand={handleCommand}
      />
    </div>
  );
}
