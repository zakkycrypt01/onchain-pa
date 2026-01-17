import React, { ReactNode } from "react";
import { createAppKit, useAppKit, useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";

// Configure networks
const networks: any = [
  {
    id: 8453,
    name: "Base Mainnet",
    currency: "ETH",
    explorerUrl: "https://basescan.org",
    rpcUrl: "https://mainnet.base.org",
  },
  {
    id: 84532,
    name: "Base Sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia.basescan.org",
    rpcUrl: "https://sepolia.base.org",
  },
];

// Get projectId from WalletConnect Cloud (https://cloud.walletconnect.com)
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

if (!projectId) {
  console.warn(
    "WalletConnect Project ID not found. Please set NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID in .env.local"
  );
}

// Create the AppKit
createAppKit({
  adapters: [],
  networks,
  projectId,
  metadata: {
    name: "Onchain PA",
    description: "AI-powered onchain personal assistant with Base Mini App support",
    url: "https://onchain-pa.vercel.app",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
});

interface ReownWalletProviderProps {
  children: ReactNode;
}

export const ReownWalletProvider: React.FC<ReownWalletProviderProps> = ({ children }) => {
  return <>{children}</>;
};

/**
 * Hook to use the Reown wallet connection
 * Returns wallet address and connection state
 */
export function useReownWallet() {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  return {
    address,
    isConnected,
    walletProvider,
  };
}

/**
 * Hook to open the wallet modal
 */
export function useReownModal() {
  const { open } = useAppKit();

  return {
    openModal: open,
  };
}

export default ReownWalletProvider;
