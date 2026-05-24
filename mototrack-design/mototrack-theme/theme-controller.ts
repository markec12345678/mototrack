import { createContext, useContext } from 'react';

export type ThemeMode = 'default' | 'dark';

export interface ThemeContextValue {
  /**
   * Current theme mode
   */
  themeMode: ThemeMode;

  /**
   * Toggle between default and dark modes
   */
  toggleTheme: () => void;

  /**
   * Set a specific theme mode
   */
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Hook for accessing and controlling the current MotoTrack theme state.
 */
export function useThemeController(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useThemeController must be used within a MototrackTheme component');
  }

  return context;
}
