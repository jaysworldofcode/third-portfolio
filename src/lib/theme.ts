import { THEME_MODES, theme, type ThemeMode } from "@/data/site";

export const THEME_STORAGE_KEY = "lorem-theme";
export const THEME_ATTRIBUTE = "data-theme";

export const isThemeMode = (value: unknown): value is ThemeMode => THEME_MODES.includes(value as ThemeMode);

/**
 * The visitor's saved choice, or the default from site.json when there is none, storage is
 * blocked, or the toggle is hidden (so an old choice can't override the default).
 */
export function readStoredTheme(): ThemeMode {
  if (!theme.showToggle) return theme.defaultMode;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : theme.defaultMode;
  } catch {
    return theme.defaultMode;
  }
}

export function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, mode);
}

export function saveTheme(mode: ThemeMode) {
  applyTheme(mode);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Storage can be blocked (private mode, strict settings); the theme still applies for this visit.
  }
}

/**
 * Runs in <head> before first paint, so a saved light/dark choice never flashes the default theme.
 * Kept as a plain string because it executes before any bundle has loaded.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(${JSON.stringify(THEME_MODES)}.indexOf(t)>-1)document.documentElement.setAttribute(${JSON.stringify(
  THEME_ATTRIBUTE,
)},t)}catch(e){}})()`;
