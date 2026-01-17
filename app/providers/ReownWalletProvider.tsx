"use client";

import React, { ReactNode, useEffect } from "react";
import { initializeAppKit } from "@/app/lib/appkit-init";

interface ReownWalletProviderProps {
  children: ReactNode;
}

/**
 * Reown Wallet Provider - enables WalletConnect wallet connections
 * Initializes AppKit on client mount
 */
export const ReownWalletProvider: React.FC<ReownWalletProviderProps> = ({ children }) => {
  useEffect(() => {
    initializeAppKit();
  }, []);

  return <>{children}</>;
};

/**
 * Hook to use the Reown wallet connection
 * Returns wallet address and connection state
 */
export function useReownWallet() {
  try {
    // Import hooks after AppKit is initialized
    const { useAppKitAccount, useAppKitProvider } = require("@reown/appkit/react");
    const { address, isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider("eip155");

    return {
      address,
      isConnected,
      walletProvider,
    };
  } catch (error) {
    console.warn("Reown wallet not available:", error);
    return {
      address: undefined,
      isConnected: false,
      walletProvider: undefined,
    };
  }
}

/**
 * Hook to open the wallet modal
 */
export function useReownModal() {
  try {
    // Import hook after AppKit is initialized
    const { useAppKit } = require("@reown/appkit/react");
    const appKit = useAppKit();
    
    if (!appKit?.open) {
      throw new Error("AppKit not properly initialized");
    }

    return {
      openModal: () => appKit.open(),
    };
  } catch (error) {
    console.warn("Reown modal not available:", error);
    return {
      openModal: () => alert("Please connect a wallet using the modal"),
    };
  }
}

export default ReownWalletProvider;
