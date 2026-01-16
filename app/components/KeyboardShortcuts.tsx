import React from "react";

const KEYBOARD_SHORTCUTS = [
  { keys: "Ctrl+T", description: "List transaction history" },
  { keys: "Ctrl+B", description: "Check balance" },
  { keys: "Ctrl+S", description: "Send transaction" },
  { keys: "Ctrl+W", description: "Wallet details" },
  { keys: "Ctrl+H", description: "Show help" },
  { keys: "Ctrl+C", description: "Clear terminal" },
  { keys: "Ctrl+L", description: "Clear screen" },
  { keys: "Ctrl+/", description: "Show shortcuts" },
  { keys: "↑ / ↓", description: "Navigate history" },
  { keys: "Tab", description: "Autocomplete" },
  { keys: "Ctrl++", description: "Zoom in" },
  { keys: "Ctrl+-", description: "Zoom out" },
];

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-cyan-500/50 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded border border-gray-700 transition-colors"
            >
              <span className="text-sm text-cyan-400 font-mono font-bold">
                {shortcut.keys}
              </span>
              <span className="text-sm text-gray-300">{shortcut.description}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded text-sm text-blue-300">
          💡 Tip: You can also use command aliases like <code className="bg-gray-800 px-2 py-1 rounded">tx</code>, <code className="bg-gray-800 px-2 py-1 rounded">bal</code>, and <code className="bg-gray-800 px-2 py-1 rounded">wallet</code>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
