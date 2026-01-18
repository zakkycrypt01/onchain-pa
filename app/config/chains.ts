import { base, baseSepolia } from "@wagmi/chains";

export const SUPPORTED_CHAINS = [base, baseSepolia];
export const MAINNET_CHAINS = [base];
export const TESTNET_CHAINS = [baseSepolia];

export const getChainName = (chainId: number): string => {
  switch (chainId) {
    case base.id:
      return "Base";
    case baseSepolia.id:
      return "Base Sepolia";
    default:
      return "Unknown";
  }
};

export default SUPPORTED_CHAINS;
