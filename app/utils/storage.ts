/**
 * Local Storage Management for Terminal
 * Handles persistence of settings, history, favorites, and sessions
 */

const STORAGE_KEYS = {
  TERMINAL_HISTORY: "terminal_history",
  TERMINAL_FAVORITES: "terminal_favorites",
  TERMINAL_SETTINGS: "terminal_settings",
  TERMINAL_SESSIONS: "terminal_sessions",
  TERMINAL_THEME: "terminal_theme",
  TERMINAL_FONT_SIZE: "terminal_font_size",
};

export function saveHistory(history: any[]) {
  try {
    const limited = history.slice(-1000); // Keep last 1000 commands
    localStorage.setItem(STORAGE_KEYS.TERMINAL_HISTORY, JSON.stringify(limited));
  } catch (error) {
    console.error("Failed to save history:", error);
  }
}

export function loadHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TERMINAL_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
}

export function saveFavorites(favorites: any[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TERMINAL_FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error("Failed to save favorites:", error);
  }
}

export function loadFavorites() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TERMINAL_FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load favorites:", error);
    return [];
  }
}

export function saveSettings(settings: Record<string, any>) {
  try {
    localStorage.setItem(STORAGE_KEYS.TERMINAL_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}

export function loadSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TERMINAL_SETTINGS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to load settings:", error);
    return {};
  }
}

export function saveTheme(theme: "dark" | "light") {
  try {
    localStorage.setItem(STORAGE_KEYS.TERMINAL_THEME, theme);
  } catch (error) {
    console.error("Failed to save theme:", error);
  }
}

export function loadTheme() {
  try {
    return (localStorage.getItem(STORAGE_KEYS.TERMINAL_THEME) || "dark") as
      | "dark"
      | "light";
  } catch (error) {
    console.error("Failed to load theme:", error);
    return "dark";
  }
}

export function saveFontSize(size: number) {
  try {
    localStorage.setItem(STORAGE_KEYS.TERMINAL_FONT_SIZE, size.toString());
  } catch (error) {
    console.error("Failed to save font size:", error);
  }
}

export function loadFontSize() {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEYS.TERMINAL_FONT_SIZE) || "14");
  } catch (error) {
    console.error("Failed to load font size:", error);
    return 14;
  }
}

export function exportTerminalData() {
  const data = {
    history: loadHistory(),
    favorites: loadFavorites(),
    settings: loadSettings(),
    theme: loadTheme(),
    fontSize: loadFontSize(),
    exportedAt: new Date().toISOString(),
  };
  return data;
}

export function importTerminalData(data: any) {
  try {
    if (data.history) saveHistory(data.history);
    if (data.favorites) saveFavorites(data.favorites);
    if (data.settings) saveSettings(data.settings);
    if (data.theme) saveTheme(data.theme);
    if (data.fontSize) saveFontSize(data.fontSize);
    return true;
  } catch (error) {
    console.error("Failed to import data:", error);
    return false;
  }
}

export function clearAllTerminalData() {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error("Failed to clear data:", error);
    return false;
  }
}
