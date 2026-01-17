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

  const handleCommand = useCallback(async (command: string) => {
    // Expand command aliases
    const expandedCommand = parseCommandInput(command);
    const baseCommand = expandedCommand.split(/\s+/)[0].toLowerCase();

    // Handle local commands
    if (baseCommand === "help") {
      addCommand(TerminalManager.createCommandOutput(HELP_TEXT.trim()));
      return;
    }

    if (baseCommand === "clear") {
      setCommands([
        {
          id: "0",
          type: "prompt",
          content: "ONCHAIN-PA-SESSION --v1.0.4",
        },
      ]);
      return;
    }

    try {
      // Send to agent API
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
        throw new Error(errorData.error || "Failed to process command");
      }

      const data = await response.json();
      console.log("Agent response:", data);

      // Display success
    } catch (error) {
      console.error("Command error:", error);
      throw error;
    }
  }, [addCommand]);

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
