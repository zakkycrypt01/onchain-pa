import React from "react";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  canAddTab?: boolean;
  onAddTab?: () => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  canAddTab = false,
  onAddTab,
}) => {
  return (
    <div className="flex items-center gap-1 bg-gray-900 border-b border-gray-700 px-4 py-2 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-2 px-3 py-2 rounded-t border border-b-0 cursor-pointer transition-colors ${
            activeTabId === tab.id
              ? "bg-gray-800 border-cyan-500/50 text-white"
              : "bg-gray-900 border-gray-700 text-gray-400 hover:text-white"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon && <span>{tab.icon}</span>}
          <span className="text-sm font-mono">{tab.label}</span>
          {onTabClose && tabs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className="ml-1 text-gray-500 hover:text-red-400"
            >
              ×
            </button>
          )}
        </div>
      ))}

      {canAddTab && onAddTab && (
        <button
          onClick={onAddTab}
          className="ml-2 px-2 py-1 text-gray-400 hover:text-green-400 font-mono text-sm transition-colors"
        >
          +
        </button>
      )}
    </div>
  );
};

export default TabNavigation;
