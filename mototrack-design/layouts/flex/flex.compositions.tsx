import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Flex } from './flex.js';

// ─── Shared demo helpers ──────────────────────────────────────────────────────

function Box({
  label,
  accent,
  wide,
}: {
  label: string;
  accent?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      style={{
        padding: wide ? '12px 24px' : '12px 16px',
        borderRadius: '8px',
        backgroundColor: accent ? '#f97316' : '#0f172a',
        border: `1px solid ${accent ? '#f97316' : 'rgba(148,163,184,0.15)'}`,
        color: accent ? '#020617' : '#f1f5f9',
        fontSize: '13px',
        fontWeight: accent ? '700' : '500',
        whiteSpace: 'nowrap' as const,
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      }}
    >
      {label}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: '0 0 12px',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
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
        margin: '32px 0',
      }}
    />
  );
}

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * Showcase — direction, gap, align, justify, wrap all in one page.
 */
export const FlexShowcase = () => {
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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1
            style={{
              margin: '0 0 4px',
              fontSize: '28px',
              fontWeight: '800',
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
            }}
          >
            Flex Primitive
          </h1>
          <p style={{ margin: '0 0 40px', fontSize: '14px', color: '#64748b' }}>
            Layout building block — direction, gap, align, justify &amp; wrap.
          </p>

          {/* Direction */}
          <SectionLabel>direction</SectionLabel>
          <Flex gap="md" direction="column">
            <Flex gap="sm" align="center">
              <Box label="row (default)" accent />
              <Box label="Item A" />
              <Box label="Item B" />
              <Box label="Item C" />
            </Flex>
            <Flex gap="sm" direction="row-reverse" align="center">
              <Box label="row-reverse" accent />
              <Box label="Item A" />
              <Box label="Item B" />
              <Box label="Item C" />
            </Flex>
            <Flex gap="sm" direction="column" style={{ width: '200px' }}>
              <Box label="column" accent />
              <Box label="Item A" />
              <Box label="Item B" />
            </Flex>
          </Flex>

          <Divider />

          {/* Gap */}
          <SectionLabel>gap tokens</SectionLabel>
          <Flex direction="column" gap="md">
            {(['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).map((g) => (
              <Flex key={g} align="center" gap={g}>
                <div
                  style={{
                    width: '48px',
                    fontSize: '11px',
                    color: '#64748b',
                    fontFamily: 'monospace',
                    flexShrink: 0,
                  }}
                >
                  {g}
                </div>
                <Box label="A" />
                <Box label="B" />
                <Box label="C" />
              </Flex>
            ))}
          </Flex>

          <Divider />

          {/* Justify */}
          <SectionLabel>justify</SectionLabel>
          <Flex direction="column" gap="sm" fullWidth>
            {(
              [
                'flex-start',
                'center',
                'flex-end',
                'space-between',
                'space-around',
                'space-evenly',
              ] as const
            ).map((j) => (
              <div key={j}>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    fontFamily: 'monospace',
                    marginBottom: '4px',
                  }}
                >
                  {j}
                </div>
                <Flex
                  justify={j}
                  gap="sm"
                  fullWidth
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    padding: '10px',
                    border: '1px solid rgba(148,163,184,0.1)',
                  }}
                >
                  <Box label="A" />
                  <Box label="B" />
                  <Box label="C" />
                </Flex>
              </div>
            ))}
          </Flex>

          <Divider />

          {/* Align */}
          <SectionLabel>align</SectionLabel>
          <Flex gap="md" wrap="wrap">
            {(['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] as const).map((a) => (
              <div key={a} style={{ flex: '1 1 140px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    fontFamily: 'monospace',
                    marginBottom: '4px',
                  }}
                >
                  {a}
                </div>
                <Flex
                  align={a}
                  gap="xs"
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    padding: '10px',
                    height: '80px',
                    border: '1px solid rgba(148,163,184,0.1)',
                  }}
                >
                  <Box label="A" />
                  <Box label="B" />
                </Flex>
              </div>
            ))}
          </Flex>

          <Divider />

          {/* Wrap */}
          <SectionLabel>wrap</SectionLabel>
          <Flex direction="column" gap="md">
            {(['nowrap', 'wrap', 'wrap-reverse'] as const).map((w) => (
              <div key={w}>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    fontFamily: 'monospace',
                    marginBottom: '4px',
                  }}
                >
                  {w}
                </div>
                <Flex
                  wrap={w}
                  gap="sm"
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    padding: '10px',
                    width: '320px',
                    border: '1px solid rgba(148,163,184,0.1)',
                  }}
                >
                  {['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'].map((p) => (
                    <Box key={p} label={p} />
                  ))}
                </Flex>
              </div>
            ))}
          </Flex>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Responsive — direction and gap change across breakpoints.
 */
