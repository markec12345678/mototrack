import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { CtaButton } from './cta-button.js';

// ── Shared layout helpers ──────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  padding: '56px 40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '56px',
};

const sectionStyle: React.CSSProperties = {
  maxWidth: '860px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '24px',
  marginTop: 0,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  alignItems: 'center',
  gap: '20px',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'rgba(148,163,184,0.12)',
  maxWidth: '860px',
};

const heroImageUrl =
  'https://storage.googleapis.com/bit-generated-images/images/image_dark_motorcycle_racing_dashboa_0_1779617973517.png';

// ── Inline SVG icons ───────────────────────────────────────────────────────

function SosIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4l11 6-11 6V4z" fill="currentColor" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 4h9l3 3v9a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 4v5H7V4M7 13v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

// ── Compositions ───────────────────────────────────────────────────────────

/**
 * All Variants — default, start-ride, sos, save-route side by side.
 */
export const AllVariants = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>CTA Button Variants</p>
          <div style={rowStyle}>
            <CtaButton variant="default" rightIcon={<ArrowRightIcon />}>
              Get Started
            </CtaButton>
            <CtaButton variant="start-ride" leftIcon={<PlayIcon />}>
              Start Ride
            </CtaButton>
            <CtaButton variant="save-route" leftIcon={<SaveIcon />}>
              Save Route
            </CtaButton>
            <CtaButton variant="sos" leftIcon={<SosIcon />}>
              SOS
            </CtaButton>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>States</p>
          <div style={rowStyle}>
            <CtaButton variant="start-ride" leftIcon={<PlayIcon />} loading>
              Starting...
            </CtaButton>
            <CtaButton variant="save-route" leftIcon={<SaveIcon />} disabled>
              Save Route
            </CtaButton>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>Full Width</p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px', maxWidth: '480px' }}>
            <CtaButton variant="start-ride" leftIcon={<PlayIcon />} fullWidth>
              Start Ride
            </CtaButton>
            <CtaButton variant="save-route" leftIcon={<SaveIcon />} fullWidth>
              Save Route
            </CtaButton>
            <CtaButton variant="sos" leftIcon={<SosIcon />} fullWidth>
              SOS — Emergency
            </CtaButton>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * HeroLanding — CTA buttons placed in a realistic landing page hero section.
 */
