"use client";

import React, { ReactNode, useEffect } from "react";
import { initializeAppKit } from "@/app/lib/appkit-init";

interface ReownWalletProviderProps {
  children: ReactNode;
}

/**
 * Reown Wallet Provider - enables WalletConnect wallet connections
 * Initializes AppKit on client mount and renders the modal
 */
export const ReownWalletProvider: React.FC<ReownWalletProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize AppKit when component mounts
    initializeAppKit();
  }, []);

  return (
    <>
      {children}
      {/* AppKit Modal - this is where the wallet connection UI will render */}
      {/* @ts-ignore */}
      <w3m-modal />
    </>
  );
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
  return {
    openModal: () => {
      try {
        const { useAppKit } = require("@reown/appkit/react");
        const { open } = useAppKit();
        open?.();
      } catch (error) {
        console.warn("Failed to open modal:", error);
      }
    },
  };
}

export default ReownWalletProvider;
