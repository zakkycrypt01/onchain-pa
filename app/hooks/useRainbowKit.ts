"use client";

import { useAccount, useWalletClient } from "wagmi";

/**
 * Hook to use RainbowKit wallet connection
 * Returns wallet address and connection state
 */
export function useRainbowKit() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  return {
    address,
    isConnected,
    walletClient,
  };
}

export default useRainbowKit;
