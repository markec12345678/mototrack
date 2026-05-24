import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { BikeCard } from './bike-card.js';
import {
  mockKtmBike,
  mockYamahaBike,
  mockDucatiBike,
  mockHondaBike,
} from './bike-card.mock.js';

/**
 * PrimaryBike — KTM 890 Adventure as the primary bike with full fuel.
 */
export const PrimaryBike = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <p
            style={{
              margin: '0 0 16px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f97316',
            }}
          >
            Primary Bike
          </p>
          <BikeCard
            bike={mockKtmBike}
            onEdit={(id) => console.log(`Edit bike: ${id}`)}
            onSetPrimary={(id) => console.log(`Set primary: ${id}`)}
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * GarageGrid — multiple bikes in a responsive garage grid layout.
 */
export const GarageGrid = () => {
  const [bikes, setBikes] = useState([
    mockKtmBike,
    mockYamahaBike,
    mockDucatiBike,
    mockHondaBike,
  ]);

  const handleSetPrimary = (id: string) => {
    setBikes((prev) =>
      prev.map((b) => ({ ...b, primary: b.id === id }))
    );
  };

  const handleEdit = (id: string) => {
    console.log(`Editing bike: ${id}`);
  };

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '40px 24px',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <p
              style={{
                margin: '0 0 6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#f97316',
              }}
            >
              My Garage
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: 800,
                color: '#f1f5f9',
                letterSpacing: '-0.03em',
              }}
            >
              {bikes.length} Bikes
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748b' }}>
              Click &ldquo;Set Primary&rdquo; to change your active bike.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {bikes.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={bike}
                onEdit={handleEdit}
                onSetPrimary={handleSetPrimary}
              />
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * LowFuelWarning — bike with critically low fuel to show danger state.
 */
export const LowFuelWarning = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <p
            style={{
              margin: '0 0 16px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#ef4444',
            }}
          >
            Low Fuel State
          </p>
          <BikeCard
            bike={mockHondaBike}
            onEdit={(id) => console.log(`Edit: ${id}`)}
            onSetPrimary={(id) => console.log(`Set primary: ${id}`)}
          />
        </div>
      </div>
    </MockProvider>
  );
};
