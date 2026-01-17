"use client";

import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { baseSepolia, base } from "@reown/appkit/networks";
import { ethers } from "ethers";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

let isInitialized = false;

/**
 * Initialize AppKit globally
 * This must be called before any AppKit hooks are used
 */
export function initializeAppKit() {
  if (isInitialized || !projectId) {
    if (!projectId) {
      console.warn("[AppKit] No project ID found - wallet connect disabled");
    }
    return;
  }

  try {
    // Create ethers adapter
    const ethersAdapter = new EthersAdapter({
      signerProvider: typeof window !== "undefined" ? new ethers.BrowserProvider(window.ethereum as any) : undefined,
    });

    const kit = createAppKit({
      adapters: [ethersAdapter as any],
      networks: [base, baseSepolia],
      projectId,
      metadata: {
        name: "Onchain PA",
        description: "AI-powered onchain personal assistant with Base Mini App support",
        url: typeof window !== "undefined" ? window.location.origin : "https://onchain-pa.vercel.app",
        icons: ["https://avatars.githubusercontent.com/u/37784886"],
      },
    });

    isInitialized = true;
    console.log("[AppKit] Initialized successfully with ethers adapter");
    return kit;
  } catch (error) {
    console.error("[AppKit] Initialization failed:", error);
    isInitialized = false;
  }
}

/**
 * Check if AppKit is initialized
 */
export function isAppKitInitialized() {
  return isInitialized;
}
