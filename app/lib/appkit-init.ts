"use client";

import { createAppKit } from "@reown/appkit";
import { baseSepolia, base } from "@reown/appkit/networks";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

let isInitialized = false;

/**
 * Initialize AppKit globally
 * This must be called before any AppKit hooks are used
 */
export function initializeAppKit() {
  if (isInitialized || !projectId) {
    return;
  }

  try {
    createAppKit({
      adapters: [],
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
    console.log("[AppKit] Initialized successfully");
  } catch (error) {
    console.error("[AppKit] Initialization failed:", error);
  }
}

/**
 * Check if AppKit is initialized
 */
export function isAppKitInitialized() {
  return isInitialized;
}