export const HeroLanding = () => {
  return (
    <MockProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#020617' }}>
        {/* Hero */}
        <div style={{ position: 'relative', height: '520px', overflow: 'hidden' }}>
          <img
            src={heroImageUrl}
            alt="MotoTrack Hero"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(2,6,23,0.25) 0%, rgba(2,6,23,0.85) 70%, #020617 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '56px 32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                backgroundColor: 'rgba(249,115,22,0.15)',
                borderRadius: '9999px',
                border: '1px solid rgba(249,115,22,0.35)',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#f97316',
                  boxShadow: '0 0 6px rgba(249,115,22,0.9)',
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#f97316', letterSpacing: '0.1em' }}>
                LIVE TRACKING ACTIVE
              </span>
            </div>

            <h1
              style={{
                margin: '0 0 12px',
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 800,
                color: '#f1f5f9',
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
              }}
            >
              Ride Smarter.
              <br />
              <span style={{ color: '#f97316' }}>Track Everything.</span>
            </h1>

            <p
              style={{
                margin: '0 0 36px',
                fontSize: '17px',
                color: '#94a3b8',
                maxWidth: '520px',
                lineHeight: 1.6,
              }}
            >
              Real-time GPS tracking, route analytics, and emergency SOS — all in one app built for riders.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const, justifyContent: 'center' }}>
              <CtaButton variant="start-ride" leftIcon={<PlayIcon />} rightIcon={<ArrowRightIcon />}>
                Start Ride
              </CtaButton>
              <CtaButton variant="default" rightIcon={<MapPinIcon />}>
                Explore Routes
              </CtaButton>
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div style={{ padding: '48px 40px', maxWidth: '860px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: '#f97316',
              marginBottom: '24px',
              marginTop: 0,
            }}
          >
            Quick Actions
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              {
                variant: 'start-ride' as const,
                icon: <PlayIcon />,
                label: 'Start Ride',
                desc: 'Begin GPS tracking your session',
              },
              {
                variant: 'save-route' as const,
                icon: <SaveIcon />,
                label: 'Save Route',
                desc: 'Bookmark this route for later',
              },
              {
                variant: 'sos' as const,
                icon: <SosIcon />,
                label: 'SOS',
                desc: 'Alert emergency contacts instantly',
              },
            ].map(({ variant, icon, label, desc }) => (
              <div
                key={label}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '16px',
                  padding: '28px 24px',
                  border: '1px solid rgba(148,163,184,0.1)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  gap: '16px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#f1f5f9',
                      marginBottom: '6px',
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{desc}</div>
                </div>
                <CtaButton variant={variant} leftIcon={icon} fullWidth>
                  {label}
                </CtaButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * InteractiveSOS — Interactive SOS button with confirmation flow.
 */
export const InteractiveSOS = () => {
  const [phase, setPhase] = useState<'idle' | 'confirming' | 'sending' | 'sent'>('idle');

  const handleSos = () => {
    if (phase === 'idle') {
      setPhase('confirming');
      return;
    }
    if (phase === 'confirming') {
      setPhase('sending');
      setTimeout(() => setPhase('sent'), 2200);
    }
  };

  const handleCancel = () => setPhase('idle');

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 32px',
        }}
      >
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '24px',
            padding: '48px 40px',
            border: '1px solid rgba(148,163,184,0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center' as const,
          }}
        >
          {/* Status indicator */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor:
                phase === 'sent'
                  ? 'rgba(34,197,94,0.15)'
                  : phase === 'sending'
                  ? 'rgba(239,68,68,0.2)'
                  : 'rgba(249,115,22,0.1)',
              border: `2px solid ${
                phase === 'sent' ? '#22c55e' : phase === 'sending' ? '#ef4444' : 'rgba(249,115,22,0.3)'
              }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              transition: 'all 0.3s ease',
            }}
          >
            {phase === 'sent' ? (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M5 14l7 7 11-11" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="10" stroke={phase === 'sending' ? '#ef4444' : '#f97316'} strokeWidth="2" />
                <path d="M14 9v7M14 18.5v1" stroke={phase === 'sending' ? '#ef4444' : '#f97316'} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            )}
          </div>

          <h2
            style={{
              margin: '0 0 8px',
              fontSize: '22px',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.02em',
            }}
          >
            {phase === 'sent'
              ? 'Help is on the way'
              : phase === 'sending'
              ? 'Sending SOS...'
              : phase === 'confirming'
              ? 'Confirm Emergency'
              : 'Emergency SOS'}
          </h2>

          <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
            {phase === 'sent'
              ? 'Your emergency contacts and nearby services have been notified with your GPS location.'
              : phase === 'sending'
              ? 'Alerting your emergency contacts and sharing your GPS coordinates...'
              : phase === 'confirming'
              ? 'This will alert your emergency contacts and share your current GPS location. Are you sure?'
              : 'Press the button below to alert your emergency contacts and share your live location.'}
          </p>

          {phase !== 'sent' && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              <CtaButton
                variant="sos"
                leftIcon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                }
                fullWidth
                loading={phase === 'sending'}
                onClick={handleSos}
              >
                {phase === 'confirming' ? 'Yes, Send SOS' : phase === 'sending' ? 'Sending...' : 'Send SOS Alert'}
              </CtaButton>

              {phase === 'confirming' && (
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '12px',
                    padding: '14px',
                    color: '#94a3b8',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          )}

          {phase === 'sent' && (
            <div
              style={{
                padding: '14px 20px',
                backgroundColor: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: '12px',
                fontSize: '13px',
                color: '#22c55e',
                fontWeight: 600,
              }}
            >
              SOS sent · GPS shared · ETA: ~8 min
            </div>
          )}
        </div>
      </div>
    </MockProvider>
  );
};
