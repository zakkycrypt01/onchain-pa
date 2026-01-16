import React, { useState } from "react";
import { useThemeCustomization, type ThemeCustomization } from "@/app/hooks/useThemeCustomization";

export const ThemeCustomizer: React.FC = () => {
  const {
    theme,
    updateThemeProperty,
    applyPreset,
    saveAsPreset,
    deletePreset,
    loadPreset,
    resetToDefault,
    savedThemes,
    availablePresets,
  } = useThemeCustomization();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [activeTab, setActiveTab] = useState<"colors" | "presets" | "custom">("colors");

  const handleSavePreset = () => {
    if (presetName.trim()) {
      saveAsPreset(presetName);
      setPresetName("");
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg border border-cyan-500/30">
      <h2 className="text-xl font-bold text-cyan-400 mb-6">🎨 Theme Customizer</h2>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-cyan-500/30">
        {(["colors", "presets", "custom"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize transition-colors ${
              activeTab === tab
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-cyan-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Colors Tab */}
      {activeTab === "colors" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Primary", key: "primaryColor" as const },
              { label: "Accent", key: "accentColor" as const },
              { label: "Success", key: "successColor" as const },
              { label: "Danger", key: "dangerColor" as const },
              { label: "Warning", key: "warningColor" as const },
              { label: "Text", key: "textColor" as const },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center gap-3">
                <label className="text-sm text-gray-300 w-20">{label}</label>
                <input
                  type="color"
                  value={theme[key]}
                  onChange={(e) => updateThemeProperty(key, e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border border-cyan-500/30"
                />
                <span className="text-xs text-gray-400 font-mono">{theme[key]}</span>
              </div>
            ))}
          </div>

          {/* Opacity & Intensity */}
          <div className="border-t border-cyan-500/30 pt-4 space-y-3">
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Opacity: {(theme.opacity * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={theme.opacity}
                onChange={(e) => updateThemeProperty("opacity", parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Intensity: {theme.intensity.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={theme.intensity}
                onChange={(e) => updateThemeProperty("intensity", parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Style Options */}
          <div className="border-t border-cyan-500/30 pt-4 space-y-3">
            <div>
              <label className="text-sm text-gray-300 block mb-2">Border Radius</label>
              <select
                value={theme.borderRadius}
                onChange={(e) =>
                  updateThemeProperty(
                    "borderRadius",
                    e.target.value as "sm" | "md" | "lg"
                  )
                }
                className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded border border-cyan-500/30"
              >
                <option value="sm">Small (0.25rem)</option>
                <option value="md">Medium (0.5rem)</option>
                <option value="lg">Large (1rem)</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-2">Font Family</label>
              <select
                value={theme.fontFamily}
                onChange={(e) =>
                  updateThemeProperty("fontFamily", e.target.value as "mono" | "sans" | "serif")
                }
                className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded border border-cyan-500/30"
              >
                <option value="mono">Monospace</option>
                <option value="sans">Sans Serif</option>
                <option value="serif">Serif</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-2">Mode</label>
              <select
                value={theme.mode}
                onChange={(e) => updateThemeProperty("mode", e.target.value as "dark" | "light")}
                className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded border border-cyan-500/30"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Presets Tab */}
      {activeTab === "presets" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {availablePresets.map((preset) => (
              <button
                key={preset}
                onClick={() => applyPreset(preset as any)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded capitalize transition-all"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Presets Tab */}
      {activeTab === "custom" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800 text-gray-100 rounded border border-cyan-500/30"
            />
            <button
              onClick={handleSavePreset}
              disabled={!presetName.trim()}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white rounded transition-colors"
            >
              Save
            </button>
          </div>

          {Object.keys(savedThemes).length > 0 && (
            <div className="border-t border-cyan-500/30 pt-4">
              <h3 className="text-sm font-bold text-cyan-300 mb-3">Saved Presets</h3>
              <div className="space-y-2">
                {Object.keys(savedThemes).map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded border border-cyan-500/20"
                  >
                    <span className="text-sm text-gray-300">{name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadPreset(name)}
                        className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deletePreset(name)}
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6 pt-6 border-t border-cyan-500/30">
        <button
          onClick={resetToDefault}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded transition-colors"
        >
          Reset to Default
        </button>
        <div className="flex-1" />
        <div
          className="px-4 py-2 rounded border border-cyan-500/30"
          style={{
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
          }}
        >
          Preview
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
