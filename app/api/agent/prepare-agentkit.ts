import {
  AgentKit,
  cdpApiActionProvider,
  cdpSmartWalletActionProvider,
  erc20ActionProvider,
  pythActionProvider,
  EmbeddedWalletProvider,
  walletActionProvider,
  WalletProvider,
  wethActionProvider,
  x402ActionProvider,
} from "@coinbase/agentkit";

/**
 * AgentKit Integration Route
 *
 * This file is your gateway to integrating AgentKit with your product.
 * It uses Embedded Wallet Provider for client-side key management.
 *
 * Key Components:
 * 1. Embedded WalletProvider Setup:
 *    - Client-side wallet management
 *    - Private keys never leave the browser
 *    - Learn more: https://github.com/coinbase/agentkit/tree/main/typescript/agentkit#embedded-wallet-provider
 *
 * 2. ActionProviders Setup:
 *    - Defines the specific actions your agent can perform
 *    - Choose from built-in providers or create custom ones:
 *      - Built-in: https://github.com/coinbase/agentkit/tree/main/typescript/agentkit#action-providers
 *      - Custom: https://github.com/coinbase/agentkit/tree/main/typescript/agentkit#creating-an-action-provider
 *
 * # Next Steps:
 * - Explore the AgentKit README: https://github.com/coinbase/agentkit
 * - Experiment with different LLM configurations
 * - Fine-tune agent parameters for your use case
 *
 * ## Want to contribute?
 * Join us in shaping AgentKit! Check out the contribution guide:
 * - https://github.com/coinbase/agentkit/blob/main/CONTRIBUTING.md
 * - https://discord.gg/CDP
 */

/**
 * Prepares the AgentKit and WalletProvider using Embedded Wallet.
 *
 * @function prepareAgentkitAndWalletProvider
 * @param userPrivateKey - Optional private key for wallet recovery (Hex format)
 * @returns {Promise<{ agentkit: AgentKit, walletProvider: WalletProvider }>} The initialized agent with embedded wallet.
 *
 * @description Handles agent setup with client-side wallet management
 *
 * @throws {Error} If the agent initialization fails.
 */
export async function prepareAgentkitAndWalletProvider(userPrivateKey?: string): Promise<{
  agentkit: AgentKit;
  walletProvider: WalletProvider;
}> {
  if (!process.env.NEXT_PUBLIC_CDP_API_KEY_ID) {
    throw new Error(
      "I need NEXT_PUBLIC_CDP_API_KEY_ID in your .env file to connect to the Coinbase Developer Platform using embedded wallet.",
    );
  }

  try {
    // Initialize Embedded Wallet Provider for client-side key management
    // https://docs.cdp.coinbase.com/agentkit/docs/wallet-management#embedded-wallet
    const walletProvider = await EmbeddedWalletProvider.configure({
      apiKeyId: process.env.NEXT_PUBLIC_CDP_API_KEY_ID,
      networkId: process.env.NEXT_PUBLIC_NETWORK_ID || "base-sepolia",
      privateKey: userPrivateKey, // Optional: pass existing private key to recover wallet
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
    });

    // Initialize AgentKit: https://docs.cdp.coinbase.com/agentkit/docs/agent-actions
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
    console.error("Error initializing agent with embedded wallet:", error);
    throw new Error("Failed to initialize agent with embedded wallet");
  }
}
