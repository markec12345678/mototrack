import * as React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Card } from '@markec/mototrack-design.content.card';
import { RideDashboardPanel } from './ride-dashboard-panel.js';
import { mockRides, mockEmptyRides } from './ride-dashboard-panel.mock.js';

/**
 * Default — panel with 3 recent rides, as it appears on the dashboard.
 */
export const Default = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 32px`,
          display: `flex`,
          alignItems: `flex-start`,
          justifyContent: `center`,
        }}
      >
        <div style={{ width: `100%`, maxWidth: `720px` }}>
          <Card variant="elevated" padding="xl">
            <RideDashboardPanel rides={mockRides} />
          </Card>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * EmptyState — panel with no rides yet.
 */
export const EmptyState = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 32px`,
          display: `flex`,
          alignItems: `flex-start`,
          justifyContent: `center`,
        }}
      >
        <div style={{ width: `100%`, maxWidth: `720px` }}>
          <Card variant="elevated" padding="xl">
            <RideDashboardPanel rides={mockEmptyRides} />
          </Card>
        </div>
      </div>
    </MockProvider>
  );
};

const statCards = [
  { label: `Skupaj km`, value: `4 821`, unit: `km` },
  { label: `Skupaj vožnje`, value: `38`, unit: `` },
  { label: `Maks. hitrost`, value: `201`, unit: `km/h` },
  { label: `Skupaj vzpon`, value: `52 400`, unit: `m` },
];

/**
 * InDashboardGrid — simulates the panel inside a 2-column dashboard grid (span 2).
 */
export const InDashboardGrid = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 32px`,
        }}
      >
        <div
          style={{
            display: `grid`,
            gridTemplateColumns: `repeat(4, 1fr)`,
            gap: `20px`,
            maxWidth: `1200px`,
            margin: `0 auto`,
          }}
        >
          {statCards.map(({ label, value, unit }) => (
            <div key={label}>
              <Card variant="default" padding="lg">
                <div
                  style={{
                    fontSize: `10px`,
                    fontWeight: 700,
                    letterSpacing: `0.1em`,
                    textTransform: `uppercase`,
                    color: `#64748b`,
                    marginBottom: `8px`,
                  }}
                >
                  {label}
                </div>
                <div style={{ display: `flex`, alignItems: `baseline`, gap: `4px` }}>
                  <span
                    style={{
                      fontSize: `26px`,
                      fontWeight: 800,
                      color: `#f1f5f9`,
                      letterSpacing: `-0.03em`,
                    }}
                  >
                    {value}
                  </span>
                  {unit && (
                    <span style={{ fontSize: `12px`, color: `#64748b`, fontWeight: 500 }}>
                      {unit}
                    </span>
                  )}
                </div>
              </Card>
            </div>
          ))}

          <div style={{ gridColumn: `span 2` }}>
            <Card variant="elevated" padding="xl" style={{ height: `100%` }}>
              <RideDashboardPanel rides={mockRides} />
            </Card>
          </div>

          <div style={{ gridColumn: `span 2` }}>
            <Card variant="default" padding="xl" style={{ minHeight: `300px` }}>
              <div
                style={{
                  fontSize: `11px`,
                  fontWeight: 700,
                  letterSpacing: `0.12em`,
                  textTransform: `uppercase`,
                  color: `#f97316`,
                  marginBottom: `12px`,
                }}
              >
                Statistika
              </div>
              <div
                style={{
                  width: `100%`,
                  height: `200px`,
                  borderRadius: `8px`,
                  background: `rgba(148,163,184,0.05)`,
                  border: `1px dashed rgba(148,163,184,0.15)`,
                  display: `flex`,
                  alignItems: `center`,
                  justifyContent: `center`,
                  color: `#475569`,
                  fontSize: `13px`,
                }}
              >
                Graf vožnje
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
