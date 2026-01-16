import React from "react";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = "/",
}) => {
  return (
    <div className="flex items-center gap-2 text-sm font-mono">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-500">{separator}</span>}
          <div
            onClick={item.onClick}
            className={`${
              item.onClick && !item.disabled
                ? "cursor-pointer text-cyan-400 hover:text-cyan-300"
                : item.disabled
                ? "text-gray-600 cursor-not-allowed"
                : "text-gray-400"
            } transition-colors`}
          >
            {item.label}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
