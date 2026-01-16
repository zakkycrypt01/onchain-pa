import React from "react";
import { useThemeCustomization } from "@/app/hooks/useThemeCustomization";

interface ThemedCardProps {
  title?: string;
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "danger";
  hoverable?: boolean;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  title,
  children,
  variant = "default",
  hoverable = false,
}) => {
  const { theme } = useThemeCustomization();

  const variantColors: Record<string, { border: string; glow: string }> = {
    default: {
      border: theme.primaryColor,
      glow: theme.primaryColor,
    },
    accent: {
      border: theme.accentColor,
      glow: theme.accentColor,
    },
    success: {
      border: theme.successColor,
      glow: theme.successColor,
    },
    danger: {
      border: theme.dangerColor,
      glow: theme.dangerColor,
    },
  };

  const colors = variantColors[variant];

  return (
    <div
      className={`rounded p-4 transition-all duration-200 ${
        hoverable ? "hover:shadow-lg cursor-pointer" : ""
      }`}
      style={{
        backgroundColor: theme.backgroundColor,
        borderColor: colors.border,
        borderWidth: "1px",
        boxShadow: `0 0 20px ${colors.glow}${Math.round(theme.opacity * 20).toString(16)}`,
        opacity: theme.opacity,
      }}
    >
      {title && (
        <h3
          className="font-bold mb-3 text-lg"
          style={{ color: colors.border }}
        >
          {title}
        </h3>
      )}
      <div style={{ color: theme.textColor }}>
        {children}
      </div>
    </div>
  );
};

export default ThemedCard;
