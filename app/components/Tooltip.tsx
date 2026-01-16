import React, { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 300,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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
            bg-gray-900 text-gray-100 text-xs px-2 py-1 rounded border border-cyan-500/50
            whitespace-nowrap z-50 animate-fade-in
          `}
          style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.2)" }}
        >
          {content}
          <div
            className={`
              absolute w-2 h-2 bg-gray-900 border border-cyan-500/50 rotate-45
              ${position === "top" ? "-bottom-1 left-1/2 -translate-x-1/2" : ""}
              ${position === "bottom" ? "-top-1 left-1/2 -translate-x-1/2" : ""}
              ${position === "left" ? "-right-1 top-1/2 -translate-y-1/2" : ""}
              ${position === "right" ? "-left-1 top-1/2 -translate-y-1/2" : ""}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
