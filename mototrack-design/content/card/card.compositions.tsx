import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Card } from './card.js';

// ─── Shared layout helpers ────────────────────────────────────────────────────

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '40px 32px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {children}
        </div>
      </div>
    </MockProvider>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: '0 0 16px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#f97316',
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: '1px',
        backgroundColor: 'rgba(148,163,184,0.12)',
        margin: '40px 0',
      }}
    />
  );
}

// ─── Stat card content ────────────────────────────────────────────────────────

function StatContent({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#64748b',
          marginBottom: '10px',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: accent ?? '#f1f5f9',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * All Variants — showcases default, elevated, outlined, and danger cards side by side.
 */
export const AllVariants = () => {
  const variants: Array<{
    variant: 'default' | 'elevated' | 'outlined' | 'danger';
    label: string;
    description: string;
  }> = [
    {
      variant: 'default',
      label: 'Default',
      description: 'Standard surface card with a subtle border and minimal shadow. Ideal for general content blocks.',
    },
    {
      variant: 'elevated',
      label: 'Elevated',
      description: 'Deeper background with a prominent shadow. Use for featured content or floating panels.',
    },
    {
      variant: 'outlined',
      label: 'Outlined',
      description: 'Transparent background with a strong border. Great for secondary or ghost-style containers.',
    },
    {
      variant: 'danger',
      label: 'Danger',
      description: 'Danger-tinted background and border. Use for alerts, warnings, or destructive action zones.',
    },
  ];

  return (
    <PageWrapper>
      <SectionLabel>Card Variants</SectionLabel>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {variants.map(({ variant, label, description }) => (
          <Card key={variant} variant={variant} padding="lg">
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#f97316',
                marginBottom: '8px',
              }}
            >
              {label}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: '#94a3b8',
                lineHeight: 1.6,
              }}
            >
              {description}
            </p>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
};

/**
 * Hover Lift — interactive cards with the lift effect enabled.
 */
export const HoverLift = () => {
  const stats = [
    { label: 'Lap Time', value: '1:23.456', unit: undefined, accent: '#f97316' },
    { label: 'Top Speed', value: '312', unit: 'km/h', accent: '#4ade80' },
    { label: 'Position', value: 'P1', unit: undefined, accent: '#facc15' },
    { label: 'Tyre Life', value: '87', unit: '%', accent: '#60a5fa' },
  ];

  return (
    <PageWrapper>
      <SectionLabel>Hover Lift Effect</SectionLabel>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: '13px',
          color: '#64748b',
        }}
      >
        Hover over each card to see the lift animation.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        {stats.map((stat) => (
          <Card key={stat.label} variant="elevated" padding="lg" hoverLift>
            <StatContent
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
              accent={stat.accent}
            />
          </Card>
        ))}
      </div>

      <Divider />

      <SectionLabel>Outlined + Hover Lift</SectionLabel>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        {stats.map((stat) => (
          <Card key={stat.label} variant="outlined" padding="lg" hoverLift>
            <StatContent
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
              accent={stat.accent}
            />
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
};

/**
 * Padding Scale — demonstrates all padding options on a single variant.
 */
export const PaddingScale = () => {
  const paddings: Array<{ padding: 'none' | 'sm' | 'md' | 'lg' | 'xl'; label: string }> = [
    { padding: 'none', label: 'none — 0px' },
    { padding: 'sm', label: 'sm — 8px' },
    { padding: 'md', label: 'md — 12px' },
    { padding: 'lg', label: 'lg — 16px' },
    { padding: 'xl', label: 'xl — 24px' },
  ];

  return (
    <PageWrapper>
      <SectionLabel>Padding Scale</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {paddings.map(({ padding, label }) => (
          <Card key={padding} variant="default" padding={padding}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#f1f5f9',
                  fontFamily: 'monospace',
                }}
              >
                padding=&quot;{padding}&quot;
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  backgroundColor: 'rgba(148,163,184,0.08)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                {label}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Divider />

      <SectionLabel>Race Alert — Danger Card</SectionLabel>
      <Card variant="danger" padding="lg">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239,68,68,0.2)',
              border: '1px solid #ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '16px',
            }}
          >
            ⚠️
          </div>
          <div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#ef4444',
                marginBottom: '4px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Red Flag — Race Suspended
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: '#94a3b8',
                lineHeight: 1.6,
              }}
            >
              An incident on Turn 7 has triggered a red flag. All riders must return to pit lane immediately.
            </p>
          </div>
        </div>
      </Card>
    </PageWrapper>
  );
};
