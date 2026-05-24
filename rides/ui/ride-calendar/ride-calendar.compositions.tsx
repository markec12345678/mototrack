import * as React from 'react';
import { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RideCalendar } from './ride-calendar.js';
import { mockRides, mockRidesSparse } from './ride-calendar.mock.js';

/**
 * Full month — rich heatmap with many rides across the current month.
 */
export const FullMonth = () => {
  const [selected, setSelected] = useState<{ date: string; count: number; km: number } | null>(null);

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--colors-surface-background)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          gap: '24px',
        }}
      >
        <div style={{ maxWidth: '560px', width: '100%' }}>
          <div style={{ marginBottom: '16px' }}>
            <p
              style={{
                margin: '0 0 4px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--colors-primary-default)',
              }}
            >
              Ride Calendar
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: 800,
                color: 'var(--colors-text-default)',
                letterSpacing: '-0.02em',
              }}
            >
              Monthly Activity Heatmap
            </h2>
          </div>

          <RideCalendar
            rides={mockRides}
            onDayClick={(dateKey, rides) => {
              const km = rides.reduce((s, r) => s + r.distanceKm, 0);
              setSelected({ date: dateKey, count: rides.length, km: Math.round(km) });
            }}
          />

          {selected && (
            <div
              style={{
                marginTop: '16px',
                padding: '16px 20px',
                backgroundColor: 'var(--colors-surface-primary)',
                borderRadius: '12px',
                border: '1px solid var(--colors-border-default)',
                boxShadow: 'var(--effects-shadows-small)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--colors-primary-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                🏍️
              </div>
              <div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--colors-text-default)',
                    marginBottom: '2px',
                  }}
                >
                  {selected.date}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--colors-text-muted)' }}>
                  {selected.count} ride{selected.count > 1 ? 's' : ''} · {selected.km} km total
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Sparse rides — only a few days active, shows contrast between empty and active days.
 */
export const SparseMonth = () => (
  <MockProvider>
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--colors-surface-background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      <div style={{ maxWidth: '560px', width: '100%' }}>
        <div style={{ marginBottom: '16px' }}>
          <p
            style={{
              margin: '0 0 4px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--colors-primary-default)',
            }}
          >
            Ride Calendar
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--colors-text-default)',
              letterSpacing: '-0.02em',
            }}
          >
            Sparse Activity
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--colors-text-muted)' }}>
            Only a few rides this month — great for seeing the empty-state contrast.
          </p>
        </div>
        <RideCalendar rides={mockRidesSparse} />
      </div>
    </div>
  </MockProvider>
);

/**
 * Empty calendar — no rides logged yet.
 */
export const EmptyCalendar = () => (
  <MockProvider>
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--colors-surface-background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      <div style={{ maxWidth: '560px', width: '100%' }}>
        <div style={{ marginBottom: '16px' }}>
          <p
            style={{
              margin: '0 0 4px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--colors-primary-default)',
            }}
          >
            Ride Calendar
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--colors-text-default)',
              letterSpacing: '-0.02em',
            }}
          >
            No Rides Yet
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--colors-text-muted)' }}>
            Start riding to see your activity heatmap fill up!
          </p>
        </div>
        <RideCalendar rides={[]} />
      </div>
    </div>
  </MockProvider>
);
