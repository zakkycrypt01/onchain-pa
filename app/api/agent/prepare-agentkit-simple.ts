import { Coinbase, AgentKit } from "@coinbase/agentkit";
import {
  cdpApiActionProvider,
  cdpSmartWalletActionProvider,
  erc20ActionProvider,
  pythActionProvider,
  walletActionProvider,
  wethActionProvider,
  x402ActionProvider,
} from "@coinbase/agentkit";

export async function prepareAgentkitAndWalletProvider() {
  if (!process.env.CDP_API_KEY_NAME) {
    throw new Error("CDP_API_KEY_NAME is required");
  }
  if (!process.env.CDP_API_KEY_PRIVATE_KEY) {
    throw new Error("CDP_API_KEY_PRIVATE_KEY is required");
  }

  Coinbase.apiKeyName = process.env.CDP_API_KEY_NAME;
  Coinbase.apiKeyPrivateKey = process.env.CDP_API_KEY_PRIVATE_KEY;
  Coinbase.networkId = "base-sepolia";

  const agentkit = new AgentKit({
    actionProviders: [
      cdpApiActionProvider(),
      cdpSmartWalletActionProvider(),
      erc20ActionProvider(),
      walletActionProvider(),
      wethActionProvider(),
      pythActionProvider(),
      x402ActionProvider(),
    ],
  });

  const walletProvider = agentkit.walletProvider;
  if (!walletProvider) {
    throw new Error("Failed to initialize wallet provider");
  }

  return { agentkit, walletProvider };
}
