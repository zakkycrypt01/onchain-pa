"use client";

import { useState, useCallback, useEffect } from "react";

export interface ThemeCustomization {
  mode: "dark" | "light";
  primaryColor: string;
  accentColor: string;
  successColor: string;
  dangerColor: string;
  warningColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: "sm" | "md" | "lg";
  fontFamily: "mono" | "sans" | "serif";
  opacity: number; // 0-1
  intensity: number; // 0-1
  preset: "default" | "neon" | "cyberpunk" | "minimal" | "ocean" | "sunset" | "custom";
}

export const DEFAULT_THEME: ThemeCustomization = {
  mode: "dark",
  primaryColor: "#00d9ff",
  accentColor: "#00ff88",
  successColor: "#00ff88",
  dangerColor: "#ff0055",
  warningColor: "#ffa500",
  backgroundColor: "#0a0e27",
  textColor: "#e0e0e0",
  borderRadius: "md",
  fontFamily: "mono",
  opacity: 1,
  intensity: 1,
  preset: "default",
};

const THEME_PRESETS: Record<string, ThemeCustomization> = {
  default: {
    mode: "dark",
    primaryColor: "#00d9ff",
    accentColor: "#00ff88",
    successColor: "#00ff88",
    dangerColor: "#ff0055",
    warningColor: "#ffa500",
    backgroundColor: "#0a0e27",
    textColor: "#e0e0e0",
    borderRadius: "md",
    fontFamily: "mono",
    opacity: 1,
    intensity: 1,
    preset: "default",
  },
  neon: {
    mode: "dark",
    primaryColor: "#ff006e",
    accentColor: "#00f5ff",
    successColor: "#39ff14",
    dangerColor: "#ff006e",
    warningColor: "#ffbe0b",
    backgroundColor: "#0a0a0a",
    textColor: "#ffffff",
    borderRadius: "lg",
    fontFamily: "mono",
    opacity: 1,
    intensity: 1.2,
    preset: "neon",
  },
  cyberpunk: {
    mode: "dark",
    primaryColor: "#00ff00",
    accentColor: "#ff00ff",
    successColor: "#00ff00",
    dangerColor: "#ff0000",
    warningColor: "#ffff00",
    backgroundColor: "#1a001a",
    textColor: "#00ff00",
    borderRadius: "sm",
    fontFamily: "mono",
    opacity: 0.95,
    intensity: 1.3,
    preset: "cyberpunk",
  },
  minimal: {
    mode: "dark",
    primaryColor: "#666666",
    accentColor: "#999999",
    successColor: "#333333",
    dangerColor: "#cccccc",
    warningColor: "#999999",
    backgroundColor: "#0d0d0d",
    textColor: "#cccccc",
    borderRadius: "sm",
    fontFamily: "sans",
    opacity: 0.9,
    intensity: 0.8,
    preset: "minimal",
  },
  ocean: {
    mode: "dark",
    primaryColor: "#0099ff",
    accentColor: "#00ccff",
    successColor: "#00ff99",
    dangerColor: "#ff3366",
    warningColor: "#ffcc00",
    backgroundColor: "#001133",
    textColor: "#ccddff",
    borderRadius: "md",
    fontFamily: "mono",
    opacity: 0.98,
    intensity: 1,
    preset: "ocean",
  },
  sunset: {
    mode: "dark",
    primaryColor: "#ff6b35",
    accentColor: "#ffa500",
    successColor: "#ffb84d",
    dangerColor: "#e63946",
    warningColor: "#ff8c42",
    backgroundColor: "#264653",
    textColor: "#f4a261",
    borderRadius: "lg",
    fontFamily: "serif",
    opacity: 1,
    intensity: 0.9,
    preset: "sunset",
  },
};

