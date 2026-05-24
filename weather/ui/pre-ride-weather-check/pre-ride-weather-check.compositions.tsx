import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Card } from '@markec/mototrack-design.content.card';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { PreRideWeatherCheck } from './pre-ride-weather-check.js';
import type { WeatherCheckResult } from './weather-check-result-type.js';

// ─── Shared wrapper ───────────────────────────────────────────────────────────

function ChecklistShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        minHeight: `100vh`,
        backgroundColor: `#020617`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        padding: `32px 16px`,
      }}
    >
      <div style={{ width: `100%`, maxWidth: `480px` }}>
        <div style={{ marginBottom: `24px` }}>
          <p
            style={{
              margin: `0 0 6px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Pre-Ride Checklist
          </p>
          <h2
            style={{
              margin: `0 0 4px`,
              fontSize: `24px`,
              fontWeight: 800,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Composition 1: Safe conditions ──────────────────────────────────────────

/**
 * SafeConditions — Ljubljana on a clear summer morning.
 * The weather check returns safe, Start button is enabled.
 */
export const SafeConditions = () => {
  const [result, setResult] = useState<WeatherCheckResult | null>(null);

  return (
    <MockProvider>
      <ChecklistShell
        title="Weather Check"
        subtitle="Ljubljana, Slovenia — Clear morning"
      >
        <PreRideWeatherCheck
          lat={46.0569}
          lng={14.5058}
          onResult={(r) => setResult(r)}
        />

        {/* Simulated checklist footer */}
        <div
          style={{
            marginTop: `24px`,
            display: `flex`,
            flexDirection: `column`,
            gap: `12px`,
          }}
        >
          <Card variant="outlined" padding="md">
            <div style={{ display: `flex`, alignItems: `center`, gap: `12px` }}>
              <div
                style={{
                  width: `8px`,
                  height: `8px`,
                  borderRadius: `50%`,
                  backgroundColor: result ? (result.isDangerous ? `#ef4444` : `#22c55e`) : `#64748b`,
                  flexShrink: 0,
                }}
              />
              <Paragraph variant="body" color="secondary">
                {result
                  ? result.isDangerous
                    ? `Weather check failed — ride blocked`
                    : `Weather check passed`
                  : `Awaiting weather check…`}
              </Paragraph>
            </div>
          </Card>

          <button
            type="button"
            disabled={result?.isDangerous ?? true}
            style={{
              width: `100%`,
              padding: `14px`,
              backgroundColor: result?.isDangerous || !result ? `rgba(100,116,139,0.2)` : `#f97316`,
              color: result?.isDangerous || !result ? `#64748b` : `#020617`,
              border: `none`,
              borderRadius: `12px`,
              fontSize: `15px`,
              fontWeight: 700,
              fontFamily: `Inter, system-ui, sans-serif`,
              cursor: result?.isDangerous || !result ? `not-allowed` : `pointer`,
              transition: `all 0.2s ease`,
              letterSpacing: `0.04em`,
            }}
          >
            {result?.isDangerous ? `⛔ Start Blocked` : `🏍️ Start Ride`}
          </button>
        </div>
      </ChecklistShell>
    </MockProvider>
  );
};

// ─── Composition 2: Dangerous conditions ─────────────────────────────────────

/**
 * DangerousConditions — Simulates a mountain pass in a storm.
 * The weather check returns dangerous, Start button is disabled.
 */
export const DangerousConditions = () => {
  const [result, setResult] = useState<WeatherCheckResult | null>(null);

  return (
    <MockProvider>
      <ChecklistShell
        title="Weather Check"
        subtitle="Vršič Pass, Slovenia — Storm warning"
      >
        <PreRideWeatherCheck
          lat={46.4376}
          lng={13.7449}
          onResult={(r) => setResult(r)}
        />

        <div
          style={{
            marginTop: `24px`,
            display: `flex`,
            flexDirection: `column`,
            gap: `12px`,
          }}
        >
          <Card variant="danger" padding="md">
            <div style={{ display: `flex`, alignItems: `center`, gap: `12px` }}>
              <span style={{ fontSize: `16px` }}>🚫</span>
              <Paragraph variant="body" color="secondary">
                {result?.isDangerous
                  ? `Ride blocked — dangerous weather detected`
                  : `Checking conditions…`}
              </Paragraph>
            </div>
          </Card>

          <button
            type="button"
            disabled
            style={{
              width: `100%`,
              padding: `14px`,
              backgroundColor: `rgba(100,116,139,0.2)`,
              color: `#64748b`,
              border: `none`,
              borderRadius: `12px`,
              fontSize: `15px`,
              fontWeight: 700,
              fontFamily: `Inter, system-ui, sans-serif`,
              cursor: `not-allowed`,
              letterSpacing: `0.04em`,
            }}
          >
            ⛔ Start Blocked
          </button>
        </div>
      </ChecklistShell>
    </MockProvider>
  );
};

// ─── Composition 3: Full pre-ride modal ──────────────────────────────────────

/**
 * FullChecklistModal — PreRideWeatherCheck embedded in a realistic modal UI
 * alongside other checklist items, showing how the parent disables Start.
 */
