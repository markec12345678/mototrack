import * as React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { CrosswindAlert } from './crosswind-alert';

/**
 * Moderate — yellow bottom banner. Caution advised.
 */
export const ModerateCrosswind = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          position: `relative`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
        }}
      >
        <div style={{ textAlign: `center`, color: `#94a3b8`, fontSize: `14px` }}>
          <p style={{ margin: 0 }}>Riding at 90° heading</p>
          <p style={{ margin: `4px 0 0`, fontSize: `12px`, color: `#475569` }}>
            Moderate crosswind banner visible at bottom
          </p>
        </div>
        <CrosswindAlert
          headingDeg={90}
          levelOverride="moderate"
          crossKmhOverride={22}
        />
      </div>
    </MockProvider>
  );
};

/**
 * Strong — orange bottom banner. Reduce speed.
 */
export const StrongCrosswind = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          position: `relative`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
        }}
      >
        <div style={{ textAlign: `center`, color: `#94a3b8`, fontSize: `14px` }}>
          <p style={{ margin: 0 }}>Riding at 270° heading</p>
          <p style={{ margin: `4px 0 0`, fontSize: `12px`, color: `#475569` }}>
            Strong crosswind banner visible at bottom
          </p>
        </div>
        <CrosswindAlert
          headingDeg={270}
          levelOverride="strong"
          crossKmhOverride={41}
        />
      </div>
    </MockProvider>
  );
};

/**
 * Dangerous — full-screen red flash with 'USTAVI SE!' message.
 */
export const DangerousCrosswind = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          position: `relative`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
        }}
      >
        <div style={{ textAlign: `center`, color: `#94a3b8`, fontSize: `14px`, zIndex: 0 }}>
          <p style={{ margin: 0 }}>Riding at 0° heading</p>
          <p style={{ margin: `4px 0 0`, fontSize: `12px`, color: `#475569` }}>
            Full-screen dangerous crosswind alert
          </p>
        </div>
        <CrosswindAlert
          headingDeg={0}
          levelOverride="dangerous"
          crossKmhOverride={68}
        />
      </div>
    </MockProvider>
  );
};
