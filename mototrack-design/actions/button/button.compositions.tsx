import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Button } from './button.js';

// ── Shared layout helpers ──────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  padding: '48px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
};

const sectionStyle: React.CSSProperties = {
  maxWidth: '800px',
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
  gap: '12px',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'rgba(148,163,184,0.12)',
  maxWidth: '800px',
};

// ── Inline SVG icons ───────────────────────────────────────────────────────

function FlagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2v12M3 2h9l-2 4 2 4H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3l8 5-8 5V3z" fill="currentColor" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Compositions ───────────────────────────────────────────────────────────

/**
 * All Variants — primary, secondary, ghost, danger, success side by side.
 */
export const AllVariants = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Button Variants</p>
          <div style={rowStyle}>
            <Button variant="primary">Register Now</Button>
            <Button variant="secondary">View Results</Button>
            <Button variant="ghost">Learn More</Button>
            <Button variant="danger">Remove Rider</Button>
            <Button variant="success">Confirm Entry</Button>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>With Left Icon</p>
          <div style={rowStyle}>
            <Button variant="primary" leftIcon={<PlayIcon />}>Watch Live</Button>
            <Button variant="secondary" leftIcon={<FlagIcon />}>Race Calendar</Button>
            <Button variant="ghost" leftIcon={<PlusIcon />}>Add Rider</Button>
            <Button variant="danger" leftIcon={<TrashIcon />}>Delete Session</Button>
            <Button variant="success" leftIcon={<CheckIcon />}>Approve Entry</Button>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>With Right Icon</p>
          <div style={rowStyle}>
            <Button variant="primary" rightIcon={<ArrowRightIcon />}>View Standings</Button>
            <Button variant="secondary" rightIcon={<ArrowRightIcon />}>Race Details</Button>
            <Button variant="ghost" rightIcon={<ArrowRightIcon />}>All Circuits</Button>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>As Link (href)</p>
          <div style={rowStyle}>
            <Button variant="primary" href="/races" rightIcon={<ArrowRightIcon />}>Race Calendar</Button>
            <Button variant="secondary" href="/riders">Rider Standings</Button>
            <Button variant="ghost" href="/circuits">Circuit Guide</Button>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * All Sizes — sm, md, lg, xl for primary variant.
 */
export const AllSizes = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Size Scale</p>
          <div style={{ ...rowStyle, alignItems: 'flex-end' }}>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" size="xl">Extra Large</Button>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>Secondary — All Sizes</p>
          <div style={{ ...rowStyle, alignItems: 'flex-end' }}>
            <Button variant="secondary" size="sm">Small</Button>
            <Button variant="secondary" size="md">Medium</Button>
            <Button variant="secondary" size="lg">Large</Button>
            <Button variant="secondary" size="xl">Extra Large</Button>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>With Icons — All Sizes</p>
          <div style={{ ...rowStyle, alignItems: 'flex-end' }}>
            <Button variant="primary" size="sm" leftIcon={<PlayIcon />}>Watch</Button>
            <Button variant="primary" size="md" leftIcon={<PlayIcon />}>Watch Live</Button>
            <Button variant="primary" size="lg" leftIcon={<PlayIcon />}>Watch Live Race</Button>
            <Button variant="primary" size="xl" leftIcon={<PlayIcon />} rightIcon={<ArrowRightIcon />}>Watch Live Race Now</Button>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * States — loading, disabled, full-width, and interactive demo.
 */
export const States = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setSubmitted(false);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Loading State</p>
          <div style={rowStyle}>
            <Button variant="primary" loading>Registering...</Button>
            <Button variant="secondary" loading>Loading Results</Button>
            <Button variant="danger" loading>Removing...</Button>
            <Button variant="success" loading>Saving...</Button>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>Disabled State</p>
          <div style={rowStyle}>
            <Button variant="primary" disabled>Register Now</Button>
            <Button variant="secondary" disabled>View Results</Button>
            <Button variant="ghost" disabled>Learn More</Button>
            <Button variant="danger" disabled>Delete</Button>
            <Button variant="success" disabled>Confirm</Button>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>Full Width</p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px', maxWidth: '480px' }}>
            <Button variant="primary" fullWidth leftIcon={<PlayIcon />}>Watch Live Race</Button>
            <Button variant="secondary" fullWidth>View Full Standings</Button>
            <Button variant="ghost" fullWidth>Browse All Circuits</Button>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>Interactive — Submit Entry</p>
          <div
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(148,163,184,0.12)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              maxWidth: '400px',
            }}
          >
            <div style={{ marginBottom: '8px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#f97316' }}>
              Race Entry Form
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              Qatar Grand Prix
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#64748b' }}>
              Submit your entry for the upcoming race. Entries close 48 hours before race day.
            </p>
            {submitted && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(34,197,94,0.12)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              >
                <CheckIcon />
                <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>Entry submitted successfully!</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                leftIcon={!loading ? <FlagIcon /> : undefined}
                onClick={handleSubmit}
                fullWidth
              >
                {loading ? `Submitting...` : `Submit Entry`}
              </Button>
              <Button variant="ghost" size="lg" disabled={loading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
