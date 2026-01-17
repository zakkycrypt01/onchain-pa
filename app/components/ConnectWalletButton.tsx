"use client";

import React, { useState, useEffect } from "react";

interface ConnectWalletButtonProps {
  className?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  className = "",
  variant = "primary",
  size = "md",
}) => {
  const [isReady, setIsReady] = useState(false);
  const [appKit, setAppKit] = useState<any>(null);

  useEffect(() => {
    // Wait for AppKit to be initialized
    const waitForAppKit = async () => {
      let attempts = 0;
      const maxAttempts = 20; // 2 seconds total

      while (attempts < maxAttempts) {
        try {
          const appKitModule = await import("@reown/appkit");
          const modal = (appKitModule as any).modal;

          if (modal) {
            setAppKit(modal);
            setIsReady(true);
            console.log("[ConnectWalletButton] AppKit modal ready");
            break;
          }
        } catch (error) {
          // AppKit not ready yet
        }

        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Also try accessing via window
      if (attempts === maxAttempts) {
        try {
          const w3mModal = (window as any).w3mModal || (window as any).w3m;
          if (w3mModal) {
            setAppKit(w3mModal);
            setIsReady(true);
            console.log("[ConnectWalletButton] AppKit found via window");
          }
        } catch (error) {
          console.warn("[ConnectWalletButton] AppKit not found", error);
        }
      }
    };

    waitForAppKit();
  }, []);

  const handleClick = async () => {
    try {
      // Try direct modal open
      const modal = (window as any).w3mModal;
      if (modal?.open) {
        modal.open();
        return;
      }

      // Fallback: try via appKit state
      if (appKit?.open) {
        appKit.open();
        return;
      }

      // Last resort: try dynamic import
      try {
        const appKitModule = await import("@reown/appkit");
        const modal = (appKitModule as any).modal;
        if (modal?.open) {
          modal.open();
          return;
        }
      } catch (e) {
        console.error("Failed to import AppKit:", e);
      }

      alert("Failed to open wallet connect. Please refresh the page.");
    } catch (error) {
      console.error("Failed to open wallet modal:", error);
      alert("Failed to open wallet connect. Please refresh the page.");
    }
  };

  const baseClasses = "font-mono font-semibold rounded transition-all cursor-pointer";

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    secondary: "bg-gray-700 hover:bg-gray-600 text-cyan-400 border border-cyan-400",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isReady}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        !isReady ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
      }`}
    >
      {isReady ? "Connect Wallet" : "Loading..."}
    </button>
  );
};

export default ConnectWalletButton;
