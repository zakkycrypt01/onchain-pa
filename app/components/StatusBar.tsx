import React from "react";
import { PulsingDot } from "./LoadingSpinner";

interface StatusBarProps {
  connectionStatus: "connected" | "disconnected" | "connecting";
  commandCount: number;
  successCount: number;
  failureCount: number;
  totalTime: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  connectionStatus,
  commandCount,
  successCount,
  failureCount,
  totalTime,
}) => {
  const successRate =
    commandCount > 0 ? Math.round((successCount / commandCount) * 100) : 0;
  const avgTime = commandCount > 0 ? Math.round(totalTime / commandCount) : 0;

  const statusColors = {
    connected: "text-green-400",
    connecting: "text-yellow-400",
    disconnected: "text-red-400",
  };

  const statusLabels = {
    connected: "Connected",
    connecting: "Connecting",
    disconnected: "Disconnected",
  };

  return (
    <div className="bg-gray-900 border-t border-cyan-500/30 px-4 py-2 text-xs text-gray-500 flex justify-between flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {connectionStatus === "connected" && <PulsingDot color="bg-green-500" />}
          {connectionStatus === "connecting" && <PulsingDot color="bg-yellow-500" />}
          {connectionStatus === "disconnected" && <div className="w-2 h-2 bg-red-500 rounded-full" />}
          <span className={statusColors[connectionStatus]}>
            {statusLabels[connectionStatus]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <span>Commands: {commandCount}</span>
        <span className="text-green-400">Success: {successCount}</span>
        {failureCount > 0 && <span className="text-red-400">Failed: {failureCount}</span>}
        <span>Avg: {avgTime}ms</span>
        <span>RAM: 256MB</span>
      </div>

      <div>
        <span className={successRate > 80 ? "text-green-400" : "text-yellow-400"}>
          Success Rate: {successRate}%
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
