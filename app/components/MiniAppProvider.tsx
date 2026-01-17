'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useFarcasterUser } from '@/app/hooks/useFarcasterUser';
import { useUserContext } from '@/app/providers/UserContext';

export const MiniAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isInMiniApp, isLoading, walletAddress } = useFarcasterUser();
  const { setCurrentUser } = useUserContext();

  useEffect(() => {
    const initMiniApp = async () => {
      try {
        // Initialize the mini app SDK when the app is ready
        await sdk.actions.ready();
        console.log('Mini app SDK initialized successfully');

        // Set current user if in mini app
        if (isInMiniApp && user) {
          setCurrentUser({
            userId: user.fid.toString(),
            username: user.username,
            displayName: user.displayName,
            pfpUrl: user.pfpUrl,
            walletAddress: walletAddress,
          });
          console.log('User set:', user.username || user.fid);
          if (walletAddress) {
            console.log('Wallet address:', walletAddress);
          }
        }
      } catch (error) {
        console.error('Failed to initialize mini app SDK:', error);
      }
    };

    if (!isLoading) {
      initMiniApp();
    }
  }, [isLoading, isInMiniApp, user, walletAddress, setCurrentUser]);

  return <>{children}</>;
};

export default MiniAppProvider;
