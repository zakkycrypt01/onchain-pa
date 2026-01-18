"use client";

import { base, sepolia } from "@wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export function createRainbowKitConfig() {
  return getDefaultConfig({
    appName: "Onchain PA",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
    chains: [base, sepolia],
    ssr: false,
  });
}
