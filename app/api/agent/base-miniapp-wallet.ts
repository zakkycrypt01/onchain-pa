import { WalletProvider } from "@coinbase/agentkit";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Base Mini App Wallet Provider
 *
 * This wallet provider integrates with the Farcaster Mini App SDK to use
 * the user's connected wallet from the Base Mini App environment.
 *
 * The user's wallet is accessed through the SDK context and used for
 * transaction signing and wallet operations within the agent.
 */

export interface BaseMiniAppWalletContext {
  fid: number;
  username?: string;
  displayName?: string;
  walletAddress?: string;
  isConnected: boolean;
}

/**
 * Gets the Base Mini App wallet context
 * Retrieves user and wallet information from the Farcaster Mini App SDK
 */
export async function getBaseMiniAppWalletContext(): Promise<BaseMiniAppWalletContext> {
  try {
    const isInMiniApp = await sdk.isInMiniApp();
    
    if (!isInMiniApp) {
      throw new Error("Not running in a Farcaster Mini App");
    }

    const context = await sdk.context;
    
    if (!context?.user) {
      throw new Error("No user context available");
    }

    const { user } = context;
    
    // Extract wallet address from the user context
    const walletAddress = (user as any).wallet?.address;
    
    return {
      fid: user.fid,
      username: user.username,
      displayName: user.displayName,
      walletAddress,
      isConnected: !!walletAddress,
    };
  } catch (error) {
    console.error("Error getting Base Mini App wallet context:", error);
    throw new Error(`Failed to get wallet context: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Creates a wallet provider compatible with AgentKit that uses the Base Mini App wallet
 * 
 * This is a wrapper that adapts the Base Mini App wallet context to work with AgentKit
 */
export async function createBaseMiniAppWalletProvider(): Promise<{
  walletContext: BaseMiniAppWalletContext;
  getWalletAddress: () => string;
  getNetwork: () => { networkId: string; name: string };
  exportWallet: () => Promise<{ address: string; ownerAddress?: string }>;
}> {
  // Get the wallet context from the Base Mini App SDK
  const walletContext = await getBaseMiniAppWalletContext();

  if (!walletContext.walletAddress) {
    throw new Error("No wallet address available in Base Mini App context");
  }

  return {
    walletContext,
    
    /**
     * Get the current wallet address
     */
    getWalletAddress: () => {
      if (!walletContext.walletAddress) {
        throw new Error("Wallet not connected");
      }
      return walletContext.walletAddress;
    },

    /**
     * Get the current network information
     * Base Mini App typically runs on Base Sepolia or Base mainnet
     */
    getNetwork: () => {
      return {
        networkId: "base-sepolia", // Default to Base Sepolia
        name: "Base Sepolia",
      };
    },

    /**
     * Export wallet information
     */
    exportWallet: async () => {
      return {
        address: walletContext.walletAddress!,
        ownerAddress: walletContext.walletAddress,
      };
    },
  };
}

/**
 * Signs a transaction using the Base Mini App wallet
 * 
 * Note: This requires the transaction signing capability to be available
 * through the Farcaster Mini App SDK.
 */
export async function signTransactionWithBaseMiniApp(
  transaction: any,
): Promise<string> {
  try {
    // Check if we're in the mini app and have signing capability
    const isInMiniApp = await sdk.isInMiniApp();
    
    if (!isInMiniApp) {
      throw new Error("Not running in a Farcaster Mini App");
    }

    // The actual signing would be handled by the SDK's transaction capabilities
    // This is a placeholder for the signing mechanism
    // In a real implementation, you would use sdk.actions.signTransaction or similar
    
    const context = await sdk.context;
    if (!context?.user) {
      throw new Error("User context not available in Mini App");
    }

    // Check for wallet address in context.user (may be on different property paths)
    const userContext = context.user as any;
    if (!userContext.wallet?.address) {
      throw new Error("Wallet not available in Mini App context");
    }

    // Return a signed transaction (in real implementation, this would call SDK signing)
    console.log("Transaction signing requested for:", transaction);
    
    // This would need to be implemented based on the actual Base Mini App SDK capabilities
    throw new Error("Transaction signing through Mini App wallet not yet fully implemented");
  } catch (error) {
    console.error("Error signing transaction:", error);
    throw new Error(`Transaction signing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
