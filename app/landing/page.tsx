"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "@/app/providers/WalletProvider";
import { useFarcasterUser } from "@/app/hooks/useFarcasterUser";

export default function LandingPage() {
  const router = useRouter();
  const { wallet, connect, isConnecting, error } = useWallet();
  const { user, isInMiniApp } = useFarcasterUser();
  const [showError, setShowError] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setShowError(false);
      await connect();
    } catch (err) {
      setShowError(true);
      console.error("Connection error:", err);
    }
  };

  const handleLaunchApp = () => {
    if (isInMiniApp || wallet?.isConnected) {
      router.push("/terminal");
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-mono overflow-hidden">
      {/* Grid Pattern Background */}
      <div
        className="fixed inset-0 z-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #137fec 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-6 lg:px-12 py-6 border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Onchain PA</h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/70 hover:text-primary transition-colors text-sm">
              Features
            </a>
            <a href="#docs" className="text-white/70 hover:text-primary transition-colors text-sm">
              Docs
            </a>
            <a href="#github" className="text-white/70 hover:text-primary transition-colors text-sm">
              GitHub
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {wallet?.isConnected ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-white/70">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </div>
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              </div>
            ) : isInMiniApp ? (
              <div className="text-sm text-primary">Farcaster Connected</div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </header>

        {/* Error Message */}
        {showError && error && (
          <div className="mx-6 lg:mx-12 mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 lg:px-12 py-20 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            The Onchain <span className="text-primary italic">AI Terminal</span>
          </h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
            Deploy, trade, and manage assets via a high-performance CLI agent. Autonomous, efficient, and direct to the protocol.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={handleLaunchApp}
              disabled={!wallet?.isConnected && !isInMiniApp}
              className="px-8 py-3 bg-primary text-white font-bold rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInMiniApp ? "Launch App" : wallet?.isConnected ? "Launch App" : "Connect to Launch"}
            </button>
            <a
              href="#"
              className="px-8 py-3 border border-white/30 text-white font-bold rounded hover:border-primary hover:text-primary transition-colors"
            >
              Learn More
            </a>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Execute commands at protocol speed with minimal latency",
              },
              {
                icon: "🔒",
                title: "Secure Wallets",
                description: "Multi-signature smart wallets with CDP integration",
              },
              {
                icon: "🎯",
                title: "AI Powered",
                description: "Natural language processing for complex transactions",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-white/5 border border-white/10 rounded hover:border-primary/50 transition-colors"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Connection Status */}
        <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16 border-t border-white/10">
          <h3 className="text-2xl font-bold mb-8 text-center">Connection Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Farcaster Option */}
            <div className="p-8 bg-white/5 border border-white/10 rounded">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 text-primary">👤</div>
                <h4 className="text-xl font-bold">Farcaster Mini App</h4>
                {isInMiniApp && (
                  <div className="ml-auto text-green-400 text-sm font-bold">✓ Connected</div>
                )}
              </div>
              <p className="text-white/60 text-sm mb-4">
                Access via Farcaster frame with automatic Farcaster account integration and Base Mini App wallet.
              </p>
              <ul className="text-white/60 text-sm space-y-2 mb-4">
                <li>✓ One-click access</li>
                <li>✓ Farcaster account integration</li>
                <li>✓ Auto wallet detection</li>
                <li>✓ Per-user session management</li>
              </ul>
            </div>

            {/* WalletConnect Option */}
            <div className="p-8 bg-white/5 border border-white/10 rounded">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 text-primary">🔗</div>
                <h4 className="text-xl font-bold">WalletConnect</h4>
                {wallet?.isConnected && (
                  <div className="ml-auto text-green-400 text-sm font-bold">✓ Connected</div>
                )}
              </div>
              <p className="text-white/60 text-sm mb-4">
                Connect with MetaMask, WalletConnect, or any Web3 wallet provider for standalone access.
              </p>
              <ul className="text-white/60 text-sm space-y-2 mb-4">
                <li>✓ MetaMask support</li>
                <li>✓ Multi-chain support</li>
                <li>✓ Hardware wallet ready</li>
                <li>✓ Standard Web3 integration</li>
              </ul>
              {!wallet?.isConnected && (
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="w-full px-4 py-2 bg-primary text-white font-bold rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-20 py-8 px-6 lg:px-12 text-center text-white/60 text-sm">
          <p>Onchain PA © 2026 • Built with AgentKit and CDP</p>
        </footer>
      </div>
    </div>
  );
}
