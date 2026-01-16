import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className = "",
  ...props
}) => {
  const variantClasses = {
    primary:
      "bg-cyan-500 hover:bg-cyan-600 text-white border border-cyan-400 shadow-lg shadow-cyan-500/50",
    secondary:
      "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600",
    danger: "bg-red-600 hover:bg-red-700 text-white border border-red-500",
    ghost: "bg-transparent hover:bg-white/10 text-white border border-gray-600",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`
        font-mono font-semibold rounded transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={loading}
      {...props}
    >
      {loading && <span className="animate-spin">⟳</span>}
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