export const FullChecklistModal = () => {
  const [weatherResult, setWeatherResult] = useState<WeatherCheckResult | null>(null);

  const checklistItems = [
    { id: `helmet`, label: `Helmet secured`, checked: true },
    { id: `gloves`, label: `Gloves on`, checked: true },
    { id: `jacket`, label: `Protective jacket`, checked: true },
    { id: `tyres`, label: `Tyre pressure OK`, checked: false },
  ];

  const allChecked = checklistItems.every((i) => i.checked);
  const canStart = allChecked && weatherResult !== null && !weatherResult.isDangerous;

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `rgba(2, 6, 23, 0.95)`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          padding: `24px 16px`,
        }}
      >
        <div
          style={{
            width: `100%`,
            maxWidth: `520px`,
            backgroundColor: `#0f172a`,
            borderRadius: `20px`,
            border: `1px solid rgba(148,163,184,0.12)`,
            boxShadow: `0 24px 64px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)`,
            overflow: `hidden`,
          }}
        >
          {/* Modal header */}
          <div
            style={{
              padding: `24px 28px 20px`,
              borderBottom: `1px solid rgba(148,163,184,0.1)`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `space-between`,
            }}
          >
            <div>
              <p
                style={{
                  margin: `0 0 4px`,
                  fontSize: `11px`,
                  fontWeight: 700,
                  letterSpacing: `0.12em`,
                  textTransform: `uppercase`,
                  color: `#f97316`,
                }}
              >
                Pre-Ride Checklist
              </p>
              <h2
                style={{
                  margin: 0,
                  fontSize: `20px`,
                  fontWeight: 800,
                  color: `#f1f5f9`,
                  letterSpacing: `-0.02em`,
                }}
              >
                Ready to Ride?
              </h2>
            </div>
            <div
              style={{
                width: `36px`,
                height: `36px`,
                borderRadius: `50%`,
                backgroundColor: `rgba(249,115,22,0.15)`,
                border: `1px solid rgba(249,115,22,0.3)`,
                display: `flex`,
                alignItems: `center`,
                justifyContent: `center`,
                fontSize: `18px`,
              }}
            >
              🏍️
            </div>
          </div>

          {/* Checklist items */}
          <div style={{ padding: `20px 28px 0` }}>
            <p
              style={{
                margin: `0 0 12px`,
                fontSize: `11px`,
                fontWeight: 700,
                letterSpacing: `0.1em`,
                textTransform: `uppercase`,
                color: `#64748b`,
              }}
            >
              Safety Gear
            </p>
            <div style={{ display: `flex`, flexDirection: `column`, gap: `8px`, marginBottom: `20px` }}>
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: `flex`,
                    alignItems: `center`,
                    gap: `12px`,
                    padding: `10px 14px`,
                    backgroundColor: item.checked ? `rgba(34,197,94,0.06)` : `rgba(148,163,184,0.06)`,
                    borderRadius: `10px`,
                    border: `1px solid ${item.checked ? `rgba(34,197,94,0.2)` : `rgba(148,163,184,0.1)`}`,
                  }}
                >
                  <div
                    style={{
                      width: `20px`,
                      height: `20px`,
                      borderRadius: `50%`,
                      backgroundColor: item.checked ? `#22c55e` : `transparent`,
                      border: `2px solid ${item.checked ? `#22c55e` : `#475569`}`,
                      display: `flex`,
                      alignItems: `center`,
                      justifyContent: `center`,
                      flexShrink: 0,
                    }}
                  >
                    {item.checked && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1.5,5 4,7.5 8.5,2.5" />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: `14px`,
                      fontWeight: 500,
                      color: item.checked ? `#f1f5f9` : `#94a3b8`,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Weather section */}
            <p
              style={{
                margin: `0 0 12px`,
                fontSize: `11px`,
                fontWeight: 700,
                letterSpacing: `0.1em`,
                textTransform: `uppercase`,
                color: `#64748b`,
              }}
            >
              Weather Conditions
            </p>
            <PreRideWeatherCheck
              lat={46.0569}
              lng={14.5058}
              onResult={(r) => setWeatherResult(r)}
            />
          </div>

          {/* Modal footer */}
          <div
            style={{
              padding: `20px 28px 24px`,
              borderTop: `1px solid rgba(148,163,184,0.1)`,
              marginTop: `20px`,
            }}
          >
            {!allChecked && (
              <p
                style={{
                  margin: `0 0 12px`,
                  fontSize: `12px`,
                  color: `#f59e0b`,
                  textAlign: `center`,
                }}
              >
                ⚠️ Complete all checklist items before starting
              </p>
            )}
            <button
              type="button"
              disabled={!canStart}
              style={{
                width: `100%`,
                padding: `16px`,
                backgroundColor: canStart ? `#f97316` : `rgba(100,116,139,0.2)`,
                color: canStart ? `#020617` : `#64748b`,
                border: `none`,
                borderRadius: `12px`,
                fontSize: `15px`,
                fontWeight: 800,
                fontFamily: `Inter, system-ui, sans-serif`,
                cursor: canStart ? `pointer` : `not-allowed`,
                transition: `all 0.2s ease`,
                letterSpacing: `0.04em`,
              }}
            >
              {canStart ? `🏍️ Start Ride` : `⛔ Not Ready`}
            </button>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
