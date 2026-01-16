import React from "react";
import { Button } from "./Button";

interface SettingOption {
  label: string;
  value: any;
  onChange: (value: any) => void;
  type: "toggle" | "select" | "slider";
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Record<string, SettingOption>;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}>
      <div
        className="fixed right-0 top-0 bottom-0 w-80 bg-gray-900 border-l border-cyan-500/50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(settings).map(([key, setting]) => (
              <div key={key} className="border-b border-gray-700 pb-4">
                <label className="block text-sm font-mono text-white mb-2">
                  {setting.label}
                </label>

                {setting.type === "toggle" && (
                  <button
                    onClick={() => setting.onChange(!setting.value)}
                    className={`px-4 py-2 rounded font-mono text-sm transition-colors ${
                      setting.value
                        ? "bg-green-500/20 text-green-400 border border-green-500"
                        : "bg-gray-700/50 text-gray-400 border border-gray-600"
                    }`}
                  >
                    {setting.value ? "Enabled" : "Disabled"}
                  </button>
                )}

                {setting.type === "select" && (
                  <select
                    value={setting.value}
                    onChange={(e) => setting.onChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded font-mono text-sm"
                  >
                    {setting.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {setting.type === "slider" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={setting.min}
                      max={setting.max}
                      value={setting.value}
                      onChange={(e) => setting.onChange(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-400 min-w-[2rem]">
                      {setting.value}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
