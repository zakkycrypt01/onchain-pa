import React from "react";
import { useReownModal } from "@/app/providers/ReownWalletProvider";

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
  const { openModal } = useReownModal();

  const baseClasses = "font-mono font-semibold rounded transition-all";

  const variantClasses = {
    primary: "bg-cyan-500 hover:bg-cyan-600 text-black",
    secondary: "bg-gray-700 hover:bg-gray-600 text-cyan-400 border border-cyan-400",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={() => openModal()}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      Connect Wallet
    </button>
  );
};

export default ConnectWalletButton;
