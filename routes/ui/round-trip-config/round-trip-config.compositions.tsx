import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RoundTripConfig } from './round-trip-config.js';

const pageStyle: React.CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
  padding: `48px 32px`,
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,
  gap: `48px`,
};

const labelStyle: React.CSSProperties = {
  fontSize: `11px`,
  fontWeight: 700,
  letterSpacing: `0.12em`,
  textTransform: `uppercase` as const,
  color: `#f97316`,
  marginBottom: `20px`,
  marginTop: 0,
  textAlign: `center` as const,
};

/**
 * Default — standard round-trip config card with default values.
 */
export const Default = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={{ width: `100%`, maxWidth: `480px` }}>
          <p style={labelStyle}>Default Configuration</p>
          <RoundTripConfig />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * WithCallback — demonstrates the onGenerate callback with a live result panel.
 */
export const WithCallback = () => {
  const [result, setResult] = useState<{
    distanceKm: number;
    twistiness: number;
    direction: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = (config: { distanceKm: number; twistiness: number; direction: string }) => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult(config);
    }, 1800);
  };

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={{ width: `100%`, maxWidth: `480px` }}>
          <p style={labelStyle}>With Generate Callback</p>
          <RoundTripConfig
            defaultDistance={160}
            defaultTwistiness={75}
            defaultDirection="counterclockwise"
            loading={loading}
            onGenerate={(config) => handleGenerate(config)}
          />
          {result && (
            <div
              style={{
                marginTop: `24px`,
                padding: `20px 24px`,
                backgroundColor: `#0f172a`,
                borderRadius: `12px`,
                border: `1px solid rgba(34,197,94,0.3)`,
                boxShadow: `0 0 20px rgba(34,197,94,0.1)`,
              }}
            >
              <div
                style={{
                  fontSize: `10px`,
                  fontWeight: 700,
                  letterSpacing: `0.12em`,
                  textTransform: `uppercase`,
                  color: `#22c55e`,
                  marginBottom: `12px`,
                }}
              >
                ✓ Route Generated
              </div>
              <div
                style={{
                  display: `grid`,
                  gridTemplateColumns: `repeat(3, 1fr)`,
                  gap: `12px`,
                }}
              >
                {[
                  { label: `Distance`, value: `${result.distanceKm} km` },
                  { label: `Twistiness`, value: `${result.twistiness}%` },
                  { label: `Direction`, value: result.direction === `clockwise` ? `CW` : `CCW` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: `center` }}>
                    <div
                      style={{
                        fontSize: `10px`,
                        color: `#64748b`,
                        fontWeight: 600,
                        letterSpacing: `0.08em`,
                        textTransform: `uppercase`,
                        marginBottom: `4px`,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: `18px`,
                        fontWeight: 800,
                        color: `#22c55e`,
                        fontVariantNumeric: `tabular-nums`,
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * ExtremeRoute — pre-configured for a long, highly twisty route.
 */
export const ExtremeRoute = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={{ width: `100%`, maxWidth: `480px` }}>
          <p style={labelStyle}>Extreme Twisty Route</p>
          <RoundTripConfig
            defaultDistance={280}
            defaultTwistiness={95}
            defaultDirection="clockwise"
          />
        </div>
      </div>
    </MockProvider>
  );
};
