import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

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
  onCommand?: (command: string) => Promise<void>;
}

export const TerminalUI: React.FC<TerminalUIProps> = ({
  title = "ONCHAIN-PA-SESSION",
  version = "v1.0.4",
  onCommand,
}) => {
  const [commands, setCommands] = useState<TerminalCommand[]>([
    {
      id: "0",
      type: "prompt",
      content: `${title} --${version}`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commands]);

  const addCommand = (cmd: TerminalCommand) => {
    setCommands((prev) => [...prev, cmd]);
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userCommand = input.trim();
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
        await onCommand(userCommand);
        addCommand({
          id: (Date.now() + 1).toString(),
          type: "success",
          content: "Command executed successfully",
        });
      } catch (error) {
        addCommand({
          id: (Date.now() + 2).toString(),
          type: "error",
          content: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    setIsProcessing(false);
  };

  const getCommandColor = (type: TerminalCommand["type"]): string => {
    switch (type) {
      case "command":
        return "text-cyan-400";
      case "output":
        return "text-gray-300";
      case "error":
        return "text-red-500";
      case "success":
        return "text-green-400";
      case "processing":
        return "text-yellow-400";
      case "system":
        return "text-blue-400 italic";
      case "prompt":
        return "text-cyan-400";
      default:
        return "text-white";
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
      <div className="bg-gray-900 border-b border-cyan-500/50 px-4 py-3 flex items-center justify-between" style={{
        boxShadow: "0 0 20px rgba(34, 211, 238, 0.1)"
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
        <span className="text-sm text-cyan-400 font-bold tracking-wider">{title} --{version}</span>
        <Link
          href="/settings"
          className="px-3 py-1 text-xs text-cyan-400 border border-cyan-500/50 rounded hover:bg-cyan-500/10 transition-colors"
          title="Open Settings"
        >
          ⚙️ Settings
        </Link>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-opacity-50" style={{
        backgroundImage: "linear-gradient(0deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px)",
        backgroundSize: "100% 20px"
      }}>
        {commands.map((cmd) => (
          <div key={cmd.id} className="group">
            {cmd.type === "prompt" ? (
              <div className="text-cyan-400 text-sm font-bold">
                {cmd.content}
              </div>
            ) : (
              <>
                <div className={`text-sm ${getCommandColor(cmd.type)} flex items-start gap-2 hover:bg-white/5 px-2 py-1 rounded transition-colors`}>
                  <span className="font-bold flex-shrink-0">
                    {getCommandPrefix(cmd.type, cmd.content)}
                  </span>
                  <span className="break-words flex-1">{cmd.content}</span>
                </div>
                {cmd.details && (
                  <div className="ml-6 mt-1 space-y-1 text-gray-400">
                    {cmd.details.map((detail, idx) => (
                      <div key={idx} className="text-xs font-mono hover:text-gray-300 transition-colors">
                        <span className="text-yellow-600">&gt;</span> {detail}
                      </div>
                    ))}
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
        <span className="text-green-400 font-bold flex-shrink-0">root@onchain-pa:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
          placeholder="Enter command or alias (type 'help' for shortcuts)"
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 placeholder-opacity-50 font-mono text-sm"
          autoFocus
        />
        {isProcessing && (
          <span className="text-yellow-400 animate-spin text-lg">⟳</span>
        )}
      </form>

      {/* Status Bar */}
      <div className="bg-gray-900 border-t border-cyan-500/30 px-4 py-2 text-xs text-gray-500 flex justify-between" style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)"
      }}>
        <div className="space-x-4">
          <span>Ready for input</span>
          <span>•</span>
          <span>RAM: 256MB</span>
          <span>•</span>
          <span>AGENT_CORE: ACTIVE</span>
        </div>
        <div>
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
