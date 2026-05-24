import { DeepPartial } from '@bitdesign/sparks.sparks-theme';
import { MototrackThemeSchema } from './mototrack-tokens.js';

/**
 * Override tokens for the MotoTrack "midnight" dark variant.
 * Pushes surfaces even deeper for OLED / ultra-dark environments.
 */
export const darkThemeSchema: DeepPartial<MototrackThemeSchema> = {
  colors: {
    primary: {
      default: '#fb923c',
      hover: '#f97316',
      active: '#ea580c',
    },
    secondary: {
      default: '#64748b',
      hover: '#94a3b8',
      active: '#475569',
    },
    surface: {
      background: '#000000',
      primary: '#080f1e',
      secondary: '#0d1a2e',
    },
    text: {
      primary: '#ffffff',
      default: '#ffffff',
      secondary: '#94a3b8',
      muted: '#475569',
      inverse: '#000000',
    },
    border: {
      default: 'rgba(148, 163, 184, 0.10)',
      strong: 'rgba(148, 163, 184, 0.20)',
      focus: '#fb923c',
    },
    status: {
      success: { default: '#4ade80', subtle: 'rgba(74, 222, 128, 0.15)' },
      warning: { default: '#facc15', subtle: 'rgba(250, 204, 21, 0.15)' },
      danger: { default: '#f87171', subtle: 'rgba(248, 113, 113, 0.15)' },
      info: { default: '#60a5fa', subtle: 'rgba(96, 165, 250, 0.15)' },
    },
    overlay: 'rgba(0, 0, 0, 0.90)',
    flags: {
      red: '#f87171',
      blue: '#60a5fa',
      yellow: '#facc15',
      green: '#4ade80',
      white: '#ffffff',
      black: '#000000',
      orange: '#fb923c',
      purple: '#c084fc',
      pink: '#f472b6',
      teal: '#2dd4bf',
      gold: '#fbbf24',
      silver: '#94a3b8',
      bronze: '#d97706',
    },
  },
  borders: {
    default: {
      color: 'rgba(148, 163, 184, 0.10)',
      width: '1px',
      style: 'solid',
    },
    focus: {
      color: '#fb923c',
      width: '2px',
      style: 'solid',
      offset: '2px',
    },
    radius: {
      none: '0px',
      xs: '2px',
      small: '4px',
      medium: '8px',
      large: '12px',
      xl: '16px',
      xxl: '24px',
      full: '9999px',
    },
  },
  effects: {
    shadows: {
      xs: '0 1px 2px rgba(0, 0, 0, 0.7)',
      small: '0 2px 8px rgba(0, 0, 0, 0.8)',
      medium: '0 4px 16px rgba(0, 0, 0, 0.85)',
      large: '0 8px 32px rgba(0, 0, 0, 0.9)',
      xLarge: '0 16px 48px rgba(0, 0, 0, 0.92)',
      floating: '0 8px 32px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.8)',
      panel: '0 20px 60px rgba(0, 0, 0, 0.95), 0 4px 16px rgba(0, 0, 0, 0.85)',
      glow: '0 0 20px rgba(251, 146, 60, 0.40)',
      glowStrong: '0 0 40px rgba(251, 146, 60, 0.65)',
      inset: 'inset 0 1px 3px rgba(0, 0, 0, 0.8)',
      raised: '0 4px 16px rgba(0, 0, 0, 0.85), 0 1px 4px rgba(0, 0, 0, 0.7)',
    },
    opacity: {
      disabled: '0.35',
      hover: '0.9',
      faint: '0.12',
      semiOpaque: '0.75',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #fb923c, #f97316)',
      primarySubtle: 'linear-gradient(135deg, rgba(251,146,60,0.18), rgba(249,115,22,0.06))',
      surface: 'linear-gradient(180deg, #080f1e 0%, #000000 100%)',
      card: 'linear-gradient(145deg, #0d1a2e 0%, #080f1e 100%)',
      hero: 'linear-gradient(135deg, #000000 0%, #080f1e 50%, #0d1a2e 100%)',
      radial: 'radial-gradient(ellipse at top, #0d1a2e, #000000)',
      secondary: 'linear-gradient(to bottom, #0d1a2e, #080f1e)',
    },
    blur: {
      small: 'blur(4px)',
      medium: 'blur(12px)',
      large: 'blur(24px)',
    },
  },
};
