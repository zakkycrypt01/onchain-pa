import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useThemeCustomization } from "@/app/hooks/useThemeCustomization";

export interface TerminalCommand {
  id: string;
  type: "command" | "output" | "error" | "success" | "processing" | "prompt" | "system";
  content: string;
  timestamp?: Date;
  details?: string[];
}

interface TerminalUIProps {
  title?: string;
  version?: string;
  onCommand?: (command: string) => Promise<{ success: boolean; response: string; details?: string[] }>;
  currentUser?: { userId: string; username?: string; displayName?: string; pfpUrl?: string } | null;
}

export const TerminalUI: React.FC<TerminalUIProps> = ({
  title = "ONCHAIN-PA-SESSION",
  version = "v1.0.4",
  onCommand,
  currentUser,
}) => {
  const { theme } = useThemeCustomization();
  const [commands, setCommands] = useState<TerminalCommand[]>([
    {
      id: "0",
      type: "prompt",
      content: `${title} --${version}`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commands]);

  const getCommandHistory = (): string[] => {
    return commands
      .filter((cmd) => cmd.type === "command")
      .map((cmd) => cmd.content)
      .reverse();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const history = getCommandHistory();

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, history.length - 1);
        if (newIndex >= 0 && history[newIndex]) {
          setInput(history[newIndex]);
        }
        return newIndex;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIndex((prevIndex) => {
        const newIndex = prevIndex - 1;
        if (newIndex >= 0 && history[newIndex]) {
          setInput(history[newIndex]);
        } else if (newIndex < 0) {
          setInput("");
        }
        return newIndex;
      });
    }
  };

  const addCommand = (cmd: TerminalCommand) => {
    setCommands((prev) => [...prev, cmd]);
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userCommand = input.trim();
    
    // Check if it's a clear command
    const baseCommand = userCommand.split(/\s+/)[0].toLowerCase();
    if (baseCommand === "clear") {
      setCommands([
        {
          id: "0",
          type: "prompt",
          content: `${title} --${version}`,
        },
      ]);
      setInput("");
      return;
    }

    addCommand({
      id: Date.now().toString(),
      type: "command",
      content: userCommand,
      timestamp: new Date(),
    });

    setInput("");
    setIsProcessing(true);

    if (onCommand) {
      try {
        const result = await onCommand(userCommand);
        
        // Split long responses into chunks for better readability
        const content = result.response || "";
        const lines = content.split('\n').filter(line => line.trim());
        const details = result.details || [];
        
        addCommand({
          id: (Date.now() + 1).toString(),
          type: result.success ? "success" : "error",
          content: lines[0] || content, // First line as main content
          details: lines.slice(1).concat(details), // Rest as details
          timestamp: new Date(),
        });
      } catch (error) {
        addCommand({
          id: (Date.now() + 2).toString(),
          type: "error",
          content: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date(),
        });
      }
    }

    setIsProcessing(false);
  };

  const getCommandColor = (type: TerminalCommand["type"]): React.CSSProperties => {
    switch (type) {
      case "command":
        return { color: theme.primaryColor };
      case "output":
        return { color: theme.textColor };
      case "error":
        return { color: theme.dangerColor };
      case "success":
        return { color: theme.successColor };
      case "processing":
        return { color: theme.warningColor };
      case "system":
        return { color: theme.accentColor, fontStyle: "italic" };
      case "prompt":
        return { color: theme.primaryColor };
      default:
        return { color: theme.textColor };
    }
  };

  const getCommandPrefix = (type: TerminalCommand["type"], content?: string): string => {
    if (type === "command") return "root@onchain-pa:~$ ";
    if (type === "error") return "[Error] ";
    if (type === "success") return "[Success] ";
    if (type === "processing") return "[Processing] ";
    if (type === "system") return "[System] ";
    return "";
  };

  return (
    <div className="w-full h-screen bg-gray-950 text-white font-mono flex flex-col overflow-hidden shadow-2xl" style={{
      background: "linear-gradient(135deg, #0a0e27 0%, #16213e 100%)"
    }}>
      {/* Header */}
      <div className="bg-gray-900 border-b px-4 py-3 flex items-center justify-between" style={{
        borderColor: `${theme.primaryColor}80`,
        boxShadow: `0 0 20px ${theme.primaryColor}20`
      }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg" style={{
            boxShadow: "0 0 8px rgba(239, 68, 68, 0.6)"
          }}></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg" style={{
            boxShadow: "0 0 8px rgba(234, 179, 8, 0.6)"
          }}></div>
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg" style={{
            boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)"
          }}></div>
        </div>
        <span style={{ color: theme.primaryColor }} className="text-sm font-bold tracking-wider">{title} --{version}</span>
        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="flex flex-col gap-1 px-3 py-2 rounded" style={{ 
              borderColor: `${theme.successColor}80`,
              backgroundColor: `${theme.successColor}20`,
              borderWidth: 1
            }}>
              <div className="flex items-center gap-2">
                {currentUser.pfpUrl && (
                  <img
                    src={currentUser.pfpUrl}
                    alt={currentUser.displayName || currentUser.username}
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <span style={{ color: theme.successColor }} className="text-xs font-bold">
                  {currentUser.displayName || currentUser.username || `User #${currentUser.userId}`}
                </span>
              </div>
              {currentUser.walletAddress && (
                <span style={{ color: theme.successColor }} className="text-xs font-mono truncate max-w-xs opacity-80">
                  {currentUser.walletAddress.slice(0, 6)}...{currentUser.walletAddress.slice(-4)}
                </span>
              )}
            </div>
          )}
          <Link
            href="/settings"
            style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}80` }}
            className="px-3 py-1 text-xs rounded hover:opacity-80 transition-opacity"
            title="Open Settings"
          >
            ⚙️ Settings
          </Link>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-opacity-50" style={{
        backgroundImage: "linear-gradient(0deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px)",
        backgroundSize: "100% 20px"
      }}>
        {commands.map((cmd) => (
          <div key={cmd.id} className="group">
            {cmd.type === "prompt" ? (
              <div style={{ color: theme.primaryColor }} className="text-sm font-bold">
                {cmd.content}
              </div>
            ) : (
              <>
                <div style={{ color: getCommandColor(cmd.type).color }} className={`text-sm flex items-start gap-2 hover:bg-white/5 px-2 py-1 rounded transition-colors`}>
                  <span className="font-bold flex-shrink-0">
                    {getCommandPrefix(cmd.type, cmd.content)}
                  </span>
                  <span className="break-words flex-1">{cmd.content}</span>
                </div>
                {cmd.details && (
                  <div className="ml-6 mt-2 space-y-1" style={{ color: theme.textColor }}>
                    {cmd.details.map((detail, idx) => {
                      // Format markdown-like content
                      const isHeader = detail.startsWith('**') && detail.endsWith('**');
                      const isBullet = detail.trim().startsWith('*');
                      
                      if (isHeader) {
                        return (
                          <div key={idx} style={{ color: theme.primaryColor }} className="text-xs font-bold mt-2 mb-1">
                            {detail.replace(/\*\*/g, '')}
                          </div>
                        );
                      }
                      
                      if (isBullet) {
                        return (
                          <div key={idx} style={{ color: theme.successColor }} className="text-xs font-mono pl-2 break-words">
                            {detail}
                          </div>
                        );
                      }
                      
                      return (
                        <div key={idx} className="text-xs font-mono hover:opacity-80 transition-opacity break-words">
                          <span style={{ color: theme.warningColor }}>&gt;</span> {detail}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Command Input */}
      <form
        onSubmit={handleCommandSubmit}
        className="border-t border-cyan-500/50 bg-gray-900 px-6 py-4 flex items-center gap-3 backdrop-blur-sm" style={{
          boxShadow: "inset 0 1px 0 rgba(34, 211, 238, 0.1)"
        }}
      >
        <span style={{ color: theme.successColor }} className="font-bold flex-shrink-0">root@onchain-pa:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setHistoryIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          placeholder="Enter command or alias (type 'help' for shortcuts)"
          style={{ 
            color: theme.textColor,
            backgroundColor: "transparent",
            outlineWidth: 0
          }}
          className="flex-1 placeholder-gray-600 placeholder-opacity-50 font-mono text-sm"
          autoFocus
        />
        {isProcessing && (
          <span style={{ color: theme.warningColor }} className="animate-spin text-lg">⟳</span>
        )}
      </form>

      {/* Status Bar */}
      <div className="px-4 py-2 text-xs flex justify-between items-center" style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderTop: `1px solid ${theme.primaryColor}40`,
        color: theme.textColor
      }}>
        <div className="space-x-4 flex items-center">
          <span>Ready for input</span>
          <span>•</span>
          <span>AGENT_CORE: ACTIVE</span>
          {currentUser && (
            <>
              <span>•</span>
              <span style={{ color: theme.successColor }}>User: {currentUser.username || `#${currentUser.userId}`}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/settings"
            style={{ color: theme.primaryColor }}
            className="hover:opacity-80 transition-opacity"
            title="Open Settings"
          >
            ⚙️ Settings
          </Link>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export const TerminalManager = {
  createCommandOutput: (content: string, details?: string[]): TerminalCommand => ({
    id: Date.now().toString(),
    type: "output",
    content,
    details,
    timestamp: new Date(),
  }),

  createSuccessOutput: (content: string, details?: string[]): TerminalCommand => ({
    id: Date.now().toString(),
    type: "success",
    content,
    details,
    timestamp: new Date(),
  }),

  createErrorOutput: (content: string): TerminalCommand => ({
    id: Date.now().toString(),
    type: "error",
    content,
    timestamp: new Date(),
  }),

  createProcessingOutput: (content: string, details?: string[]): TerminalCommand => ({
    id: Date.now().toString(),
    type: "processing",
    content,
    details,
    timestamp: new Date(),
  }),

  createSystemOutput: (content: string): TerminalCommand => ({
    id: Date.now().toString(),
    type: "system",
    content,
    timestamp: new Date(),
  }),
};

export default TerminalUI;
