"use client";

import React, { useState, useCallback } from "react";
import TerminalUI from "@/app/components/TerminalUI";
import { parseCommandInput } from "@/app/api/agent/command-shortcuts";

export default function TerminalPage() {
  const [terminalRef, setTerminalRef] = useState<any>(null);

  const handleCommand = useCallback(async (command: string) => {
    // Expand command aliases
    const expandedCommand = parseCommandInput(command);

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
  }, []);

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
