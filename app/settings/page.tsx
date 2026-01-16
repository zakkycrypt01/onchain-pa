"use client";

import React from "react";
import { ThemeCustomizer } from "@/app/components/ThemeCustomizer";
import { ClientWrapper } from "@/app/components/ClientWrapper";
import Link from "next/link";

export default function SettingsPage() {
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
              <p><strong>Terminal UI v1.0</strong></p>
              <p className="text-gray-400">Advanced command-line interface with customizable themes and smart automation.</p>
              <p className="text-xs text-gray-500 mt-4">Last updated: January 17, 2026</p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="p-6 bg-gray-900 rounded-lg border border-cyan-500/30">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">💡 Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Use <code className="bg-gray-800 px-2 py-1 rounded text-cyan-300">Ctrl+T</code> for quick terminal</li>
              <li>• Save themes for quick access</li>
              <li>• Adjust opacity for readability</li>
              <li>• Intensity controls glow effects</li>
            </ul>
          </div>
        </div>

        {/* Help Section */}
        <div className="p-6 bg-gray-900 rounded-lg border border-cyan-500/30">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">🆘 Need Help?</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <p><strong>Theme won't save?</strong> Clear your browser cache and try again.</p>
            <p><strong>Colors look wrong?</strong> Try adjusting the intensity slider or check your display color settings.</p>
            <p><strong>Want more presets?</strong> Create a custom theme and save it for future use!</p>
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
