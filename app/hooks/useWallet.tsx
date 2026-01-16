"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  privateKey: string | null;
  networkId: string;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface WalletContextType {
  wallet: WalletState;
  connectWallet: (privateKey?: string) => Promise<void>;
  disconnectWallet: () => void;
  importWallet: (privateKey: string) => Promise<void>;
  exportWallet: () => string | null;
  updateBalance: (balance: string) => void;
  setError: (error: string | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    privateKey: null,
    networkId: "base-sepolia",
    balance: null,
    isLoading: false,
    error: null,
  });

  const connectWallet = useCallback(async (privateKey?: string) => {
    setWallet((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Call backend to initialize embedded wallet
      const response = await fetch("/api/wallet/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ privateKey }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect wallet");
      }

      const data = await response.json();

      setWallet((prev) => ({
        ...prev,
        address: data.address,
        isConnected: true,
        networkId: data.networkId,
        privateKey: privateKey || null,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setWallet((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      address: null,
      isConnected: false,
      privateKey: null,
      networkId: "base-sepolia",
      balance: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const importWallet = useCallback(async (privateKey: string) => {
    await connectWallet(privateKey);
  }, [connectWallet]);

  const exportWallet = useCallback(() => {
    if (!wallet.privateKey) {
      console.warn("No private key available for export");
      return null;
    }
    return wallet.privateKey;
  }, [wallet.privateKey]);

  const updateBalance = useCallback((balance: string) => {
    setWallet((prev) => ({ ...prev, balance }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setWallet((prev) => ({ ...prev, error }));
  }, []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        importWallet,
        exportWallet,
        updateBalance,
        setError,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
};

export default WalletProvider;
