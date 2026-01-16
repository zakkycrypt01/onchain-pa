import React from "react";
import { formatTimestamp, formatExecutionTime } from "@/app/utils/terminal-utils";
import { COMMAND_PREFIXES, TERMINAL_THEMES } from "@/app/constants/terminal-theme";
import type { TerminalCommand } from "@/app/hooks/useTerminal";

interface CommandRendererProps {
  command: TerminalCommand;
  theme: "dark" | "light";
  onCopy?: () => void;
}

export const CommandRenderer: React.FC<CommandRendererProps> = ({
  command,
  theme,
  onCopy,
}) => {
  const themeConfig = TERMINAL_THEMES[theme];

  const getColorClass = () => {
    switch (command.type) {
      case "command":
        return "text-cyan-400";
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-500";
      case "processing":
        return "text-yellow-400";
      case "system":
        return "text-blue-400 italic";
      case "output":
        return "text-gray-300";
      case "prompt":
        return "text-cyan-400 font-bold";
      default:
        return "text-white";
    }
  };

  const getPrefixText = () => {
    const prefixes: Record<string, string> = {
      command: COMMAND_PREFIXES.command,
      error: COMMAND_PREFIXES.error,
      success: COMMAND_PREFIXES.success,
      processing: COMMAND_PREFIXES.processing,
      system: COMMAND_PREFIXES.system,
      output: COMMAND_PREFIXES.output,
    };
    return prefixes[command.type] || "";
  };

  if (command.type === "prompt") {
    return <div className="text-cyan-400 text-sm font-bold">{command.content}</div>;
  }

  return (
    <div className="group">
      <div
        className={`text-sm ${getColorClass()} flex items-start gap-2 hover:bg-white/5 px-2 py-1 rounded transition-colors cursor-pointer`}
        onClick={onCopy}
      >
        {command.type === "command" && (
          <span className="font-bold flex-shrink-0">{getPrefixText()}</span>
        )}
        {command.type !== "command" && (
          <span className="font-bold flex-shrink-0 opacity-70">{getPrefixText()}</span>
        )}
        <div className="flex-1">
          <span className="break-words">{command.content}</span>
          {command.executionTime && command.type === "success" && (
            <span className="ml-2 text-xs text-gray-500">
              ({formatExecutionTime(command.executionTime)})
            </span>
          )}
        </div>
        {command.type === "command" && (
          <span className="opacity-0 group-hover:opacity-100 text-xs text-gray-500 flex-shrink-0">
            Copy
          </span>
        )}
      </div>

      {command.timestamp && command.type === "command" && (
        <div className="text-xs text-gray-600 ml-6 mt-1">
          {formatTimestamp(command.timestamp)}
        </div>
      )}

      {command.details && (
        <div className="ml-6 mt-1 space-y-1">
          {command.details.map((detail, idx) => (
            <div key={idx} className="text-xs text-gray-400 font-mono">
              <span className="text-yellow-600">&gt;</span> {detail}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommandRenderer;
