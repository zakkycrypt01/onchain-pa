'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/contexts/UserContext';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, updateUser } = useUser();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="w-full h-screen bg-gray-950 flex items-center justify-center" style={{
        background: "linear-gradient(135deg, #0a0e27 0%, #16213e 100%)"
      }}>
        <div className="text-center">
          <h1 className="text-2xl text-cyan-400 mb-4">Not Logged In</h1>
          <Link href="/terminal" className="text-green-400 hover:text-green-300">
            Go back to terminal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-950 text-white font-mono" style={{
      background: "linear-gradient(135deg, #0a0e27 0%, #16213e 100%)"
    }}>
      {/* Header */}
      <div className="bg-gray-900 border-b border-cyan-500/50 px-4 py-3">
        <Link href="/terminal" className="text-cyan-400 hover:text-cyan-300 text-sm">
          ← Back to Terminal
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-8">👤 User Account</h1>

        <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6 space-y-6">
          {/* User Info */}
          <div className="space-y-4">
            <h2 className="text-xl text-cyan-300 font-bold">Account Information</h2>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username</label>
              <div className="bg-gray-800 border border-cyan-500/30 rounded px-3 py-2 text-white">
                {user.username}
              </div>
            </div>

            {user.email && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <div className="bg-gray-800 border border-cyan-500/30 rounded px-3 py-2 text-white">
                  {user.email}
                </div>
              </div>
            )}

            {user.walletAddress && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Wallet Address</label>
                <div className="bg-gray-800 border border-cyan-500/30 rounded px-3 py-2 text-white font-mono text-xs break-all">
                  {user.walletAddress}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">Member Since</label>
              <div className="bg-gray-800 border border-cyan-500/30 rounded px-3 py-2 text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">User ID</label>
              <div className="bg-gray-800 border border-cyan-500/30 rounded px-3 py-2 text-white font-mono text-xs">
                {user.id}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-cyan-500/30 pt-6 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="border-t border-cyan-500/30 pt-6">
            <h3 className="text-lg text-cyan-300 font-bold mb-4">Your Activity</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800 border border-cyan-500/30 rounded p-4 text-center">
                <div className="text-2xl text-green-400 font-bold">
                  {JSON.parse(localStorage.getItem(`commands_${user.id}`) || '[]').length - 1}
                </div>
                <div className="text-xs text-gray-400 mt-2">Commands Run</div>
              </div>
              <div className="bg-gray-800 border border-cyan-500/30 rounded p-4 text-center">
                <div className="text-2xl text-cyan-400 font-bold">--</div>
                <div className="text-xs text-gray-400 mt-2">Current Session</div>
              </div>
              <div className="bg-gray-800 border border-cyan-500/30 rounded p-4 text-center">
                <div className="text-2xl text-yellow-400 font-bold">Active</div>
                <div className="text-xs text-gray-400 mt-2">Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
