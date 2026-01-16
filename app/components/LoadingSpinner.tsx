import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "cyan" | "green" | "yellow" | "red";
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "cyan",
  label,
}) => {
  const sizeMap = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };

  const colorMap = {
    cyan: "border-cyan-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
    red: "border-red-500",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeMap[size]} ${colorMap[color]} border-2 border-t-2 rounded-full animate-spin border-opacity-30`}
      />
      {label && <span className="text-sm text-gray-400">{label}</span>}
    </div>
  );
};

export const PulsingDot: React.FC<{ color?: string }> = ({ color = "bg-green-500" }) => (
  <div className={`w-2 h-2 ${color} rounded-full animate-pulse`} />
);

export const Typewriter: React.FC<{ text: string; speed?: number }> = ({
  text,
  speed = 50,
}) => {
  const [displayedText, setDisplayedText] = React.useState("");

  React.useEffect(() => {
    if (displayedText === text) return;

    const timeout = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayedText, text, speed]);

  return <span>{displayedText}</span>;
};

export const GlowingBorder: React.FC<{ children: React.ReactNode; intensity?: number }> = ({
  children,
  intensity = 10,
}) => (
  <div
    style={{
      boxShadow: `0 0 ${intensity}px rgba(34, 211, 238, 0.5)`,
    }}
    className="border border-cyan-500/50"
  >
    {children}
  </div>
);

export default LoadingSpinner;
