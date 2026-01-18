"use client";

import { useAccount, useDisconnect } from "wagmi";

/**
 * Hook to use RainbowKit wallet connection
 * Returns wallet address and connection state
 */
export function useRainbowKit() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return {
    address,
    isConnected,
    disconnect,
  };
}

export default useRainbowKit;
