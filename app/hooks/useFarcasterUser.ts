'use client';

import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  walletAddress?: string;
}

export function useFarcasterUser() {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        // Check if we're in a Mini App
        const miniAppStatus = await sdk.isInMiniApp();
        setIsInMiniApp(miniAppStatus);

        if (miniAppStatus) {
          // Get context and extract user info
          const context = await sdk.context;
          if (context?.user) {
            // Try to get wallet address if available
            let walletAddress: string | undefined;
            try {
              // The wallet is typically provided through the SDK context or via the Base app
              // Note: This depends on the hosting client implementation
              if (context.user && (context.user as any).wallet) {
                walletAddress = (context.user as any).wallet.address;
              }
            } catch (walletError) {
              console.warn('Could not retrieve wallet address:', walletError);
            }

            setUser({
              ...context.user,
              walletAddress,
            });
          }
        } else {
          setError('Not running in Farcaster Mini App');
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  return {
    user,
    isInMiniApp,
    isLoading,
    error,
    userId: user?.fid.toString() || null,
    walletAddress: user?.walletAddress,
  };
}
