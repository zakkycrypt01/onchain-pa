"use client";

import { useAccount, useClient } from "wagmi";

/**
 * Hook to use RainbowKit wallet connection
 * Returns wallet address and connection state
 */
export function useRainbowKit() {
  const { address, isConnected } = useAccount();
  const client = useClient();

  return {
    address,
    isConnected,
    client,
  };
}

export default useRainbowKit;
