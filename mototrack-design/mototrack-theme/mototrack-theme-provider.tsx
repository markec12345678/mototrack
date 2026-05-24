import { createTheme } from '@bitdesign/sparks.sparks-theme';
import { MototrackThemeSchema, mototrackTokens } from './mototrack-tokens.js';

/**
 * Creating and declaring the MotoTrack dark motorcycle theme.
 * The theme schema type is used for proper token type completions.
 */
export const MototrackThemeProvider = createTheme<MototrackThemeSchema>({
  tokens: mototrackTokens,
});

/**
 * A React hook for contextual access to MotoTrack design tokens
 * from within any component wrapped by MototrackTheme.
 */
export const { useTheme } = MototrackThemeProvider;
