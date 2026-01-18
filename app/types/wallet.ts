import { Address } from "viem";

export type WalletProvider = "farcaster" | "rainbowkit" | "none";

export interface WalletSession {
  address: Address;
  displayName?: string;
  provider: WalletProvider;
  fid?: number;
  username?: string;
}

export interface RainbowKitConfig {
  appName: string;
  projectId: string;
  chains: string[];
  ssr: boolean;
}
