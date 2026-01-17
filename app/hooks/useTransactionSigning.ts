import { useState, useCallback } from "react";
import { SignTransactionRequest, SignTransactionResponse } from "@/app/api/agent/sign-transaction";

interface UseTransactionSigningOptions {
  onSuccess?: (hash: string) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for signing transactions on the server
 * 
 * Sends transaction details to the server, which uses the CDP wallet provider
 * to sign and execute the transaction
 */
export function useTransactionSigning(options?: UseTransactionSigningOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);

  const signTransaction = useCallback(
    async (request: SignTransactionRequest): Promise<SignTransactionResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/agent/sign-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        const data: SignTransactionResponse = await response.json();

        if (!response.ok) {
          const errorMessage = data.error || "Failed to sign transaction";
          setError(errorMessage);
          options?.onError?.(errorMessage);
          return null;
        }

        if (data.success && data.transactionHash) {
          setLastTransactionHash(data.transactionHash);
          options?.onSuccess?.(data.transactionHash);
        }

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        options?.onError?.(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const sendTransfer = useCallback(
    async (to: string, amount: string, userWalletAddress?: string) => {
      return signTransaction({
        to,
        value: amount,
        type: "transfer",
        description: `Transfer ${amount} wei to ${to}`,
        userWalletAddress,
      });
    },
    [signTransaction]
  );

  const sendSwap = useCallback(
    async (tokenFrom: string, tokenTo: string, amount: string, userWalletAddress?: string) => {
      return signTransaction({
        to: "0x", // Swap contract address would go here
        value: amount,
        type: "swap",
        description: `Swap ${tokenFrom} to ${tokenTo}`,
        userWalletAddress,
      });
    },
    [signTransaction]
  );

  const callContract = useCallback(
    async (contractAddress: string, data: string, value?: string, userWalletAddress?: string) => {
      return signTransaction({
        to: contractAddress,
        value,
        data,
        type: "contract_call",
        description: `Call contract ${contractAddress}`,
        userWalletAddress,
      });
    },
    [signTransaction]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    signTransaction,
    sendTransfer,
    sendSwap,
    callContract,
    isLoading,
    error,
    clearError,
    lastTransactionHash,
  };
}
