import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TourDashboardPanel } from './tour-dashboard-panel.js';

const bgImageUrl = `https://storage.googleapis.com/bit-generated-images/images/image_aerial_panoramic_view_of_windi_0_1779624941859.png`;

/**
 * DefaultPanel — the standard 'Predlagane ture' dashboard panel showing 3 random iconic tours.
 */
export const DefaultPanel = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 32px`,
          display: `flex`,
          flexDirection: `column`,
          gap: `24px`,
        }}
      >
        <div style={{ maxWidth: `1280px`, margin: `0 auto`, width: `100%` }}>
          <p
            style={{
              margin: `0 0 20px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Dashboard Panel — span 3
          </p>
          <TourDashboardPanel />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * InDashboardContext — panel embedded in a realistic dashboard grid layout.
 */
export const InDashboardContext = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: `cover`,
          backgroundPosition: `center top`,
          position: `relative`,
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: `absolute`,
            inset: 0,
            background: `linear-gradient(to bottom, rgba(2,6,23,0.7) 0%, rgba(2,6,23,0.97) 30%)`,
          }}
        />

        <div style={{ position: `relative`, padding: `32px` }}>
          {/* Dashboard header */}
          <div
            style={{
              display: `flex`,
              alignItems: `center`,
              justifyContent: `space-between`,
              marginBottom: `32px`,
            }}
          >
            <div>
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
                Balkan Roads
              </p>
              <h1
                style={{
                  margin: 0,
                  fontSize: `24px`,
                  fontWeight: 800,
                  color: `#f1f5f9`,
                  letterSpacing: `-0.03em`,
                }}
              >
                Nadzorna plošča
              </h1>
            </div>
            <div
              style={{
                display: `flex`,
                alignItems: `center`,
                gap: `8px`,
                padding: `6px 14px`,
                backgroundColor: `rgba(249,115,22,0.12)`,
                borderRadius: `9999px`,
                border: `1px solid rgba(249,115,22,0.25)`,
              }}
            >
              <div
                style={{
                  width: `6px`,
                  height: `6px`,
                  borderRadius: `50%`,
                  backgroundColor: `#f97316`,
                  boxShadow: `0 0 6px rgba(249,115,22,0.8)`,
                }}
              />
              <span
                style={{
                  fontSize: `11px`,
                  fontWeight: 700,
                  color: `#f97316`,
                  letterSpacing: `0.08em`,
                }}
              >
                SEZONA 2025
              </span>
            </div>
          </div>

          {/* Dashboard grid — stat cards row */}
          <div
            style={{
              display: `grid`,
              gridTemplateColumns: `repeat(4, 1fr)`,
              gap: `16px`,
              marginBottom: `24px`,
            }}
          >
            {[
              { label: `Skupaj tur`, value: `20`, unit: `tur` },
              { label: `Skupaj cest`, value: `63`, unit: `cest` },
              { label: `Držav`, value: `10`, unit: `držav` },
              { label: `Km skupaj`, value: `14.200`, unit: `km` },
            ].map(({ label, value, unit }) => (
              <div
                key={label}
                style={{
                  backgroundColor: `#0f172a`,
                  borderRadius: `12px`,
                  padding: `16px 20px`,
                  border: `1px solid rgba(148,163,184,0.12)`,
                  boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
                }}
              >
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
                  <span style={{ fontSize: `12px`, color: `#64748b` }}>{unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* The panel itself — spans full width (3 columns in a 3-col grid) */}
          <TourDashboardPanel />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * CompactTwoTours — panel configured to show only 2 tours.
 */
export const CompactTwoTours = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 32px`,
        }}
      >
        <div style={{ maxWidth: `900px`, margin: `0 auto` }}>
          <p
            style={{
              margin: `0 0 20px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Kompaktni pogled — 2 turi
          </p>
          <TourDashboardPanel count={2} />
        </div>
      </div>
    </MockProvider>
  );
};
