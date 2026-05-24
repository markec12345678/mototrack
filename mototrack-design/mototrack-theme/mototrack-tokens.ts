/**
 * MotoTrack dark motorcycle theme tokens.
 * All values are translated automatically to CSS variables by Sparks.
 */
export function mototrackTokens() {
  const tokens = {
    /**
     * Color Palette — dark motorcycle aesthetic
     */
    colors: {
      primary: {
        default: '#f97316',   // Accent orange — brand identity
        hover: '#ea580c',     // Darker orange on hover
        active: '#c2410c',    // Pressed state
      },
      secondary: {
        default: '#94a3b8',   // Slate secondary
        hover: '#cbd5e1',     // Lighter on hover
        active: '#64748b',    // Muted on active
      },
      surface: {
        background: '#020617',  // --bg-app: deepest dark
        primary: '#0f172a',     // --bg-card: card surface
        secondary: '#1e293b',   // --bg-card-elev: elevated card
      },
      text: {
        primary: '#f1f5f9',    // --text-primary: near-white
        default: '#f1f5f9',    // alias
        secondary: '#94a3b8',  // --text-secondary: slate
        muted: '#64748b',      // --text-muted: dimmed
        inverse: '#020617',    // Dark text on light surfaces
      },
      border: {
        default: 'rgba(148, 163, 184, 0.15)',  // --border: subtle slate border
        strong: 'rgba(148, 163, 184, 0.30)',   // More visible border
        focus: '#f97316',                       // Orange focus ring
      },
      status: {
        success: { default: '#22c55e', subtle: 'rgba(34, 197, 94, 0.15)' },
        warning: { default: '#eab308', subtle: 'rgba(234, 179, 8, 0.15)' },
        danger: { default: '#ef4444', subtle: 'rgba(239, 68, 68, 0.15)' },
        info: { default: '#3b82f6', subtle: 'rgba(59, 130, 246, 0.15)' },
      },
      overlay: 'rgba(2, 6, 23, 0.80)',

      /**
       * Country / flag palette — used for nationality indicators
       */
      flags: {
        red: '#ef4444',
        blue: '#3b82f6',
        yellow: '#eab308',
        green: '#22c55e',
        white: '#f1f5f9',
        black: '#020617',
        orange: '#f97316',
        purple: '#a855f7',
        pink: '#ec4899',
        teal: '#14b8a6',
        gold: '#f59e0b',
        silver: '#94a3b8',
        bronze: '#b45309',
      },
    },

    borders: {
      default: {
        color: 'rgba(148, 163, 184, 0.15)',
        width: '1px',
        style: 'solid',
      },
      focus: {
        color: '#f97316',
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

    /**
     * Typography — xs → 3xl scale, mobile-first
     */
    typography: {
      fontFamily: "'Inter', 'Roboto', system-ui, -apple-system, sans-serif",
      sizes: {
        xs: '11px',
        sm: '13px',
        base: '15px',
        md: '15px',
        lg: '17px',
        xl: '20px',
        xxl: '24px',
        xxxl: '30px',
        display: { large: '56px', medium: '44px', small: '36px' },
        heading: {
          h1: '32px',
          h2: '26px',
          h3: '22px',
          h4: '18px',
          h5: '16px',
          h6: '14px',
        },
        body: { large: '17px', medium: '15px', default: '15px', small: '13px' },
        caption: { default: '11px', medium: '13px' },
      },
      lineHeight: {
        base: '1.6',
        heading: '1.25',
        tight: '1.1',
        relaxed: '1.75',
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
        extraBold: '800',
      },
      letterSpacing: {
        tight: '-0.03em',
        normal: '0',
        wide: '0.04em',
        wider: '0.08em',
        widest: '0.12em',
      },
    },

    /**
     * Spacing — 4px base scale
     */
    spacing: {
      default: '8px',
      px: '1px',
      xs: '4px',
      sm: '8px',
      small: '8px',
      md: '12px',
      medium: '12px',
      lg: '16px',
      large: '16px',
      xl: '24px',
      xxl: '32px',
      x3l: '48px',
      x4l: '64px',
      x4: '32px',
    },

    layout: {
      maxPageWidth: '1440px',
      gutter: '24px',
    },

    /**
     * Visual Effects — floating panels, depth layers
     */
    effects: {
      shadows: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.5)',
        small: '0 2px 8px rgba(0, 0, 0, 0.6)',
        medium: '0 4px 16px rgba(0, 0, 0, 0.7)',
        large: '0 8px 32px rgba(0, 0, 0, 0.75)',
        xLarge: '0 16px 48px rgba(0, 0, 0, 0.8)',
        floating: '0 8px 32px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.6)',
        panel: '0 20px 60px rgba(0, 0, 0, 0.85), 0 4px 16px rgba(0, 0, 0, 0.7)',
        glow: '0 0 20px rgba(249, 115, 22, 0.35)',
        glowStrong: '0 0 40px rgba(249, 115, 22, 0.55)',
        inset: 'inset 0 1px 3px rgba(0, 0, 0, 0.6)',
        raised: '0 4px 16px rgba(0, 0, 0, 0.7), 0 1px 4px rgba(0, 0, 0, 0.5)',
      },
      opacity: {
        disabled: '0.4',
        hover: '0.85',
        faint: '0.15',
        semiOpaque: '0.7',
      },
      gradients: {
        primary: 'linear-gradient(135deg, #f97316, #ea580c)',
        primarySubtle: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.05))',
        surface: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
        card: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
        hero: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)',
        radial: 'radial-gradient(ellipse at top, #1e293b, #020617)',
        secondary: 'linear-gradient(to bottom, #1e293b, #0f172a)',
      },
      blur: {
        small: 'blur(4px)',
        medium: 'blur(12px)',
        large: 'blur(24px)',
      },
    },

    /**
     * Interaction & Motion
     */
    interactions: {
      cursor: {
        pointer: 'pointer',
        disabled: 'not-allowed',
        text: 'text',
        grab: 'grab',
        grabbing: 'grabbing',
      },
      zIndex: {
        base: '1',
        sticky: '50',
        modal: '100',
        tooltip: '200',
        overlay: '300',
      },
      gradients: {
        primary: 'linear-gradient(135deg, #f97316, #ea580c)',
        secondary: 'linear-gradient(135deg, #1e293b, #0f172a)',
        subtle: 'linear-gradient(to bottom, rgba(30,41,59,0.8), rgba(15,23,42,0.6))',
        codeBlock: 'linear-gradient(to right, rgba(15,23,42,1), rgba(30,41,59,1))',
      },
      transitions: {
        duration: {
          fast: '0.12s',
          medium: '0.25s',
          slow: '0.4s',
          verySlow: '0.8s',
        },
        easing: {
          easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
          easeOut: 'ease-out',
          easeIn: 'ease-in',
          spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        },
        property: {
          all: 'all',
          transform: 'transform',
          opacity: 'opacity',
          color: 'color',
          shadow: 'box-shadow',
        },
      },
      hoverEffect: {
        scale: 'scale(1.03)',
        translateY: 'translateY(-3px)',
        shadow: '0 8px 32px rgba(0, 0, 0, 0.75)',
      },
    },
  };

  return tokens;
}

/**
 * MotoTrack theme schema type — use as CSS variables in components.
 * Example: `colors.surface.background` → `--colors-surface-background`
 */
export type MototrackThemeSchema = ReturnType<typeof mototrackTokens>;
