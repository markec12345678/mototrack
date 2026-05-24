import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Link } from './link.js';

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  padding: '48px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
};

const sectionStyle: React.CSSProperties = {
  maxWidth: '720px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '20px',
  marginTop: 0,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  alignItems: 'center',
  gap: '24px',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'rgba(148,163,184,0.12)',
  maxWidth: '720px',
};

const descStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#64748b',
  marginTop: '12px',
  marginBottom: 0,
};

/**
 * All three link variants side by side — default, button, subtle.
 */
export const AllVariants = () => {
  return (
    <MockProvider>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Default Variant</p>
          <div style={rowStyle}>
            <Link href="/races" variant="default">
              Race Calendar
            </Link>
            <Link href="/riders" variant="default">
              Rider Standings
            </Link>
            <Link href="/circuits" variant="default">
              Circuit Guide
            </Link>
          </div>
          <p style={descStyle}>
            Inline text link with accent underline on hover. Ideal for body copy and navigation.
          </p>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>Button Variant</p>
          <div style={rowStyle}>
            <Link href="/register" variant="button">
              Register Now
            </Link>
            <Link href="/live" variant="button">
              Watch Live
            </Link>
            <Link href="/results" variant="button">
              View Results
            </Link>
          </div>
          <p style={descStyle}>
            Pill-shaped CTA button with accent background and glow shadow on hover.
          </p>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>Subtle Variant</p>
          <div style={rowStyle}>
            <Link href="/privacy" variant="subtle">
              Privacy Policy
            </Link>
            <Link href="/terms" variant="subtle">
              Terms of Service
            </Link>
            <Link href="/contact" variant="subtle">
              Contact Us
            </Link>
          </div>
          <p style={descStyle}>
            Muted secondary text that brightens to accent on hover. Great for footers and secondary navigation.
          </p>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * External links — opens in new tab with security rel attributes and an arrow icon.
 */
export const ExternalLinks = () => {
  return (
    <MockProvider>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>External Links</p>
          <div style={rowStyle}>
            <Link href="https://www.motogp.com" external variant="default">
              MotoGP Official
            </Link>
            <Link href="https://www.fim-moto.com" external variant="default">
              FIM Website
            </Link>
          </div>
          <div style={{ ...rowStyle, marginTop: '16px' }}>
            <Link href="https://www.motogp.com/live" external variant="button">
              Live Stream
            </Link>
            <Link href="https://www.motogp.com/standings" external variant="button">
              World Standings
            </Link>
          </div>
          <div style={{ ...rowStyle, marginTop: '16px' }}>
            <Link href="https://www.motogp.com/news" external variant="subtle">
              Latest News
            </Link>
            <Link href="https://www.motogp.com/videos" external variant="subtle">
              Video Archive
            </Link>
          </div>
          <p style={descStyle}>
            External links open in a new tab with <code style={{ color: '#f97316', fontSize: '12px' }}>rel=&quot;noopener noreferrer&quot;</code> and display an arrow icon.
          </p>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * In-context usage — links embedded inside realistic MotoTrack UI.
 */
export const InContext = () => {
  const races = [
    { id: 1, name: 'Qatar Grand Prix', circuit: 'Losail International Circuit', date: 'Mar 2', href: '/races/qatar' },
    { id: 2, name: 'Spanish Grand Prix', circuit: 'Circuito de Jerez', date: 'Apr 27', href: '/races/spain' },
    { id: 3, name: 'Italian Grand Prix', circuit: 'Autodromo del Mugello', date: 'Jun 1', href: '/races/italy' },
  ];

  return (
    <MockProvider>
      <div style={containerStyle}>
        <div style={{ maxWidth: '640px' }}>
          <p style={labelStyle}>Upcoming Races</p>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px', marginBottom: '32px' }}>
            {races.map((race) => (
              <div
                key={race.id}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  border: '1px solid rgba(148,163,184,0.12)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {race.date}
                  </div>
                  <Link href={race.href} variant="default">
                    {race.name}
                  </Link>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{race.circuit}</div>
                </div>
                <Link href={race.href} variant="button">
                  Details
                </Link>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid rgba(148,163,184,0.12)' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link href="/privacy" variant="subtle">Privacy</Link>
              <Link href="/terms" variant="subtle">Terms</Link>
              <Link href="/contact" variant="subtle">Contact</Link>
            </div>
            <Link href="https://www.fim-moto.com" external variant="subtle">
              FIM Official
            </Link>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
