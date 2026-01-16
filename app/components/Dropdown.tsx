import React, { useState, useRef, useEffect } from "react";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
  align?: "left" | "right";
}

export const Dropdown: React.FC<DropdownProps> = ({ items, trigger, align = "left" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute top-full mt-2 min-w-48 bg-gray-800 border border-gray-700 rounded
            shadow-lg z-50 animate-scale-in
            ${align === "right" ? "right-0" : "left-0"}
          `}
        >
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {item.divider && <div className="border-t border-gray-700" />}
              <button
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={`
                  w-full px-4 py-2 text-left text-sm font-mono flex items-center gap-2
                  hover:bg-gray-700 transition-colors
                  ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
