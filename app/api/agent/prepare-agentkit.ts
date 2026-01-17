import {
  AgentKit,
  cdpApiActionProvider,
  cdpSmartWalletActionProvider,
  erc20ActionProvider,
  pythActionProvider,
  CdpSmartWalletProvider,
  walletActionProvider,
  WalletProvider,
  wethActionProvider,
  x402ActionProvider,
} from "@coinbase/agentkit";
import * as fs from "fs";
import { createBaseMiniAppWalletProvider, getBaseMiniAppWalletContext } from "./base-miniapp-wallet";

// Commented out viem imports for server-side compatibility
// import { Address, Hex, LocalAccount } from "viem";
// import { privateKeyToAccount } from "viem/accounts";

/**
 * AgentKit Integration Route
 *
 * This file is your gateway to integrating AgentKit with your product.
 * It defines the core capabilities of your agent through WalletProvider
 * and ActionProvider configuration.
 *
 * Key Components:
 * 1. WalletProvider Setup:
 *    - Configures the blockchain wallet integration
 *    - Learn more: https://github.com/coinbase/agentkit/tree/main/typescript/agentkit#evm-wallet-providers
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

// Configure a file to persist the agent's Smart Wallet + Private Key data
const WALLET_DATA_FILE = "wallet_data.txt";

type WalletData = {
  privateKey?: string;
  smartWalletAddress: string;
  ownerAddress?: string;
};

/**
 * Prepares the AgentKit and WalletProvider.
 *
 * @function prepareAgentkitAndWalletProvider
 * @returns {Promise<{ agentkit: AgentKit, walletProvider: WalletProvider }>} The initialized AI agent.
 *
 * @description Handles agent setup
 *
 * @throws {Error} If the agent initialization fails.
 */
export async function prepareAgentkitAndWalletProvider(): Promise<{
  agentkit: AgentKit;
  walletProvider: WalletProvider;
}> {
  if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET) {
    throw new Error(
      "I need both CDP_API_KEY_ID and CDP_API_KEY_SECRET in your .env file to connect to the Coinbase Developer Platform.",
    );
  }

  let walletData: WalletData | null = null;
  let owner: string | undefined = undefined;

  // Read existing wallet data if available
  if (fs.existsSync(WALLET_DATA_FILE)) {
    try {
      walletData = JSON.parse(fs.readFileSync(WALLET_DATA_FILE, "utf8")) as WalletData;
      if (walletData.ownerAddress) owner = walletData.ownerAddress;
      else if (walletData.privateKey) owner = walletData.privateKey;
      else
        console.log(
          `No ownerAddress or privateKey found in ${WALLET_DATA_FILE}, will create a new CDP server account as owner`,
        );
    } catch (error) {
      console.error("Error reading wallet data:", error);
    }
  }

  try {
    // Initialize WalletProvider: https://docs.cdp.coinbase.com/agentkit/docs/wallet-management
    const walletProvider = await CdpSmartWalletProvider.configureWithWallet({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
      networkId: process.env.NETWORK_ID || "base-sepolia",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      owner: owner as any,
      address: walletData?.smartWalletAddress,
      paymasterUrl: process.env.PAYMASTER_URL, // Sponsor transactions: https://docs.cdp.coinbase.com/paymaster/docs/welcome
      rpcUrl: process.env.RPC_URL,
      idempotencyKey: process.env.IDEMPOTENCY_KEY,
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

    // Save wallet data
    if (!walletData) {
      const exportedWallet = await walletProvider.exportWallet();
      fs.writeFileSync(
        WALLET_DATA_FILE,
        JSON.stringify({
          ownerAddress: exportedWallet.ownerAddress,
          smartWalletAddress: exportedWallet.address,
        } as WalletData),
      );
    }

    return { agentkit, walletProvider };
  } catch (error) {
    console.error("Error initializing agent:", error);
    throw new Error("Failed to initialize agent");
  }
}

/**
 * Prepares the AgentKit with Base Mini App Wallet Provider
 *
 * This function initializes AgentKit using the user's wallet from the Farcaster Mini App.
 * It's an alternative to the CDP wallet provider for use within Base Mini App environments.
 *
 * @function prepareAgentkitWithBaseMiniAppWallet
 * @returns {Promise<{ agentkit: AgentKit, walletProvider: any, walletContext: any }>} The initialized agent with Mini App wallet
 * 
 * @throws {Error} If not running in a Mini App or wallet is not connected
 */
export async function prepareAgentkitWithBaseMiniAppWallet(): Promise<{
  agentkit: AgentKit;
  walletProvider: any;
  walletContext: any;
}> {
  if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET) {
    throw new Error(
      "I need both CDP_API_KEY_ID and CDP_API_KEY_SECRET in your .env file to connect to the Coinbase Developer Platform.",
    );
  }

  try {
    // Get wallet context from Base Mini App SDK
    const walletContext = await getBaseMiniAppWalletContext();
    
    if (!walletContext.isConnected) {
      throw new Error("Wallet is not connected in Base Mini App");
    }

    console.log(`[Base Mini App] Connected to wallet: ${walletContext.walletAddress}`);
    console.log(`[Base Mini App] User: ${walletContext.displayName || walletContext.username} (FID: ${walletContext.fid})`);

    // Create a wrapped wallet provider that is compatible with AgentKit
    const baseMiniAppWalletProvider = await createBaseMiniAppWalletProvider();

    // Since AgentKit expects a specific WalletProvider interface, we create a minimal adapter
    // In a production environment, you might want to extend this with actual signing capabilities
    const walletProviderAdapter: any = {
      getWalletAddress: () => baseMiniAppWalletProvider.getWalletAddress(),
      getNetwork: () => baseMiniAppWalletProvider.getNetwork(),
      exportWallet: () => baseMiniAppWalletProvider.exportWallet(),
      // Add any other required methods based on AgentKit's WalletProvider interface
    };

    // Initialize AgentKit with the wallet provider
    // Note: This creates a basic agent without the full AgentKit capabilities
    // For full functionality, you may need to use a custom action provider
    const agentkit = await AgentKit.from({
      walletProvider: walletProviderAdapter as any,
      actionProviders: [
        wethActionProvider(),
        pythActionProvider(),
        walletActionProvider(),
        erc20ActionProvider(),
        x402ActionProvider(),
        // Note: cdpSmartWalletActionProvider and cdpApiActionProvider may not work
        // with the Mini App wallet provider as they expect CDP-specific wallet types
      ],
    });

    return {
      agentkit,
      walletProvider: walletProviderAdapter,
      walletContext,
    };
  } catch (error) {
    console.error("Error initializing agent with Base Mini App wallet:", error);
    throw new Error(
      `Failed to initialize agent with Base Mini App wallet: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Intelligently selects the appropriate wallet provider based on environment
 * 
 * Uses Base Mini App wallet if available, otherwise falls back to CDP wallet
 */
export async function prepareAgentkitAndWalletProviderAuto(): Promise<{
  agentkit: AgentKit;
  walletProvider: WalletProvider | any;
  isBaseMiniApp: boolean;
  walletContext?: any;
}> {
  try {
    // First, try to use Base Mini App wallet if available
    const result = await prepareAgentkitWithBaseMiniAppWallet();
    return {
      ...result,
      isBaseMiniApp: true,
    };
  } catch (miniAppError) {
    console.log("Base Mini App wallet not available, falling back to CDP wallet provider...");
    
    // Fall back to CDP wallet provider
    const result = await prepareAgentkitAndWalletProvider();
    return {
      ...result,
      isBaseMiniApp: false,
    };
  }
}
