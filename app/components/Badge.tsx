import React from "react";

interface BadgeProps {
  label: string;
  variant?: "success" | "error" | "warning" | "info" | "neutral";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "info",
  size = "sm",
}) => {
  const variantClasses = {
    success: "bg-green-500/20 text-green-400 border border-green-500/50",
    error: "bg-red-500/20 text-red-400 border border-red-500/50",
    warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50",
    info: "bg-blue-500/20 text-blue-400 border border-blue-500/50",
    neutral: "bg-gray-700/50 text-gray-300 border border-gray-600",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-full font-mono`}>
      {label}
    </span>
  );
};

interface TagProps {
  label: string;
  onRemove?: () => void;
  color?: string;
}

export const Tag: React.FC<TagProps> = ({ label, onRemove, color = "cyan" }) => {
  const colorClasses = {
    cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
    green: "bg-green-500/20 text-green-400 border-green-500/50",
    red: "bg-red-500/20 text-red-400 border-red-500/50",
    yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-mono border ${
        colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan
      }`}
    >
      <span>{label}</span>
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70">
          ×
        </button>
      )}
    </div>
  );
};

export default Badge;
