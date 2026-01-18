"use client";

import { base, baseSepolia } from "@wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export function createRainbowKitConfig() {
  return getDefaultConfig({
    appName: "Onchain PA",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
    chains: [base, baseSepolia],
    ssr: false,
  });
}
