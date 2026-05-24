import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Icon } from './icon.js';

// ─── Inline SVG glyphs used in compositions ───────────────────────────────────

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 3h16v10H4z" fill="#f97316" />
      <rect x="4" y="13" width="2" height="8" fill="currentColor" />
    </svg>
  );
}

function SpeedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M6 12h1M17 12h1M12 6v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 3h8v8a4 4 0 01-8 0V3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 6H5a2 2 0 000 4h3M16 6h3a2 2 0 010 4h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 15v4M9 21h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C12 21 3 14.5 3 8.5A4.5 4.5 0 0112 6a4.5 4.5 0 019 2.5C21 14.5 12 21 12 21z" />
    </svg>
  );
}

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * SizeShowcase — all icon sizes side by side with a consistent SVG glyph.
 */
export const SizeShowcase = () => {
  const sizes = [`xs`, `sm`, `md`, `lg`, `xl`, `xxl`] as const;
  const labels: Record<string, string> = {
    xs: `xs — 12px`,
    sm: `sm — 16px`,
    md: `md — 20px`,
    lg: `lg — 24px`,
    xl: `xl — 32px`,
    xxl: `xxl — 48px`,
  };

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `48px 32px`,
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
          gap: `48px`,
        }}
      >
        <div style={{ textAlign: `center` }}>
          <p
            style={{
              margin: `0 0 8px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Icon Component
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: `28px`,
              fontWeight: 800,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            Size Scale
          </h1>
          <p style={{ margin: `8px 0 0`, fontSize: `14px`, color: `#64748b` }}>
            xs · sm · md · lg · xl · xxl
          </p>
        </div>

        {/* SVG glyph sizes */}
        <div
          style={{
            backgroundColor: `#0f172a`,
            borderRadius: `16px`,
            padding: `32px 40px`,
            border: `1px solid rgba(148,163,184,0.12)`,
            boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
            display: `flex`,
            alignItems: `flex-end`,
            gap: `32px`,
            flexWrap: `wrap`,
            justifyContent: `center`,
          }}
        >
          {sizes.map((size) => (
            <div
              key={size}
              style={{ display: `flex`, flexDirection: `column`, alignItems: `center`, gap: `12px` }}
            >
              <Icon size={size} color="#f97316">
                <SpeedIcon />
              </Icon>
              <span style={{ fontSize: `10px`, color: `#64748b`, fontFamily: `monospace` }}>
                {labels[size]}
              </span>
            </div>
          ))}
        </div>

        {/* Emoji / string glyph sizes */}
        <div
          style={{
            backgroundColor: `#0f172a`,
            borderRadius: `16px`,
            padding: `32px 40px`,
            border: `1px solid rgba(148,163,184,0.12)`,
            boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
            display: `flex`,
            alignItems: `flex-end`,
            gap: `32px`,
            flexWrap: `wrap`,
            justifyContent: `center`,
          }}
        >
          {sizes.map((size) => (
            <div
              key={size}
              style={{ display: `flex`, flexDirection: `column`, alignItems: `center`, gap: `12px` }}
            >
              <Icon size={size} glyph="🏍️" label="Motorcycle" />
              <span style={{ fontSize: `10px`, color: `#64748b`, fontFamily: `monospace` }}>
                {labels[size]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * ColorVariants — icons rendered with various color tokens and custom colors.
 */
export const ColorVariants = () => {
  const colorSamples = [
    { label: `Primary`, color: `#f97316`, icon: <TrophyIcon /> },
    { label: `Success`, color: `#22c55e`, icon: <HeartIcon /> },
    { label: `Danger`, color: `#ef4444`, icon: <HeartIcon /> },
    { label: `Info`, color: `#3b82f6`, icon: <SpeedIcon /> },
    { label: `Warning`, color: `#eab308`, icon: <TrophyIcon /> },
    { label: `Muted`, color: `#64748b`, icon: <SpeedIcon /> },
    { label: `Inverse`, color: `#f1f5f9`, icon: <FlagIcon /> },
  ];

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `48px 32px`,
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
          gap: `40px`,
        }}
      >
        <div style={{ textAlign: `center` }}>
          <p
            style={{
              margin: `0 0 8px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Icon Component
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: `28px`,
              fontWeight: 800,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            Color Variants
          </h1>
        </div>

        <div
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            gap: `16px`,
            justifyContent: `center`,
          }}
        >
          {colorSamples.map(({ label, color, icon }) => (
            <div
              key={label}
              style={{
                backgroundColor: `#0f172a`,
                borderRadius: `12px`,
                padding: `24px 20px`,
                border: `1px solid rgba(148,163,184,0.12)`,
                boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
                display: `flex`,
                flexDirection: `column`,
                alignItems: `center`,
                gap: `12px`,
                minWidth: `100px`,
              }}
            >
              <Icon size="xl" color={color}>
                {icon}
              </Icon>
              <span style={{ fontSize: `11px`, color: `#94a3b8`, fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: `10px`, color: `#64748b`, fontFamily: `monospace` }}>{color}</span>
            </div>
          ))}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * MotoTrackIconSet — a practical icon set for the MotoTrack racing platform.
 */
export const MotoTrackIconSet = () => {
  const icons: { name: string; glyph: React.ReactNode; emoji?: string }[] = [
    { name: `Speed`, glyph: <SpeedIcon /> },
    { name: `Trophy`, glyph: <TrophyIcon /> },
    { name: `Flag`, glyph: <FlagIcon /> },
    { name: `Favourite`, glyph: <HeartIcon /> },
    { name: `Bike`, emoji: `🏍️`, glyph: `🏍️` },
    { name: `Helmet`, emoji: `🪖`, glyph: `🪖` },
    { name: `Chequered`, emoji: `🏁`, glyph: `🏁` },
    { name: `Stopwatch`, emoji: `⏱️`, glyph: `⏱️` },
  ];

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `48px 32px`,
        }}
      >
        <div style={{ maxWidth: `720px`, margin: `0 auto` }}>
          <p
            style={{
              margin: `0 0 8px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            MotoTrack Design System
          </p>
          <h1
            style={{
              margin: `0 0 4px`,
              fontSize: `28px`,
              fontWeight: 800,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            Icon Set
          </h1>
          <p style={{ margin: `0 0 40px`, fontSize: `14px`, color: `#64748b` }}>
            Building blocks for icon sets across all MotoTrack scopes.
          </p>

          <div
            style={{
              display: `grid`,
              gridTemplateColumns: `repeat(auto-fill, minmax(120px, 1fr))`,
              gap: `16px`,
            }}
          >
            {icons.map(({ name, glyph }) => (
              <div
                key={name}
                style={{
                  backgroundColor: `#0f172a`,
                  borderRadius: `12px`,
                  padding: `24px 16px`,
                  border: `1px solid rgba(148,163,184,0.12)`,
                  boxShadow: `0 2px 8px rgba(0,0,0,0.4)`,
                  display: `flex`,
                  flexDirection: `column`,
                  alignItems: `center`,
                  gap: `12px`,
                  cursor: `pointer`,
                  transition: `border-color 0.15s ease, box-shadow 0.15s ease`,
                }}
              >
                <Icon size="lg" color="#f97316" label={name}>
                  {glyph}
                </Icon>
                <span style={{ fontSize: `11px`, color: `#94a3b8`, fontWeight: 600, textAlign: `center` }}>
                  {name}
                </span>
              </div>
            ))}
          </div>

          {/* Clickable icon demo */}
          <div style={{ marginTop: `40px` }}>
            <p
              style={{
                margin: `0 0 16px`,
                fontSize: `11px`,
                fontWeight: 700,
                letterSpacing: `0.1em`,
                textTransform: `uppercase`,
                color: `#64748b`,
              }}
            >
              Clickable Icons
            </p>
            <div
              style={{
                backgroundColor: `#0f172a`,
                borderRadius: `12px`,
                padding: `24px`,
                border: `1px solid rgba(148,163,184,0.12)`,
                display: `flex`,
                gap: `24px`,
                alignItems: `center`,
                flexWrap: `wrap`,
              }}
            >
              {[`#f97316`, `#22c55e`, `#3b82f6`, `#ef4444`, `#eab308`].map((color) => (
                <Icon
                  key={color}
                  size="lg"
                  color={color}
                  label="Trophy"
                  onClick={() => undefined}
                >
                  <TrophyIcon />
                </Icon>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
