"use client";

import React, { ReactNode, useMemo } from "react";
import { RainbowKitProvider as RainbowKitProviderComponent } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { createRainbowKitConfig } from "@/app/lib/rainbowkit-config";

// This file contains the RainbowKit wallet provider setup
// Migration from Reown/AppKit to RainbowKit

interface RainbowKitProviderProps {
  children: React.ReactNode;
}

/**
 * RainbowKit Wallet Provider - enables multi-chain wallet connections
 * Wraps children with Wagmi and RainbowKit providers
 */
export const RainbowKitProvider: React.FC<RainbowKitProviderProps> = ({ children }) => {
  const config = useMemo(() => createRainbowKitConfig(), []);
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProviderComponent>
          {children}
        </RainbowKitProviderComponent>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowKitProvider;
