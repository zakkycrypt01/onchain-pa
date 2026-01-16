/**
 * Embedded Wallet Configuration for AgentKit
 * 
 * This module handles embedded wallet setup for client-side wallet management.
 * Embedded wallets provide a better UX by managing private keys on the client side.
 */

import {
  AgentKit,
  cdpApiActionProvider,
  cdpSmartWalletActionProvider,
  erc20ActionProvider,
  pythActionProvider,
  walletActionProvider,
  WalletProvider,
  wethActionProvider,
  x402ActionProvider,
  EmbeddedWalletProvider,
} from "@coinbase/agentkit";

/**
 * Initialize embedded wallet for client-side key management
 * 
 * This setup uses Coinbase's embedded wallet which allows users to:
 * - Control their own keys
 * - Sign transactions in the browser
 * - Maintain full custody of their assets
 * 
 * @param userPrivateKey - Optional user's private key (Hex format: 0x...)
 * @returns AgentKit instance with embedded wallet
 */
export async function initializeEmbeddedWallet(userPrivateKey?: string): Promise<{
  agentkit: AgentKit;
  walletProvider: WalletProvider;
}> {
  if (!process.env.NEXT_PUBLIC_CDP_API_KEY_ID) {
    throw new Error(
      "I need NEXT_PUBLIC_CDP_API_KEY_ID in your .env file for embedded wallet setup.",
    );
  }

  try {
    // Initialize embedded wallet provider
    // This creates a wallet that's managed on the client side
    const walletProvider = await EmbeddedWalletProvider.configure({
      apiKeyId: process.env.NEXT_PUBLIC_CDP_API_KEY_ID,
      networkId: process.env.NEXT_PUBLIC_NETWORK_ID || "base-sepolia",
      privateKey: userPrivateKey,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
    });

    // Initialize AgentKit with embedded wallet provider
    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        pythActionProvider(),
        walletActionProvider(),
        erc20ActionProvider(),
        cdpApiActionProvider(),
        cdpSmartWalletActionProvider(),
        x402ActionProvider(),
      ],
    });

    return { agentkit, walletProvider };
  } catch (error) {
    console.error("Error initializing embedded wallet:", error);
    throw new Error("Failed to initialize embedded wallet");
  }
}

/**
 * Generate a new embedded wallet
 * 
 * Creates a new wallet with a fresh private key that can be stored
 * securely on the client side.
 */
export async function generateNewEmbeddedWallet(): Promise<{
  address: string;
  publicKey: string;
}> {
  try {
    const walletProvider = await EmbeddedWalletProvider.configure({
      apiKeyId: process.env.NEXT_PUBLIC_CDP_API_KEY_ID || "",
      networkId: process.env.NEXT_PUBLIC_NETWORK_ID || "base-sepolia",
    });

    const address = walletProvider.getAddress();
    const network = walletProvider.getNetwork();

    return {
      address,
      publicKey: network.networkId,
    };
  } catch (error) {
    console.error("Error generating new wallet:", error);
    throw new Error("Failed to generate new wallet");
  }
}

/**
 * Import existing wallet from private key
 * 
 * Allows users to import their existing wallets by providing a private key.
 * The private key never leaves the client in embedded wallet mode.
 * 
 * @param privateKey - Hex format private key (0x...)
 */
export async function importWalletFromPrivateKey(privateKey: string): Promise<{
  agentkit: AgentKit;
  walletProvider: WalletProvider;
  address: string;
}> {
  try {
    const { agentkit, walletProvider } = await initializeEmbeddedWallet(privateKey);
    const address = walletProvider.getAddress();

    return {
      agentkit,
      walletProvider,
      address,
    };
  } catch (error) {
    console.error("Error importing wallet:", error);
    throw new Error("Failed to import wallet from private key");
  }
}
