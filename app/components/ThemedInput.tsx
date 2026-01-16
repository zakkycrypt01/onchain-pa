import React from "react";
import { useThemeCustomization } from "@/app/hooks/useThemeCustomization";

interface ThemedInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: "primary" | "accent" | "success" | "danger";
  label?: string;
  disabled?: boolean;
  error?: string;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
  placeholder,
  value,
  onChange,
  variant = "primary",
  label,
  disabled = false,
  error,
}) => {
  const { theme } = useThemeCustomization();

  const variantColors: Record<string, string> = {
    primary: theme.primaryColor,
    accent: theme.accentColor,
    success: theme.successColor,
    danger: theme.dangerColor,
  };

  const borderColor = error ? theme.dangerColor : variantColors[variant];

  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.textColor }}
        >
          {label}
        </label>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 rounded transition-all duration-200"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          borderColor: borderColor,
          borderWidth: "1px",
          opacity: disabled ? 0.5 : theme.opacity,
          boxShadow: `0 0 10px ${borderColor}20`,
        }}
      />
      {error && (
        <p
          className="text-xs mt-1"
          style={{ color: theme.dangerColor }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default ThemedInput;
