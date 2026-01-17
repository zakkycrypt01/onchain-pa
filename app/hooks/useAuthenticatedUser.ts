import { useState, useEffect, useCallback } from "react";
import { useFarcasterUser } from "./useFarcasterUser";
import { useWallet } from "@/app/providers/WalletProvider";

/**
 * Combined user context from both Farcaster and WalletConnect
 */
export interface CombinedUser {
  source: "farcaster" | "walletconnect";
  address: string;
  walletAddress?: string;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  fid?: number;
  chain?: string;
  balance?: string;
  isConnected: boolean;
}

/**
 * Hook that combines Farcaster Mini App context with WalletConnect
 * Returns the appropriate user context based on how they accessed the app
 */
export function useAuthenticatedUser() {
  const farcaster = useFarcasterUser();
  const walletConnect = useWallet();
  const [combinedUser, setCombinedUser] = useState<CombinedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Determine which provider to use
    if (farcaster.isInMiniApp && farcaster.user) {
      // Farcaster Mini App takes priority
      setCombinedUser({
        source: "farcaster",
        address: farcaster.walletAddress || farcaster.user.username || "unknown",
        walletAddress: farcaster.walletAddress,
        username: farcaster.user.username,
        displayName: farcaster.user.displayName,
        pfpUrl: farcaster.user.pfpUrl,
        fid: farcaster.user.fid,
        isConnected: !!farcaster.user,
      });
      setIsLoading(false);
    } else if (walletConnect.wallet?.isConnected) {
      // Fall back to WalletConnect
      setCombinedUser({
        source: "walletconnect",
        address: walletConnect.wallet.address,
        walletAddress: walletConnect.wallet.address,
        chain: walletConnect.wallet.chain,
        balance: walletConnect.wallet.balance,
        isConnected: true,
      });
      setIsLoading(false);
    } else if (!farcaster.isLoading) {
      // Neither is connected
      setCombinedUser(null);
      setIsLoading(false);
    }

    setError(farcaster.error || walletConnect.error || null);
  }, [farcaster.user, farcaster.isInMiniApp, farcaster.isLoading, farcaster.error, walletConnect.wallet, walletConnect.error]);

  const disconnect = useCallback(async () => {
    if (combinedUser?.source === "walletconnect") {
      await walletConnect.disconnect();
    }
    // Farcaster Mini App can't be disconnected from within the app
    setCombinedUser(null);
  }, [combinedUser?.source, walletConnect]);

  return {
    user: combinedUser,
    isLoading,
    error,
    disconnect,
    isFarcaster: combinedUser?.source === "farcaster",
    isWalletConnect: combinedUser?.source === "walletconnect",
  };
}
