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

  useEffect(() => {
    // Check if AppKit is ready
    const checkAppKit = () => {
      try {
        const { useAppKit } = require("@reown/appkit/react");
        setIsReady(true);
      } catch (error) {
        console.warn("AppKit not ready yet");
      }
    };

    // Try immediately
    checkAppKit();

    // Also try after a short delay for initialization
    const timer = setTimeout(checkAppKit, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    try {
      const { useAppKit } = require("@reown/appkit/react");
      const appKit = useAppKit();
      appKit?.open?.();
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
        !isReady ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isReady ? "Connect Wallet" : "Loading..."}
    </button>
  );
};

export default ConnectWalletButton;
