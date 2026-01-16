import React from "react";
import { useThemeCustomization } from "@/app/hooks/useThemeCustomization";

interface ThemedButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "accent" | "success" | "danger" | "warning";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  icon,
}) => {
  const { theme } = useThemeCustomization();

  const variantColors: Record<string, { bg: string; text: string; border: string }> = {
    primary: {
      bg: theme.primaryColor,
      text: theme.backgroundColor,
      border: theme.primaryColor,
    },
    accent: {
      bg: theme.accentColor,
      text: theme.backgroundColor,
      border: theme.accentColor,
    },
    success: {
      bg: theme.successColor,
      text: theme.backgroundColor,
      border: theme.successColor,
    },
    danger: {
      bg: theme.dangerColor,
      text: theme.backgroundColor,
      border: theme.dangerColor,
    },
    warning: {
      bg: theme.warningColor,
      text: theme.backgroundColor,
      border: theme.warningColor,
    },
  };

  const colors = variantColors[variant];

  const sizeMap = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 rounded transition-all duration-200
        hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeMap[size]}
      `}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
        borderWidth: "1px",
        opacity: disabled ? 0.5 : theme.opacity,
        boxShadow: disabled ? "none" : `0 0 10px ${colors.border}40`,
      }}
    >
      {icon}
      {label}
    </button>
  );
};

export default ThemedButton;
