import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-mono text-white mb-1">{label}</label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <input
          className={`
            w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded
            font-mono text-sm placeholder-gray-600 transition-colors
            hover:border-gray-500 focus:outline-none focus:border-cyan-500
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
