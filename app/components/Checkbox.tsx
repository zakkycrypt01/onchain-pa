import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = "", ...props }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        className={`w-4 h-4 border border-gray-600 rounded bg-gray-800 cursor-pointer ${className}`}
        {...props}
      />
      {label && (
        <label className="text-sm font-mono text-gray-300 cursor-pointer">{label}</label>
      )}
    </div>
  );
};

export default Checkbox;
