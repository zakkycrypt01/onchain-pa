import React from "react";
import { formatTimestamp } from "@/app/utils/terminal-utils";
import type { TerminalCommand } from "@/app/hooks/useTerminal";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: TerminalCommand[];
  onSelectCommand: (command: string) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onSelectCommand,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredHistory = React.useMemo(() => {
    return history.filter(
      (cmd) =>
        cmd.type === "command" &&
        cmd.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}>
      <div
        className="fixed left-0 top-0 bottom-0 w-96 bg-gray-900 border-r border-cyan-500/50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Command History</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded font-mono text-sm placeholder-gray-600"
            />
          </div>

          <div className="space-y-2 mb-6">
            {filteredHistory.length === 0 ? (
              <div className="text-gray-400 text-sm text-center py-8">
                {searchTerm ? "No matching commands" : "No history yet"}
              </div>
            ) : (
              filteredHistory
                .slice()
                .reverse()
                .map((cmd, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded cursor-pointer transition-colors border border-gray-700"
                    onClick={() => {
                      onSelectCommand(cmd.content);
                      onClose();
                    }}
                  >
                    <div className="text-cyan-400 text-sm font-mono truncate">
                      {cmd.content}
                    </div>
                    {cmd.timestamp && (
                      <div className="text-gray-500 text-xs mt-1">
                        {formatTimestamp(cmd.timestamp)}
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-mono text-sm transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
