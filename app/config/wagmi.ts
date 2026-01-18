import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "@wagmi/chains";

export const getWagmiConfig = () => {
  return getDefaultConfig({
    appName: "Onchain PA",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
    chains: [base, baseSepolia],
    ssr: false,
  });
};
