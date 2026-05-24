import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Tooltip } from './tooltip.js';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 32px',
  gap: '64px',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '8px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '32px',
  flexWrap: 'wrap' as const,
};

const triggerButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#0f172a',
  color: '#f1f5f9',
  border: '1px solid rgba(148,163,184,0.2)',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Inter, system-ui, sans-serif',
  transition: 'border-color 0.15s ease',
};

const iconButtonStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(148,163,184,0.2)',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#94a3b8',
  fontSize: '18px',
};

const badgeStyle = (color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 14px',
  backgroundColor: `${color}22`,
  border: `1px solid ${color}55`,
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: 600,
  color,
  cursor: 'default',
});

/**
 * All four tooltip positions — top, bottom, left, right.
 */
export const AllPositions = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Tooltip Positions</p>
          <div style={rowStyle}>
            <Tooltip content="Tooltip on top" position="top">
              <button type="button" style={triggerButtonStyle}>Hover me — Top</button>
            </Tooltip>

            <Tooltip content="Tooltip on bottom" position="bottom">
              <button type="button" style={triggerButtonStyle}>Hover me — Bottom</button>
            </Tooltip>

            <Tooltip content="Tooltip on left" position="left">
              <button type="button" style={triggerButtonStyle}>Hover me — Left</button>
            </Tooltip>

            <Tooltip content="Tooltip on right" position="right">
              <button type="button" style={triggerButtonStyle}>Hover me — Right</button>
            </Tooltip>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Tooltips used in a realistic MotoTrack dashboard context — icon buttons and status badges.
 */
export const DashboardContext = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Icon Actions</p>
          <div style={rowStyle}>
            <Tooltip content="Start live timing" position="top">
              <span style={iconButtonStyle}>⏱</span>
            </Tooltip>

            <Tooltip content="View race map" position="top">
              <span style={iconButtonStyle}>🗺️</span>
            </Tooltip>

            <Tooltip content="Rider standings" position="top">
              <span style={iconButtonStyle}>🏆</span>
            </Tooltip>

            <Tooltip content="Pit stop strategy" position="top">
              <span style={iconButtonStyle}>🔧</span>
            </Tooltip>

            <Tooltip content="Weather conditions" position="top">
              <span style={iconButtonStyle}>🌦️</span>
            </Tooltip>
          </div>
        </div>

        <div style={sectionStyle}>
          <p style={labelStyle}>Status Badges</p>
          <div style={rowStyle}>
            <Tooltip content="Race is currently in progress" position="bottom">
              <span style={badgeStyle('#22c55e')}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                Live
              </span>
            </Tooltip>

            <Tooltip content="Waiting for race start" position="bottom">
              <span style={badgeStyle('#eab308')}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#eab308', display: 'inline-block' }} />
                Pending
              </span>
            </Tooltip>

            <Tooltip content="Race session has ended" position="bottom">
              <span style={badgeStyle('#64748b')}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#64748b', display: 'inline-block' }} />
                Finished
              </span>
            </Tooltip>

            <Tooltip content="Race cancelled due to weather" position="bottom">
              <span style={badgeStyle('#ef4444')}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                Cancelled
              </span>
            </Tooltip>
          </div>
        </div>

        <div style={sectionStyle}>
          <p style={labelStyle}>Rider Stats</p>
          <div style={rowStyle}>
            {[
              { label: 'P1', name: 'Marco Bianchi', time: '1:23.456', color: '#f59e0b' },
              { label: 'P2', name: 'Luka Horvat', time: '1:23.891', color: '#94a3b8' },
              { label: 'P3', name: 'Carlos Ruiz', time: '1:24.102', color: '#b45309' },
            ].map(({ label, name, time, color }) => (
              <Tooltip key={label} content={`${name} — Best lap: ${time}`} position="top">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 15,
                    color: '#020617',
                    cursor: 'default',
                    boxShadow: `0 0 16px ${color}55`,
                  }}
                >
                  {label}
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Disabled tooltip — no bubble appears on hover.
 */
export const DisabledTooltip = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Disabled State</p>
          <div style={rowStyle}>
            <Tooltip content="This tooltip is active" position="top">
              <button type="button" style={triggerButtonStyle}>Active tooltip</button>
            </Tooltip>

            <Tooltip content="You will never see this" position="top" disabled>
              <button
                type="button"
                style={{ ...triggerButtonStyle, opacity: 0.45, cursor: 'not-allowed' }}
              >
                Disabled tooltip
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