export const ResponsiveFlex = () => {
  const riders = [
    { name: `Marc Márquez`, number: 93, team: `Gresini Racing` },
    { name: `Pecco Bagnaia`, number: 1, team: `Ducati Lenovo` },
    { name: `Jorge Martín`, number: 89, team: `Pramac Racing` },
    { name: `Luca Marini`, number: 10, team: `Repsol Honda` },
  ];

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '32px 24px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p
            style={{
              margin: '0 0 4px',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: '#f97316',
            }}
          >
            Responsive Layout
          </p>
          <h2
            style={{
              margin: '0 0 8px',
              fontSize: '22px',
              fontWeight: '800',
              color: '#f1f5f9',
              letterSpacing: '-0.02em',
            }}
          >
            Rider Grid
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: '13px', color: '#64748b' }}>
            Stacks vertically on mobile, switches to a row on laptop+.
          </p>

          {/* Responsive Flex: column on mobile, row on laptop */}
          <Flex
            direction={{ mobile: 'column', laptop: 'row' }}
            gap={{ mobile: 'md', laptop: 'lg' }}
            wrap="wrap"
          >
            {riders.map((rider) => (
              <div
                key={rider.number}
                style={{
                  flex: '1 1 180px',
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(148,163,184,0.12)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                }}
              >
                <Flex direction="column" gap="xs">
                  <span
                    style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: '#f97316',
                      letterSpacing: '-0.03em',
                      lineHeight: '1',
                    }}
                  >
                    #{rider.number}
                  </span>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#f1f5f9',
                      marginTop: '4px',
                    }}
                  >
                    {rider.name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{rider.team}</span>
                </Flex>
              </div>
            ))}
          </Flex>

          <div
            style={{
              marginTop: '40px',
              padding: '16px 20px',
              backgroundColor: '#0f172a',
              borderRadius: '10px',
              border: '1px solid rgba(148,163,184,0.1)',
            }}
          >
            <p
              style={{
                margin: '0 0 8px',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: '#64748b',
              }}
            >
              Responsive props used
            </p>
            <Flex gap="lg" wrap="wrap">
              {[
                { prop: 'direction', value: `{ mobile: 'column', laptop: 'row' }` },
                { prop: 'gap', value: `{ mobile: 'md', laptop: 'lg' }` },
                { prop: 'wrap', value: `'wrap'` },
              ].map(({ prop, value }) => (
                <Flex key={prop} direction="column" gap="xs">
                  <span
                    style={{ fontSize: '11px', color: '#f97316', fontFamily: 'monospace', fontWeight: '600' }}
                  >
                    {prop}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                    {value}
                  </span>
                </Flex>
              ))}
            </Flex>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * AsElement — renders Flex as semantic HTML elements (nav, ul, li, section).
 */
export const AsSemanticElements = () => {
  const navItems = [`Race Calendar`, `Standings`, `Teams`, `Live Timing`, `Stats`];

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '32px 24px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p
            style={{
              margin: '0 0 4px',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: '#f97316',
            }}
          >
            Semantic HTML
          </p>
          <h2
            style={{
              margin: '0 0 8px',
              fontSize: '22px',
              fontWeight: '800',
              color: '#f1f5f9',
              letterSpacing: '-0.02em',
            }}
          >
            as=&quot;nav&quot; / as=&quot;ul&quot;
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: '13px', color: '#64748b' }}>
            Flex renders any HTML element while keeping flex layout behaviour.
          </p>

          {/* Nav bar */}
          <Flex
            as="nav"
            justify="space-between"
            align="center"
            gap="md"
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              padding: '12px 20px',
              border: '1px solid rgba(148,163,184,0.12)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#f97316',
                letterSpacing: '-0.02em',
              }}
            >
              MotoTrack
            </span>
            <Flex as="ul" gap="sm" align="center" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {navItems.map((item) => (
                <li key={item}>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      transition: 'color 0.15s',
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </Flex>
            <Box label="Sign In" accent wide />
          </Flex>

          {/* Section with inline flex badges */}
          <Flex as="section" direction="column" gap="lg">
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: '#94a3b8',
                lineHeight: '1.6',
              }}
            >
              The <code style={{ color: '#f97316', fontFamily: 'monospace' }}>as</code> prop lets you
              render Flex as any semantic HTML element — keeping accessibility intact while
              applying flex layout.
            </p>

            <Flex gap="sm" wrap="wrap" align="center">
              {[
                { label: 'as="nav"', color: '#3b82f6' },
                { label: 'as="ul"', color: '#22c55e' },
                { label: 'as="section"', color: '#a855f7' },
                { label: 'as="article"', color: '#f97316' },
                { label: 'as="header"', color: '#eab308' },
                { label: 'as="footer"', color: '#64748b' },
              ].map(({ label, color }) => (
                <Flex
                  key={label}
                  as="span"
                  inline
                  align="center"
                  gap="xs"
                  style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    backgroundColor: `${color}20`,
                    border: `1px solid ${color}50`,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: '600', color, fontFamily: 'monospace' }}>
                    {label}
                  </span>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </div>
      </div>
    </MockProvider>
  );
};
