'use client';

import React, { useState } from 'react';
import { useUser } from '@/app/contexts/UserContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    try {
      login(username, email || undefined);
      setUsername('');
      setEmail('');
      onClose();
    } catch (err) {
      setError('Failed to login. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-cyan-500/50 rounded-lg p-6 w-96 shadow-2xl">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Welcome to Terminal PA</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-gray-800 border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-gray-800 border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
