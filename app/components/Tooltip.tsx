import React, { useState, useRef } from "react";
import { useThemeCustomization } from "@/app/hooks/useThemeCustomization";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  variant?: "default" | "accent" | "success" | "danger";
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 300,
  variant = "default",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useThemeCustomization();

  const colorMap = {
    default: {
      bg: theme.backgroundColor,
      text: theme.textColor,
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
  };

  const colors = colorMap[variant];

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {isVisible && (
        <div
          className={`
            absolute ${positionClasses[position]} 
            text-xs px-2 py-1 rounded whitespace-nowrap z-50 animate-fade-in
            transition-all duration-200
          `}
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
            borderColor: colors.border,
            borderWidth: "1px",
            boxShadow: `0 0 15px ${colors.border}40`,
          }}
        >
          {content}
          <div
            className={`
              absolute w-2 h-2 rotate-45
              ${position === "top" ? "-bottom-1 left-1/2 -translate-x-1/2" : ""}
              ${position === "bottom" ? "-top-1 left-1/2 -translate-x-1/2" : ""}
              ${position === "left" ? "-right-1 top-1/2 -translate-y-1/2" : ""}
              ${position === "right" ? "-left-1 top-1/2 -translate-y-1/2" : ""}
            `}
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
              borderWidth: "1px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
