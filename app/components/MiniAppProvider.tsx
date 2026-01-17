'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export const MiniAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const initMiniApp = async () => {
      try {
        // Initialize the mini app SDK when the app is ready
        await sdk.actions.ready();
        console.log('Mini app SDK initialized successfully');
      } catch (error) {
        console.error('Failed to initialize mini app SDK:', error);
      }
    };

    initMiniApp();
  }, []);

  return <>{children}</>;
};

export default MiniAppProvider;
