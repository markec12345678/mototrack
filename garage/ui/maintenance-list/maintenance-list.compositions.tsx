import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { MaintenanceList } from './maintenance-list.js';
import { mockMaintenanceItems } from './maintenance-list.mock.js';

/**
 * AllGood — all maintenance tasks in healthy (ok) status.
 * Bike is freshly serviced with low mileage since last service.
 */
export const AllGood = () => {
  const freshItems = mockMaintenanceItems.map((item) => ({
    ...item,
    lastServiceKm: 16000,
    lastServiceAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  }));

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 32px`,
        }}
      >
        <div style={{ maxWidth: `720px`, margin: `0 auto` }}>
          <div style={{ marginBottom: `24px` }}>
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
              KTM 890 Adventure
            </p>
            <h1
              style={{
                margin: `0`,
                fontSize: `26px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.03em`,
              }}
            >
              All Systems Green
            </h1>
            <p style={{ margin: `6px 0 0`, fontSize: `13px`, color: `#64748b` }}>
              16,200 km · All maintenance up to date
            </p>
          </div>
          <MaintenanceList
            bikeId="bike-1"
            currentMileageKm={16200}
            items={freshItems}
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * MixedStatuses — realistic mix of ok, warn, and danger tasks.
 * Demonstrates the full visual range of the component.
 */
export const MixedStatuses = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 32px`,
        }}
      >
        <div style={{ maxWidth: `720px`, margin: `0 auto` }}>
          <div style={{ marginBottom: `24px` }}>
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
              KTM 890 Adventure
            </p>
            <h1
              style={{
                margin: `0`,
                fontSize: `26px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.03em`,
              }}
            >
              Maintenance Overview
            </h1>
            <p style={{ margin: `6px 0 0`, fontSize: `13px`, color: `#64748b` }}>
              16,800 km · Some tasks need attention
            </p>
          </div>
          <MaintenanceList
            bikeId="bike-1"
            currentMileageKm={16800}
            items={mockMaintenanceItems}
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * AllOverdue — all tasks past their service interval.
 * Shows the danger state prominently with pulsing dots.
 */
export const AllOverdue = () => {
  const overdueItems = mockMaintenanceItems.map((item) => ({
    ...item,
    lastServiceKm: 0,
    lastServiceAt: Date.now() - 800 * 24 * 60 * 60 * 1000,
  }));

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 32px`,
        }}
      >
        <div style={{ maxWidth: `720px`, margin: `0 auto` }}>
          <div style={{ marginBottom: `24px` }}>
            <p
              style={{
                margin: `0 0 4px`,
                fontSize: `11px`,
                fontWeight: 700,
                letterSpacing: `0.12em`,
                textTransform: `uppercase`,
                color: `#ef4444`,
              }}
            >
              KTM 890 Adventure
            </p>
            <h1
              style={{
                margin: `0`,
                fontSize: `26px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.03em`,
              }}
            >
              Urgent Attention Required
            </h1>
            <p style={{ margin: `6px 0 0`, fontSize: `13px`, color: `#64748b` }}>
              16,800 km · All maintenance overdue
            </p>
          </div>
          <MaintenanceList
            bikeId="bike-1"
            currentMileageKm={16800}
            items={overdueItems}
          />
        </div>
      </div>
    </MockProvider>
  );
};
