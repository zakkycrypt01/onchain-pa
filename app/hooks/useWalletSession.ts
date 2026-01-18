import { useState, useEffect } from "react";
import { useFarcasterUser } from "@/app/hooks/useFarcasterUser";
import { useRainbowKit } from "@/app/hooks/useRainbowKit";

export type WalletProvider = "farcaster" | "rainbowkit" | "none";

interface WalletSession {
  address: string;
  displayName?: string;
  provider: WalletProvider;
  fid?: number; // Farcaster only
  username?: string; // Farcaster only
}

/**
 * Unified hook for detecting and managing wallet connections
 * Supports both Farcaster Mini App and RainbowKit
 */
export function useWalletSession(): {
  session: WalletSession | null;
  provider: WalletProvider;
  isLoading: boolean;
  isConnected: boolean;
  switchProvider: (provider: WalletProvider) => void;
} {
  const { user: farcasterUser, isLoading: farcasterLoading, walletAddress: farcasterAddress } = useFarcasterUser();
  const { address: rainbowkitAddress, isConnected: rainbowkitConnected } = useRainbowKit();
  const [selectedProvider, setSelectedProvider] = useState<WalletProvider>("none");

  useEffect(() => {
    // Priority: Farcaster > RainbowKit > None
    if (farcasterAddress && farcasterUser) {
      setSelectedProvider("farcaster");
    } else if (rainbowkitAddress && rainbowkitConnected) {
      setSelectedProvider("rainbowkit");
    } else {
      setSelectedProvider("none");
    }
  }, [farcasterAddress, farcasterUser, rainbowkitAddress, rainbowkitConnected]);

  let session: WalletSession | null = null;

  if (selectedProvider === "farcaster" && farcasterAddress && farcasterUser) {
    session = {
      address: farcasterAddress,
      displayName: farcasterUser.displayName || farcasterUser.username,
      provider: "farcaster",
      fid: farcasterUser.fid,
      username: farcasterUser.username,
    };
  } else if (selectedProvider === "rainbowkit" && rainbowkitAddress) {
    session = {
      address: rainbowkitAddress,
      displayName: `${rainbowkitAddress.slice(0, 6)}...${rainbowkitAddress.slice(-4)}`,
      provider: "rainbowkit",
    };
  }

  return {
    session,
    provider: selectedProvider,
    isLoading: farcasterLoading,
    isConnected: selectedProvider !== "none",
    switchProvider: setSelectedProvider,
  };
}

/**
 * Hook to get the current active wallet address
 */
export function useActiveWalletAddress(): string | null {
  const { session } = useWalletSession();
  return session?.address || null;
}

/**
 * Hook to get wallet provider info for context
 */
export function useWalletProviderInfo() {
  const { session, provider } = useWalletSession();

  return {
    provider,
    isFarcaster: provider === "farcaster",
    isRainbowKit: provider === "rainbowkit",
    address: session?.address || null,
    displayName: session?.displayName || null,
    fid: (session as any)?.fid || null,
  };
}
