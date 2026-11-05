"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";
import { theme, type ThemeMode } from "@/data/site";
import { applyTheme, isThemeMode, readStoredTheme, saveTheme, THEME_ATTRIBUTE } from "@/lib/theme";

function subscribeToThemeChanges(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: [THEME_ATTRIBUTE] });
  return () => observer.disconnect();
}

function readActiveTheme(): ThemeMode {
  const active = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isThemeMode(active) ? active : theme.defaultMode;
}

const readServerTheme = (): ThemeMode => theme.defaultMode;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const activeTheme = useSyncExternalStore(subscribeToThemeChanges, readActiveTheme, readServerTheme);
  const isDark = activeTheme === "dark";

  // In development, Strict Mode's remount resets <html> attributes and drops the one the inline
  // script set; re-apply it before paint. This is a no-op in production.
  useLayoutEffect(() => {
    applyTheme(readStoredTheme());
  }, []);

  if (!theme.showToggle) return null;

  return (
    <button
      type="button"
      onClick={() => saveTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? theme.switchToLightLabel : theme.switchToDarkLabel}
      title={isDark ? theme.switchToLightLabel : theme.switchToDarkLabel}
      className={`group relative grid size-11 cursor-pointer place-items-center overflow-hidden rounded-full border border-line text-fg transition-colors duration-500 hover:border-fg ${className}`}
    >
      <FaSun
        aria-hidden
        className={`absolute size-4 transition-all duration-500 ease-out-expo ${
          isDark ? "translate-y-0 rotate-0 opacity-100" : "translate-y-6 rotate-90 opacity-0"
        }`}
      />
      <FaMoon
        aria-hidden
        className={`absolute size-4 transition-all duration-500 ease-out-expo ${
          isDark ? "-translate-y-6 -rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100"
        }`}
      />
    </button>
  );
}
