import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { GarageDashboardPanel } from './garage-dashboard-panel';
import {
  mockBikes,
  mockPrimaryBike,
  mockMaintenanceItems,
  mockAllOkItems,
} from './garage-dashboard-panel.mock';

/**
 * WithAlerts — panel showing warn and danger maintenance items for the primary bike.
 */
export const WithAlerts = () => {
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
        <div style={{ width: `100%`, maxWidth: `360px` }}>
          <GarageDashboardPanel
            bikes={mockBikes}
            maintenanceItems={mockMaintenanceItems}
            maintenanceHref="/maintenance"
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * AllOk — panel showing the empty/all-ok state when no items need attention.
 */
export const AllOk = () => {
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
        <div style={{ width: `100%`, maxWidth: `360px` }}>
          <GarageDashboardPanel
            bikes={[mockPrimaryBike]}
            maintenanceItems={mockAllOkItems}
            maintenanceHref="/maintenance"
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * InDashboardGrid — panel shown inside a realistic dashboard grid layout.
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
            maxWidth: `1100px`,
            margin: `0 auto`,
            marginBottom: `24px`,
          }}
        >
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
            Nadzorna plošča
          </p>
          <h1
            style={{
              margin: `0 0 24px`,
              fontSize: `28px`,
              fontWeight: 800,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            Moja Garaža
          </h1>
        </div>

        <div
          style={{
            maxWidth: `1100px`,
            margin: `0 auto`,
            display: `grid`,
            gridTemplateColumns: `repeat(3, 1fr)`,
            gap: `16px`,
          }}
        >
          {/* Placeholder panel 1 */}
          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              padding: `20px`,
              minHeight: `200px`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `center`,
            }}
          >
            <span style={{ fontSize: `13px`, color: `#64748b` }}>Motorji</span>
          </div>

          {/* Maintenance panel — span 1 */}
          <GarageDashboardPanel
            bikes={mockBikes}
            maintenanceItems={mockMaintenanceItems}
            maintenanceHref="/maintenance"
          />

          {/* Placeholder panel 3 */}
          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              padding: `20px`,
              minHeight: `200px`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `center`,
            }}
          >
            <span style={{ fontSize: `13px`, color: `#64748b` }}>Stroški</span>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