export const useThemeCustomization = () => {
  const [theme, setTheme] = useState<ThemeCustomization>(DEFAULT_THEME);
  const [savedThemes, setSavedThemes] = useState<Record<string, ThemeCustomization>>({});
  const [isClient, setIsClient] = useState(false);

  // Initialize on client side only
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("customTheme");
    const savedThemesStr = localStorage.getItem("savedThemes");

    if (saved) {
      try {
        const parsedTheme = JSON.parse(saved);
        setTheme(parsedTheme);
        applyThemeToDOM(parsedTheme);
      } catch (e) {
        console.error("Failed to load custom theme:", e);
        applyThemeToDOM(DEFAULT_THEME);
      }
    } else {
      applyThemeToDOM(DEFAULT_THEME);
    }

    if (savedThemesStr) {
      try {
        setSavedThemes(JSON.parse(savedThemesStr));
      } catch (e) {
        console.error("Failed to load saved themes:", e);
      }
    }
  }, []);

  // Save theme to localStorage
  const saveTheme = useCallback((newTheme: ThemeCustomization) => {
    setTheme(newTheme);
    localStorage.setItem("customTheme", JSON.stringify(newTheme));
    applyThemeToDOM(newTheme);
  }, []);

  // Apply preset theme
  const applyPreset = useCallback((presetName: keyof typeof THEME_PRESETS) => {
    const preset = THEME_PRESETS[presetName];
    if (preset) {
      saveTheme(preset);
    }
  }, [saveTheme]);

  // Update specific theme property
  const updateThemeProperty = useCallback(
    <K extends keyof ThemeCustomization>(key: K, value: ThemeCustomization[K]) => {
      const updated = { ...theme, [key]: value };
      saveTheme(updated);
    },
    [theme, saveTheme]
  );

  // Save current theme as custom preset
  const saveAsPreset = useCallback(
    (presetName: string) => {
      const newSaved = { ...savedThemes, [presetName]: theme };
      setSavedThemes(newSaved);
      localStorage.setItem("savedThemes", JSON.stringify(newSaved));
    },
    [theme, savedThemes]
  );

  // Delete saved preset
  const deletePreset = useCallback(
    (presetName: string) => {
      const newSaved = { ...savedThemes };
      delete newSaved[presetName];
      setSavedThemes(newSaved);
      localStorage.setItem("savedThemes", JSON.stringify(newSaved));
    },
    [savedThemes]
  );

  // Load saved preset
  const loadPreset = useCallback(
    (presetName: string) => {
      const preset = savedThemes[presetName];
      if (preset) {
        saveTheme(preset);
      }
    },
    [savedThemes, saveTheme]
  );

  // Reset to default
  const resetToDefault = useCallback(() => {
    saveTheme(DEFAULT_THEME);
  }, [saveTheme]);

  return {
    theme,
    saveTheme,
    applyPreset,
    updateThemeProperty,
    saveAsPreset,
    deletePreset,
    loadPreset,
    resetToDefault,
    savedThemes,
    availablePresets: Object.keys(THEME_PRESETS),
  };
};

// Apply theme to DOM CSS variables
export const applyThemeToDOM = (theme: ThemeCustomization) => {
  const root = document.documentElement;
  const opacityMultiplier = theme.intensity * theme.opacity;

  root.style.setProperty("--color-primary", theme.primaryColor);
  root.style.setProperty("--color-accent", theme.accentColor);
  root.style.setProperty("--color-success", theme.successColor);
  root.style.setProperty("--color-danger", theme.dangerColor);
  root.style.setProperty("--color-warning", theme.warningColor);
  root.style.setProperty("--color-bg", theme.backgroundColor);
  root.style.setProperty("--color-text", theme.textColor);
  root.style.setProperty("--opacity-multiplier", opacityMultiplier.toString());

  // Border radius mapping
  const radiusMap = { sm: "0.25rem", md: "0.5rem", lg: "1rem" };
  root.style.setProperty("--border-radius", radiusMap[theme.borderRadius]);

  // Font family mapping
  const fontMap = {
    mono: "'Courier New', monospace",
    sans: "'Segoe UI', sans-serif",
    serif: "'Georgia', serif",
  };
  root.style.setProperty("--font-family", fontMap[theme.fontFamily]);

  // Apply theme mode class
  root.classList.toggle("dark-mode", theme.mode === "dark");
  root.classList.toggle("light-mode", theme.mode === "light");
};
