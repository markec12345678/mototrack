import * as React from 'react';
import { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { HazardReportButton } from './hazard-report-button.js';

/**
 * Default — floating ⚠️ button anchored bottom-right, all 8 hazard types.
 */
export const Default = () => {
  return (
    <MockProvider>
      <div
        style={{
          position: `relative`,
          width: `100%`,
          minHeight: `100vh`,
          background: `linear-gradient(160deg, #020617 0%, #0f172a 50%, #020617 100%)`,
          overflow: `hidden`,
        }}
      >
        <svg
          style={{ position: `absolute`, inset: 0, width: `100%`, height: `100%`, opacity: 0.06 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="mapgrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#94a3b8" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapgrid)" />
        </svg>

        <svg
          style={{ position: `absolute`, inset: 0, width: `100%`, height: `100%`, opacity: 0.12 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 0 300 Q 300 220 600 300 T 1200 300" stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="14 7" />
          <path d="M 200 0 Q 280 300 260 700" stroke="#94a3b8" strokeWidth="2" fill="none" />
          <path d="M 600 0 Q 650 300 620 700" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
          <path d="M 900 100 Q 800 350 850 700" stroke="#94a3b8" strokeWidth="1" fill="none" />
        </svg>

        <div
          style={{
            position: `absolute`,
            top: `50%`,
            left: `50%`,
            transform: `translate(-50%, -50%)`,
            textAlign: `center`,
          }}
        >
          <div
            style={{
              fontSize: `11px`,
              fontWeight: `700`,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
              marginBottom: `8px`,
            }}
          >
            Live Map View
          </div>
          <div style={{ fontSize: `13px`, color: `#64748b` }}>
            Tap ⚠️ to report a road hazard
          </div>
        </div>

        <HazardReportButton onReported={(id, type) => console.log(`Reported: ${type} (${id})`)} />
      </div>
    </MockProvider>
  );
};

/**
 * WithCallback — demonstrates the onReported callback with a live log.
 */
export const WithCallback = () => {
  const [log, setLog] = useState<string[]>([]);

  return (
    <MockProvider>
      <div
        style={{
          position: `relative`,
          width: `100%`,
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          overflow: `hidden`,
        }}
      >
        <div
          style={{
            position: `absolute`,
            top: `24px`,
            left: `24px`,
            width: `280px`,
            backgroundColor: `#0f172a`,
            borderRadius: `12px`,
            border: `1px solid rgba(148,163,184,0.12)`,
            boxShadow: `0 4px 24px rgba(0,0,0,0.6)`,
            overflow: `hidden`,
          }}
        >
          <div
            style={{
              padding: `12px 16px`,
              borderBottom: `1px solid rgba(148,163,184,0.1)`,
              display: `flex`,
              alignItems: `center`,
              gap: `8px`,
            }}
          >
            <div
              style={{
                width: `8px`,
                height: `8px`,
                borderRadius: `50%`,
                backgroundColor: `#22c55e`,
                boxShadow: `0 0 6px rgba(34,197,94,0.8)`,
              }}
            />
            <span
              style={{
                fontSize: `11px`,
                fontWeight: `700`,
                letterSpacing: `0.1em`,
                textTransform: `uppercase`,
                color: `#f97316`,
              }}
            >
              Report Log
            </span>
          </div>
          <div style={{ padding: `12px 16px`, minHeight: `80px` }}>
            {log.length === 0 ? (
              <p style={{ margin: 0, fontSize: `12px`, color: `#64748b` }}>
                No reports yet. Tap ⚠️ to report a hazard.
              </p>
            ) : (
              <div style={{ display: `flex`, flexDirection: `column`, gap: `6px` }}>
                {log.map((entry, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: `12px`,
                      color: `#f1f5f9`,
                      padding: `6px 10px`,
                      backgroundColor: `rgba(249,115,22,0.08)`,
                      borderRadius: `6px`,
                      border: `1px solid rgba(249,115,22,0.2)`,
                    }}
                  >
                    {entry}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <HazardReportButton
          onReported={(id, type) => {
            setLog((prev) => [`✅ ${type} reported`, ...prev.slice(0, 4)]);
          }}
        />
      </div>
    </MockProvider>
  );
};

/**
 * CustomHazardTypes — only 4 hazard types for a simplified road-worker view.
 */
export const CustomHazardTypes = () => {
  return (
    <MockProvider>
      <div
        style={{
          position: `relative`,
          width: `100%`,
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          overflow: `hidden`,
        }}
      >
        <div
          style={{
            position: `absolute`,
            top: `24px`,
            left: `50%`,
            transform: `translateX(-50%)`,
            display: `inline-flex`,
            alignItems: `center`,
            gap: `8px`,
            padding: `6px 16px`,
            backgroundColor: `rgba(249,115,22,0.12)`,
            borderRadius: `9999px`,
            border: `1px solid rgba(249,115,22,0.3)`,
          }}
        >
          <span style={{ fontSize: `12px`, fontWeight: `600`, color: `#f97316` }}>
            🚧 Road Worker Mode — 4 hazard types
          </span>
        </div>

        <HazardReportButton
          hazardTypes={[
            { id: `construction`, label: `Construction`, emoji: `🚧`, color: `#d97706` },
            { id: `pothole`, label: `Pothole`, emoji: `🕳️`, color: `#b45309` },
            { id: `oil`, label: `Oil Spill`, emoji: `🛢️`, color: `#7c3aed` },
            { id: `flood`, label: `Flood`, emoji: `🌊`, color: `#2563eb` },
          ]}
          onReported={(id, type) => console.log(`Worker reported: ${type}`)}
        />
      </div>
    </MockProvider>
  );
};
