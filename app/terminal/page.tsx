"use client";

import React, { useState, useCallback } from "react";
import TerminalUI, { TerminalManager } from "@/app/components/TerminalUI";
import { parseCommandInput } from "@/app/api/agent/command-shortcuts";
import { COMMAND_TEMPLATES } from "@/app/utils/command-templates";
import { useFarcasterUser } from "@/app/hooks/useFarcasterUser";
import { useUserContext } from "@/app/providers/UserContext";
import { useTransactionSigning } from "@/app/hooks/useTransactionSigning";
import { parseTransactionFromResponse, extractTransactionHash } from "@/app/utils/transaction-utils";
import { useAuthenticatedUser } from "@/app/hooks/useAuthenticatedUser";
import { useRouter } from "next/navigation";

const HELP_TEXT = `Available Commands:
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
  Ctrl+H   - Show help`;

export default function TerminalPage() {
  const router = useRouter();
  const { user, isLoading, disconnect } = useAuthenticatedUser();
  const { currentUser } = useUserContext();
  const { signTransaction } = useTransactionSigning();
  const [terminalRef, setTerminalRef] = useState<any>(null);
  const [commands, setCommands] = useState<any[]>([]);

  // Redirect to landing if not authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/landing");
    }
  }, [user, isLoading, router]);

  const addCommand = useCallback((cmd: any) => {
    // This is now handled by TerminalUI internally
  }, []);

  const handleCommand = useCallback(async (input: string): Promise<{ success: boolean; response: string; details?: string[] }> => {
    // Expand command aliases
    const expandedCommand = parseCommandInput(input);
    const baseCommand = expandedCommand.split(/\s+/)[0].toLowerCase();

    // Handle help command locally
    if (baseCommand === "help") {
      const helpLines = HELP_TEXT.split('\n');
      return {
        success: true,
        response: "Available Commands and Help",
        details: helpLines,
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
      
      // Check if the response contains transaction details to execute
      // Look for patterns like transaction hashes, wallet operations, or specific keywords
      if (
        responseText.toLowerCase().includes("transaction") ||
        responseText.toLowerCase().includes("would you like") ||
        responseText.toLowerCase().includes("sign this") ||
        /0x[a-fA-F0-9]{40}/.test(responseText)
      ) {
        // Try to parse transaction from response
        const parsedTx = parseTransactionFromResponse(responseText);
        
        if (parsedTx && walletAddress) {
          console.log("[Terminal] Detected transaction, attempting to sign:", parsedTx);
          
          // Automatically execute the transaction
          const signResult = await signTransaction({
            to: parsedTx.to,
            value: parsedTx.value,
            data: parsedTx.data,
            type: parsedTx.type,
            description: parsedTx.description,
            userWalletAddress: user?.walletAddress,
            userMessage: input,
          });

          if (signResult && signResult.success) {
            const txDetails = [
              `✓ Transaction executed successfully`,
              `Type: ${parsedTx.type}`,
              `To: ${parsedTx.to}`,
              ...(parsedTx.value ? [`Amount: ${parsedTx.value}`] : []),
              ...(signResult.transactionHash ? [`Hash: ${signResult.transactionHash}`] : []),
              ...(signResult.message ? [signResult.message] : []),
            ];

            return {
              success: true,
              response: `${responseText}\n\nTransaction signed and submitted to the blockchain.`,
              details: txDetails,
            };
          } else if (signResult && signResult.error) {
            return {
              success: false,
              response: responseText,
              details: [`Transaction signing failed: ${signResult.error}`],
            };
          }
        }
      }

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
  }, [user?.walletAddress, signTransaction]);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gray-950 text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-cyan-400 text-lg mb-4">Loading...</div>
          <div className="text-gray-400 text-sm">Initializing user session</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <TerminalUI
        title="ONCHAIN-PA-SESSION"
        version="v1.0.4"
        onCommand={handleCommand}
        currentUser={currentUser}
      />
    </div>
  );
}
