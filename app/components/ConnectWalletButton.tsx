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
  return (
    <>
      <style>{`
        w3m-connect-button {
          --w3m-font-family: 'JetBrains Mono', monospace !important;
        }
        
        w3m-connect-button button {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%) !important;
          color: #000 !important;
          border: 1px solid #06b6d4 !important;
          font-weight: 600 !important;
          border-radius: 0.5rem !important;
          transition: all 0.3s ease !important;
          font-family: 'JetBrains Mono', monospace !important;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.3) !important;
        }
        
        w3m-connect-button button:hover {
          background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%) !important;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.5) !important;
          transform: scale(1.05) !important;
        }
        
        w3m-connect-button button:active {
          transform: scale(0.98) !important;
        }
      `}</style>
      {/* @ts-ignore */}
      <w3m-connect-button className={className} />
    </>
  );
};

export default ConnectWalletButton;
