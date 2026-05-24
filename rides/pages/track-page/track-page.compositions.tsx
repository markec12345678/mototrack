import { type CSSProperties } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TrackPage } from './track-page.js';
import type { SafetyAlert } from './safety-alert-type.js';

// ── Shared styles ─────────────────────────────────────────────────────────────

const fullScreenWrap: CSSProperties = {
  width: `100%`,
  height: `100vh`,
  overflow: `hidden`,
};

// ── Safety alert widget stubs ─────────────────────────────────────────────────

function SpeedWarningWidget() {
  return (
    <div
      style={{
        padding: `10px 14px`,
        display: `flex`,
        alignItems: `center`,
        gap: `10px`,
      }}
    >
      <div
        style={{
          width: `10px`,
          height: `10px`,
          borderRadius: `50%`,
          backgroundColor: `#eab308`,
          boxShadow: `0 0 8px rgba(234,179,8,0.8)`,
          flexShrink: 0,
        }}
      />
      <div>
        <div
          style={{
            fontSize: `11px`,
            fontWeight: 700,
            letterSpacing: `0.08em`,
            textTransform: `uppercase`,
            color: `#eab308`,
            marginBottom: `2px`,
          }}
        >
          Speed Warning
        </div>
        <div style={{ fontSize: `12px`, color: `#94a3b8` }}>
          Approaching 120 km/h limit
        </div>
      </div>
    </div>
  );
}

function WeatherAlertWidget() {
  return (
    <div
      style={{
        padding: `10px 14px`,
        display: `flex`,
        alignItems: `center`,
        gap: `10px`,
      }}
    >
      <div style={{ fontSize: `18px`, flexShrink: 0 }}>🌧️</div>
      <div>
        <div
          style={{
            fontSize: `11px`,
            fontWeight: 700,
            letterSpacing: `0.08em`,
            textTransform: `uppercase`,
            color: `#3b82f6`,
            marginBottom: `2px`,
          }}
        >
          Rain Ahead
        </div>
        <div style={{ fontSize: `12px`, color: `#94a3b8` }}>
          Rain expected in 8 km
        </div>
      </div>
    </div>
  );
}

function RoadHazardWidget() {
  return (
    <div
      style={{
        padding: `10px 14px`,
        display: `flex`,
        alignItems: `center`,
        gap: `10px`,
      }}
    >
      <div style={{ fontSize: `18px`, flexShrink: 0 }}>⚠️</div>
      <div>
        <div
          style={{
            fontSize: `11px`,
            fontWeight: 700,
            letterSpacing: `0.08em`,
            textTransform: `uppercase`,
            color: `#ef4444`,
            marginBottom: `2px`,
          }}
        >
          Road Hazard
        </div>
        <div style={{ fontSize: `12px`, color: `#94a3b8` }}>
          Sharp curve — 500 m ahead
        </div>
      </div>
    </div>
  );
}

const safetyAlerts: SafetyAlert[] = [
  { key: `speed-warning`, order: 1, component: SpeedWarningWidget },
  { key: `weather-alert`, order: 2, component: WeatherAlertWidget },
  { key: `road-hazard`, order: 3, component: RoadHazardWidget },
];

// ── Compositions ──────────────────────────────────────────────────────────────

/**
 * Default — idle state. Full-screen map with start-ride control at bottom-center.
 */
export const Default = () => {
  return (
    <MockProvider>
      <div style={fullScreenWrap}>
        <TrackPage />
      </div>
    </MockProvider>
  );
};

/**
 * WithSafetyAlerts — idle map with three floating safety alert widgets on the right.
 */
export const WithSafetyAlerts = () => {
  return (
    <MockProvider>
      <div style={fullScreenWrap}>
        <TrackPage safetyAlerts={safetyAlerts} />
      </div>
    </MockProvider>
  );
};

/**
 * WithCallbacks — demonstrates onRideSaved and onRideDiscarded callbacks.
 */
export const WithCallbacks = () => {
  return (
    <MockProvider>
      <div style={fullScreenWrap}>
        <TrackPage
          safetyAlerts={[
            { key: `weather-alert`, order: 1, component: WeatherAlertWidget },
          ]}
          onRideSaved={(id) => {
            // eslint-disable-next-line no-console
            console.log(`Ride saved:`, id);
          }}
          onRideDiscarded={() => {
            // eslint-disable-next-line no-console
            console.log(`Ride discarded`);
          }}
        />
      </div>
    </MockProvider>
  );
};
