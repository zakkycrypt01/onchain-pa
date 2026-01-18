export const RAINBOWKIT_CONFIG = {
  appName: "Onchain PA",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  chains: ["base", "baseSepolia"],
  ssr: false,
};

export default RAINBOWKIT_CONFIG;
