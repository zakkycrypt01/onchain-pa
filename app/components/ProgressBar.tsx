import React from "react";

interface ProgressBarProps {
  progress: number; // 0-100
  status?: "processing" | "success" | "error";
  showLabel?: boolean;
  height?: "sm" | "md" | "lg";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status = "processing",
  showLabel = true,
  height = "md",
}) => {
  const heightMap = {
    sm: "h-1",
    md: "h-2",
    lg: "h-4",
  };

  const colorMap = {
    processing: "bg-cyan-500",
    success: "bg-green-500",
    error: "bg-red-500",
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full">
      <div
        className={`${heightMap[height]} bg-gray-800 rounded-full overflow-hidden border border-gray-700`}
      >
        <div
          className={`${colorMap[status]} transition-all duration-300 h-full rounded-full flex items-center justify-center`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-gray-400 mt-1 text-right">
          {clampedProgress.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
