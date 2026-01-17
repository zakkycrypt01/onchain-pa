"use client";

import React from "react";
import { ThemeCustomizer } from "@/app/components/ThemeCustomizer";
import { ClientWrapper } from "@/app/components/ClientWrapper";
import { useFarcasterUser } from "@/app/hooks/useFarcasterUser";
import { useUserContext } from "@/app/providers/UserContext";
import Link from "next/link";

export default function SettingsPage() {
  const { user, isLoading: userLoading } = useFarcasterUser();
  const { currentUser } = useUserContext();

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/terminal"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6"
        >
          ← Back to Terminal
        </Link>
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">⚙️ Settings</h1>
        <p className="text-gray-400">Customize your terminal experience</p>
      </div>

      {/* User Info Section */}
      {currentUser && (
        <div className="max-w-4xl mx-auto mb-8 p-6 bg-gray-900 rounded-lg border border-green-500/30">
          <h2 className="text-lg font-bold text-green-400 mb-4">👤 User Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Display Name:</span>
              <p className="text-green-300 font-mono">{currentUser.displayName || currentUser.username || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-400">User ID (FID):</span>
              <p className="text-green-300 font-mono">{currentUser.userId}</p>
            </div>
            {currentUser.walletAddress && (
              <div className="md:col-span-2">
                <span className="text-gray-400">Wallet Address:</span>
                <p className="text-green-300 font-mono break-all">{currentUser.walletAddress}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Theme Customizer */}
        <section>
          <ThemeCustomizer />
        </section>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* About */}
          <div className="p-6 bg-gray-900 rounded-lg border border-cyan-500/30">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">ℹ️ About</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Terminal UI v1.0.4</strong></p>
              <p className="text-gray-400">Advanced command-line interface with customizable themes, smart automation, and AgentKit integration.</p>
              <p className="text-xs text-gray-500 mt-4">Last updated: January 17, 2026</p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="p-6 bg-gray-900 rounded-lg border border-cyan-500/30">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">💡 Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Use <code className="bg-gray-800 px-2 py-1 rounded text-cyan-300">↑/↓</code> to navigate history</li>
              <li>• Type <code className="bg-gray-800 px-2 py-1 rounded text-cyan-300">help</code> for commands</li>
              <li>• Customize colors in Theme Customizer</li>
              <li>• Settings persist in your browser</li>
            </ul>
          </div>
        </div>

        {/* Terminal Commands Help */}
        <div className="p-6 bg-gray-900 rounded-lg border border-cyan-500/30">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">⌨️ Terminal Commands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p className="font-mono text-cyan-300 mb-1">bal</p>
              <p className="text-gray-400">Check wallet balance</p>
            </div>
            <div>
              <p className="font-mono text-cyan-300 mb-1">wallet</p>
              <p className="text-gray-400">Get wallet details</p>
            </div>
            <div>
              <p className="font-mono text-cyan-300 mb-1">tx</p>
              <p className="text-gray-400">View transaction history</p>
            </div>
            <div>
              <p className="font-mono text-cyan-300 mb-1">send</p>
              <p className="text-gray-400">Send tokens to address</p>
            </div>
            <div>
              <p className="font-mono text-cyan-300 mb-1">swap</p>
              <p className="text-gray-400">Swap tokens on DEX</p>
            </div>
            <div>
              <p className="font-mono text-cyan-300 mb-1">clear</p>
              <p className="text-gray-400">Clear terminal history</p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="p-6 bg-gray-900 rounded-lg border border-cyan-500/30">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">🆘 Need Help?</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <p><strong>Theme won't save?</strong> Clear your browser cache and try again.</p>
            <p><strong>Commands not working?</strong> Make sure you're connected to the internet and check the agent API.</p>
            <p><strong>Wallet not showing?</strong> You need to be running this as a Farcaster Mini App to see wallet integration.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-12 pt-6 border-t border-cyan-500/20 text-center text-gray-500 text-sm">
        <p>Terminal UI Settings • All preferences saved locally in your browser</p>
      </div>
    </div>
    </ClientWrapper>
  );
}
