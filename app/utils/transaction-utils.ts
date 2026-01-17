/**
 * Transaction utilities for parsing and preparing transactions
 * from agent responses and user input
 */

export interface ParsedTransaction {
  type: "transfer" | "swap" | "contract_call" | "custom";
  to: string;
  value?: string;
  data?: string;
  description: string;
}

/**
 * Parse transaction data from agent responses or user input
 * 
 * Attempts to extract transaction details from a response or input string
 */
export function parseTransactionFromResponse(response: string): ParsedTransaction | null {
  try {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(response);
      if (parsed.to) {
        return {
          type: parsed.type || "custom",
          to: parsed.to,
          value: parsed.value,
          data: parsed.data,
          description: parsed.description || `Transaction to ${parsed.to}`,
        };
      }
    } catch {
      // Not JSON, continue with string parsing
    }

    // Look for transaction patterns in the response
    const response_lower = response.toLowerCase();

    // Transfer pattern: "send X to 0x..."
    const transferMatch = response.match(/send\s+([\d.]+)\s+(?:wei|eth)?\s+to\s+(0x[a-fA-F0-9]{40})/i);
    if (transferMatch) {
      const [, amount, address] = transferMatch;
      return {
        type: "transfer",
        to: address,
        value: amount.includes(".") ? (parseFloat(amount) * 1e18).toString() : amount,
        description: `Transfer ${amount} to ${address}`,
      };
    }

    // Swap pattern: "swap X for Y"
    const swapMatch = response.match(/swap\s+([A-Z]+)\s+for\s+([A-Z]+)/i);
    if (swapMatch) {
      const [, from, to] = swapMatch;
      return {
        type: "swap",
        to: "0x", // Placeholder, would need actual DEX address
        description: `Swap ${from} to ${to}`,
      };
    }

    // Contract call pattern: "call contract 0x..."
    const contractMatch = response.match(/call\s+contract\s+(0x[a-fA-F0-9]{40})\s+with\s+data\s+(.+)/i);
    if (contractMatch) {
      const [, address, data] = contractMatch;
      return {
        type: "contract_call",
        to: address,
        data,
        description: `Call contract ${address}`,
      };
    }

    // Address pattern: "0x..." indicating a transaction target
    const addressMatch = response.match(/0x[a-fA-F0-9]{40}/);
    if (addressMatch) {
      return {
        type: "custom",
        to: addressMatch[0],
        description: `Transaction to ${addressMatch[0]}`,
      };
    }

    return null;
  } catch (error) {
    console.error("Error parsing transaction:", error);
    return null;
  }
}

/**
 * Validates a transaction address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Converts wei to eth
 */
export function weiToEth(wei: string | bigint): string {
  const weiNum = typeof wei === "string" ? BigInt(wei) : wei;
  const ethNum = Number(weiNum) / 1e18;
  return ethNum.toFixed(4);
}

/**
 * Converts eth to wei
 */
export function ethToWei(eth: string | number): string {
  const ethNum = typeof eth === "string" ? parseFloat(eth) : eth;
  return (ethNum * 1e18).toString();
}

/**
 * Formats a transaction hash for display
 */
export function formatTxHash(hash: string): string {
  if (hash.length < 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

/**
 * Creates a block explorer URL for a transaction
 */
export function getTxExplorerUrl(txHash: string, chain: string = "base-sepolia"): string {
  const baseUrl =
    chain === "base-sepolia"
      ? "https://sepolia.basescan.org/tx"
      : chain === "base"
        ? "https://basescan.org/tx"
        : "https://etherscan.io/tx";

  return `${baseUrl}/${txHash}`;
}

/**
 * Extracts transaction hash from various response formats
 */
export function extractTransactionHash(response: string): string | null {
  const hashMatch = response.match(/0x[a-fA-F0-9]{64}/);
  return hashMatch ? hashMatch[0] : null;
}
