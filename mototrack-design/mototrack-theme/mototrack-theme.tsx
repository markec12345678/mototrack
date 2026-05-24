import React, { ReactNode, useCallback, useState } from 'react';
import classNames from 'classnames';
import { mergeTokenSchema, DeepPartial } from '@bitdesign/sparks.sparks-theme';
import { MototrackThemeProvider } from './mototrack-theme-provider.js';
import { MototrackThemeSchema } from './mototrack-tokens.js';
import { ThemeContext, ThemeContextValue, ThemeMode } from './theme-controller.js';
import { themeOptions } from './theme-options.js';
import styles from './mototrack-theme.module.scss';

export type MototrackThemeProps = {
  /**
   * Component tree to apply the MotoTrack dark theme to.
   */
  children?: ReactNode;

  /**
   * Additional class name to inject into the theme root.
   */
  className?: string;

  /**
   * Token overrides — merge on top of the active theme preset.
   */
  overrides?: DeepPartial<MototrackThemeSchema>;

  /**
   * Initial theme mode. Defaults to the base dark motorcycle theme.
   */
  initialTheme?: ThemeMode;

  /**
   * Inline styles for the theme root element.
   */
  style?: React.CSSProperties;
};

/**
 * MotoTrack dark motorcycle theme provider.
 * Injects CSS variables, antialiased base styles, and the Inter typeface
 * across the entire component tree.
 */
export function MototrackTheme({
  children,
  initialTheme,
  overrides,
  className,
  style,
}: MototrackThemeProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialTheme ?? 'default');
  const themePreset = themeOptions[themeMode as keyof typeof themeOptions];

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => (prev === 'dark' ? 'default' : 'dark'));
  }, []);

  const themeContextValue: ThemeContextValue = {
    themeMode,
    toggleTheme,
    setThemeMode,
  };

  const themeOverrides = mergeTokenSchema(themePreset ?? {}, overrides ?? {});

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <MototrackThemeProvider.ThemeProvider
        className={classNames(styles.mototrackTheme, className)}
        overrides={themeOverrides}
        style={style}
      >
        {children}
      </MototrackThemeProvider.ThemeProvider>
    </ThemeContext.Provider>
  );
}
