"use client";

import React, { ReactNode } from "react";
import {
  RainbowKitProvider as RainbowKitProviderComponent,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "@wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

// This file contains the RainbowKit wallet provider setup
// Migration from Reown/AppKit to RainbowKit

interface RainbowKitProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "Onchain PA",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  chains: [base, baseSepolia],
  ssr: false, // NextJS SSR not supported for wallet connections
});

/**
 * RainbowKit Wallet Provider - enables multi-chain wallet connections
 * Wraps children with Wagmi and RainbowKit providers
 */
export const RainbowKitProvider: React.FC<RainbowKitProviderProps> = ({ children }) => {
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
