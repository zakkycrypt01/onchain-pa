import React from "react";
import { useThemeCustomization } from "@/app/hooks/useThemeCustomization";

interface ThemedBadgeProps {
  label: string;
  variant?: "primary" | "accent" | "success" | "danger" | "warning";
  size?: "sm" | "md" | "lg";
}

export const ThemedBadge: React.FC<ThemedBadgeProps> = ({
  label,
  variant = "primary",
  size = "md",
}) => {
  const { theme } = useThemeCustomization();

  const variantColors: Record<string, { bg: string; text: string }> = {
    primary: { bg: theme.primaryColor, text: theme.backgroundColor },
    accent: { bg: theme.accentColor, text: theme.backgroundColor },
    success: { bg: theme.successColor, text: theme.backgroundColor },
    danger: { bg: theme.dangerColor, text: theme.backgroundColor },
    warning: { bg: theme.warningColor, text: theme.backgroundColor },
  };

  const colors = variantColors[variant];

  const sizeMap = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`rounded-full font-semibold inline-block ${sizeMap[size]}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        opacity: theme.opacity,
        boxShadow: `0 0 10px ${colors.bg}40`,
      }}
    >
      {label}
    </span>
  );
};

export default ThemedBadge;
