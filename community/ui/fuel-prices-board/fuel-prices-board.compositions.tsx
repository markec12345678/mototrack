import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { FuelPricesBoard } from './fuel-prices-board.js';
import { mockFuelPriceReports, mockCountryAverages } from './fuel-prices-board.mock.js';

const pageStyle: React.CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
  padding: `40px 32px`,
};

const contentStyle: React.CSSProperties = {
  maxWidth: `960px`,
  margin: `0 auto`,
};

/**
 * Full Board — complete view with country averages table, report form, and expandable per-country reports.
 */
export const FullBoard = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={contentStyle}>
          <div style={{ marginBottom: `32px` }}>
            <p
              style={{
                margin: `0 0 6px`,
                fontSize: `11px`,
                fontWeight: 700,
                letterSpacing: `0.12em`,
                textTransform: `uppercase`,
                color: `#f97316`,
              }}
            >
              Community Feature
            </p>
            <h1
              style={{
                margin: `0 0 8px`,
                fontSize: `30px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.03em`,
              }}
            >
              Fuel Prices Board
            </h1>
            <p style={{ margin: 0, fontSize: `15px`, color: `#94a3b8` }}>
              Real-time crowd-sourced fuel prices across the Balkans. Click a country row to see recent reports.
            </p>
          </div>

          <FuelPricesBoard
            mockReports={mockFuelPriceReports}
            mockAverages={mockCountryAverages}
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Minimal Data — board with a small subset of reports to show empty states.
 */
export const MinimalData = () => {
  const fewReports = mockFuelPriceReports.slice(0, 3);
  const fewAverages = mockCountryAverages.slice(0, 3);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={contentStyle}>
          <div style={{ marginBottom: `32px` }}>
            <p
              style={{
                margin: `0 0 6px`,
                fontSize: `11px`,
                fontWeight: 700,
                letterSpacing: `0.12em`,
                textTransform: `uppercase`,
                color: `#f97316`,
              }}
            >
              Sparse Data
            </p>
            <h1
              style={{
                margin: `0 0 8px`,
                fontSize: `24px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.03em`,
              }}
            >
              Fuel Prices — Early Stage
            </h1>
            <p style={{ margin: 0, fontSize: `14px`, color: `#94a3b8` }}>
              Showing a board with only a few reports to demonstrate sparse-data states.
            </p>
          </div>

          <FuelPricesBoard
            mockReports={fewReports}
            mockAverages={fewAverages}
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Report Form Focus — scrolled to the contribution section with a highlighted prompt.
 */
export const ReportFormFocus = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={contentStyle}>
          <div
            style={{
              marginBottom: `32px`,
              padding: `20px 24px`,
              backgroundColor: `rgba(249,115,22,0.08)`,
              borderRadius: `12px`,
              border: `1px solid rgba(249,115,22,0.2)`,
              display: `flex`,
              alignItems: `center`,
              gap: `16px`,
            }}
          >
            <div
              style={{
                width: `40px`,
                height: `40px`,
                borderRadius: `50%`,
                backgroundColor: `rgba(249,115,22,0.2)`,
                display: `flex`,
                alignItems: `center`,
                justifyContent: `center`,
                flexShrink: 0,
                fontSize: `20px`,
              }}
            >
              ⛽
            </div>
            <div>
              <p
                style={{
                  margin: `0 0 4px`,
                  fontSize: `14px`,
                  fontWeight: 700,
                  color: `#f97316`,
                }}
              >
                Spotted a great fuel price on your ride?
              </p>
              <p style={{ margin: 0, fontSize: `13px`, color: `#94a3b8` }}>
                Report it below and help fellow riders plan their routes smarter.
              </p>
            </div>
          </div>

          <FuelPricesBoard
            mockReports={mockFuelPriceReports}
            mockAverages={mockCountryAverages}
          />
        </div>
      </div>
    </MockProvider>
  );
};
