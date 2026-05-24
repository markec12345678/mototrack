import React, { useEffect, useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Compass } from './compass.js';

/**
 * Default — static compass at 45° NE heading (manual mode).
 */
export const DefaultCompass = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '32px',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#f97316',
          }}
        >
          Compass HUD
        </p>
        <Compass heading={45} size={240} showDegrees showSource />
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Heading: 45° NE — Manual mode
        </p>
      </div>
    </MockProvider>
  );
};

/**
 * AnimatedSweep — compass that continuously rotates to simulate live heading changes.
 */
export const AnimatedSweep = () => {
  const [heading, setHeading] = useState<number>(0);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      // Full rotation every 12 seconds
      const deg = (elapsed / 12000) * 360;
      setHeading(deg % 360);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '32px',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#f97316',
          }}
        >
          Live Animated Sweep
        </p>
        <Compass heading={heading} size={260} showDegrees showSource />
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Simulating continuous heading rotation
        </p>
      </div>
    </MockProvider>
  );
};

/**
 * SizeVariants — compass rendered at small, medium, and large sizes.
 */
export const SizeVariants = () => {
  const headings = [
    { heading: 0, label: 'North — 0°', size: 140 },
    { heading: 90, label: 'East — 90°', size: 200 },
    { heading: 270, label: 'West — 270°', size: 260 },
  ];

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '48px',
          padding: '48px 32px',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#f97316',
          }}
        >
          Size Variants
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '48px',
          }}
        >
          {headings.map(({ heading, label, size }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <Compass heading={heading} size={size} showDegrees showSource />
              <span
                style={{
                  fontSize: '12px',
                  color: '#64748b',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: '#475569',
                  fontFamily: 'monospace',
                }}
              >
                {size}px
              </span>
            </div>
          ))}
        </div>
      </div>
    </MockProvider>
  );
};
