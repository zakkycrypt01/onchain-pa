import React from "react";

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
    <>
      {/* AppKit Modal Button - use the built-in w3m-connect-button */}
      <w3m-connect-button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        style={{
          display: "inline-block",
          padding: sizeClasses[size].includes("px-3") ? "0.25rem 0.75rem" : sizeClasses[size].includes("px-4") ? "0.5rem 1rem" : "0.75rem 1.5rem",
        }}
      />
    </>
  );
};

export default ConnectWalletButton;
