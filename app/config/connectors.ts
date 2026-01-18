export const CONNECTOR_CONFIG = {
  rainbowkit: {
    enabled: true,
    chains: ["base", "baseSepolia"],
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  },
};

export default CONNECTOR_CONFIG;
