"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

/**
 * WalletConnect Provider
 * 
 * Manages wallet connection for users accessing the app outside of Farcaster Mini App
 * Uses wagmi + WalletConnect to allow users to connect with MetaMask, WalletConnect, etc.
 */

export interface ConnectedWallet {
  address: string;
  chain: "base-sepolia" | "base" | "ethereum";
  chainId: number;
  isConnected: boolean;
  balance?: string;
  displayName?: string; // ENS or truncated address
}

interface WalletContextType {
  wallet: ConnectedWallet | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
  getBalance: () => Promise<string | null>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

export interface WalletProviderProps {
  children: ReactNode;
  projectId?: string; // WalletConnect project ID
}

/**
 * WalletProvider Component
 * 
 * Wraps the app to provide wallet connection context
 * This is used for users who are NOT accessing via Farcaster Mini App
 */
export function WalletProvider({ children, projectId }: WalletProviderProps) {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Check if window.ethereum exists (MetaMask, etc.)
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const provider = (window as any).ethereum;
        const accounts = await provider.request({ method: "eth_accounts" });

        if (accounts.length > 0) {
          const chainId = await provider.request({ method: "eth_chainId" });
          const address = accounts[0];

          setWallet({
            address,
            chainId: parseInt(chainId, 16),
            chain: getChainName(parseInt(chainId, 16)),
            isConnected: true,
          });
        }
      }
    } catch (err) {
      console.error("Error checking connection:", err);
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("Please install MetaMask or another Web3 wallet");
      }

      const provider = (window as any).ethereum;

      // Request accounts
      const accounts = await provider.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      if (accounts.length === 0) {
        const accountsArray = await provider.request({ method: "eth_requestAccounts" });
        if (accountsArray.length === 0) {
          throw new Error("No accounts found");
        }
      }

      // Get the connected account
      const accountsArray = await provider.request({ method: "eth_accounts" });
      const address = accountsArray[0];

      // Get chain ID
      const chainId = await provider.request({ method: "eth_chainId" });
      const chainIdNum = parseInt(chainId, 16);

      // Switch to Base Sepolia if not on it
      if (chainIdNum !== 84532) {
        // 84532 is Base Sepolia chain ID
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x14a34" }], // 0x14a34 = 84532 in hex
          });
        } catch (switchError: any) {
          // If chain doesn't exist, add it
          if (switchError.code === 4902) {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x14a34",
                  chainName: "Base Sepolia",
                  rpcUrls: ["https://sepolia.base.org"],
                  nativeCurrency: {
                    name: "Ethereum",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.basescan.org"],
                },
              ],
            });
          }
        }
      }

      // Get balance
      const balanceWei = await provider.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      const balanceEth = (parseInt(balanceWei, 16) / 1e18).toFixed(4);

      setWallet({
        address,
        chainId: chainIdNum,
        chain: getChainName(chainIdNum),
        isConnected: true,
        balance: balanceEth,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(errorMessage);
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      // Clear wallet state
      setWallet(null);
      setError(null);

      // Note: Most wallet providers don't have a disconnect method
      // The user would need to disconnect from the wallet extension itself
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to disconnect";
      setError(errorMessage);
    }
  };

  const switchChain = async (chainId: number) => {
    try {
      if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("Web3 wallet not found");
      }

      const provider = (window as any).ethereum;
      const chainIdHex = "0x" + chainId.toString(16);

      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });

      setWallet((prev) =>
        prev
          ? {
              ...prev,
              chainId,
              chain: getChainName(chainId),
            }
          : null
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to switch chain";
      setError(errorMessage);
      throw err;
    }
  };

  const getBalance = async () => {
    try {
      if (!wallet || typeof window === "undefined" || !(window as any).ethereum) {
        return null;
      }

      const provider = (window as any).ethereum;
      const balanceWei = await provider.request({
        method: "eth_getBalance",
        params: [wallet.address, "latest"],
      });

      const balanceEth = (parseInt(balanceWei, 16) / 1e18).toFixed(4);

      setWallet((prev) =>
        prev
          ? {
              ...prev,
              balance: balanceEth,
            }
          : null
      );

      return balanceEth;
    } catch (err) {
      console.error("Error getting balance:", err);
      return null;
    }
  };

  const value: WalletContextType = {
    wallet,
    isConnecting,
    error,
    connect,
    disconnect,
    switchChain,
    getBalance,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

/**
 * Helper function to get chain name from chain ID
 */
function getChainName(chainId: number): "base-sepolia" | "base" | "ethereum" {
  switch (chainId) {
    case 84532: // Base Sepolia
      return "base-sepolia";
    case 8453: // Base mainnet
      return "base";
    case 1: // Ethereum mainnet
      return "ethereum";
    default:
      return "base-sepolia";
  }
}
