import React, { useEffect } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ToastProvider } from './toast.js';
import { useToast } from './use-toast.js';

// ── Trigger buttons ───────────────────────────────────────────────────────────

function HazardAlertDemo() {
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      addToast(
        `Oil spill detected on Turn 7 — reduce speed immediately.`,
        'danger',
        '⚠️ Hazard Alert',
        0
      );
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <button
        type="button"
        onClick={() =>
          addToast(`Oil spill detected on Turn 7 — reduce speed immediately.`, 'danger', '⚠️ Hazard Alert', 0)
        }
        style={triggerButtonStyle('#ef4444')}
      >
        🚨 Trigger Hazard Alert
      </button>
      <button
        type="button"
        onClick={() =>
          addToast(`Yellow flag sector 3 — overtaking prohibited.`, 'warning', '🏁 Yellow Flag', 6000)
        }
        style={triggerButtonStyle('#eab308')}
      >
        🟡 Yellow Flag Warning
      </button>
      <button
        type="button"
        onClick={() => addToast(`Ride saved to your garage successfully.`, 'success', '✅ Ride Saved', 4000)}
        style={triggerButtonStyle('#22c55e')}
      >
        💾 Save Ride
      </button>
      <button
        type="button"
        onClick={() =>
          addToast(`Route shared with your crew. Link expires in 24h.`, 'info', '🔗 Route Shared', 4000)
        }
        style={triggerButtonStyle('#3b82f6')}
      >
        🗺️ Share Route
      </button>
    </div>
  );
}

function triggerButtonStyle(accent: string): React.CSSProperties {
  return {
    padding: '10px 20px',
    backgroundColor: 'rgba(15,23,42,0.9)',
    color: accent,
    border: `1px solid ${accent}40`,
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    letterSpacing: '0.02em',
    transition: 'background-color 0.15s ease',
    fontFamily: 'inherit',
  };
}

/**
 * AllVariants — showcases all four toast variants with interactive triggers.
 */
export const AllVariants = () => {
  return (
    <MockProvider>
      <ToastProvider>
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
          <div style={{ maxWidth: '480px', width: '100%' }}>
            <div style={{ marginBottom: '32px' }}>
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#f97316',
                }}
              >
                Toast Notifications
              </p>
              <h2
                style={{
                  margin: '0 0 8px',
                  fontSize: '26px',
                  fontWeight: '800',
                  color: '#f1f5f9',
                  letterSpacing: '-0.02em',
                }}
              >
                MotoTrack Alerts
              </h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                Click any button below to trigger a toast notification. Hazard alerts persist until dismissed.
              </p>
            </div>
            <HazardAlertDemo />
          </div>
        </div>
      </ToastProvider>
    </MockProvider>
  );
};

// ── Auto-fire demo ────────────────────────────────────────────────────────────

function RaceSessionToasts() {
  const { addToast } = useToast();

  useEffect(() => {
    const timers = [
      setTimeout(() => addToast(`Connected to live timing feed.`, 'info', '📡 Live Timing', 5000), 400),
      setTimeout(() => addToast(`Lap 12 complete — personal best: 1:23.456`, 'success', '🏆 New Best Lap', 5000), 1400),
      setTimeout(
        () => addToast(`Tyre wear at 85% — consider pit stop within 3 laps.`, 'warning', '🔧 Tyre Warning', 6000),
        2400
      ),
      setTimeout(
        () => addToast(`Incident reported ahead — safety car deployed.`, 'danger', '🚗 Safety Car', 0),
        3400
      ),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(249,115,22,0.12)',
          border: '1px solid rgba(249,115,22,0.3)',
          marginBottom: '20px',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#f97316',
            boxShadow: '0 0 8px rgba(249,115,22,0.8)',
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: '11px', fontWeight: '700', color: '#f97316', letterSpacing: '0.1em' }}>
          LIVE SESSION
        </span>
      </div>
      <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '800', color: '#f1f5f9' }}>
        Race Session Active
      </h2>
      <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
        Toasts fire automatically to simulate a live race session feed.
      </p>
    </div>
  );
}

/**
 * RaceSession — simulates a live race session with auto-firing toasts.
 */
export const RaceSession = () => {
  return (
    <MockProvider>
      <ToastProvider>
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
          <RaceSessionToasts />
        </div>
      </ToastProvider>
    </MockProvider>
  );
};

// ── Stacked toasts demo ───────────────────────────────────────────────────────

function StackedDemo() {
  const { addToast } = useToast();

  const fireAll = () => {
    addToast(`Route &quot;Alpine Pass&quot; shared with your crew.`, 'info', '🔗 Route Shared');
    addToast(`Ride saved to garage — 142 km logged.`, 'success', '✅ Ride Saved');
    addToast(`Strong crosswinds reported on A1 motorway.`, 'warning', '💨 Wind Advisory');
    addToast(`Emergency stop detected — are you okay?`, 'danger', '🚨 Emergency Alert', 0);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '800', color: '#f1f5f9' }}>
        Stacked Notifications
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>
        Fire all four variants simultaneously to see how they stack.
      </p>
      <button
        type="button"
        onClick={() => fireAll()}
        style={{
          padding: '12px 28px',
          backgroundColor: '#f97316',
          color: '#020617',
          border: 'none',
          borderRadius: '10px',
          fontWeight: '800',
          fontSize: '14px',
          cursor: 'pointer',
          letterSpacing: '0.02em',
          boxShadow: '0 0 20px rgba(249,115,22,0.4)',
          fontFamily: 'inherit',
        }}
      >
        🔥 Fire All Toasts
      </button>
    </div>
  );
}

/**
 * StackedToasts — fires all four variants at once to demonstrate stacking.
 */
export const StackedToasts = () => {
  return (
    <MockProvider>
      <ToastProvider>
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
          <StackedDemo />
        </div>
      </ToastProvider>
    </MockProvider>
  );
};
