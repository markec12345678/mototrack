import * as React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RideDetail } from './ride-detail.js';
import { MOCK_TABS, MOCK_RIDE } from './ride-detail.mock.js';
import type { RideDetailTab } from './ride-detail-tab-type.js';

// ── Placeholder tab content ───────────────────────────────────────────────────

function PhotosTabContent(_props: { rideId: string }) {
  const photos = [
    `https://storage.googleapis.com/bit-generated-images/images/image_dark_motorcycle_racing_dashboa_0_1779615246683.png`,
  ];

  return (
    <div style={{ display: `flex`, flexDirection: `column`, gap: `16px` }}>
      <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
        3 photos from this ride
      </p>
      <div style={{ display: `grid`, gridTemplateColumns: `repeat(auto-fill, minmax(180px, 1fr))`, gap: `12px` }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: `140px`,
              borderRadius: `10px`,
              overflow: `hidden`,
              backgroundColor: `#1e293b`,
              border: `1px solid rgba(148,163,184,0.12)`,
            }}
          >
            <img
              src={photos[0]}
              alt={`Ride photo ${i}`}
              style={{ width: `100%`, height: `100%`, objectFit: `cover`, opacity: 0.7 + i * 0.1 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function WeatherTabContent(_props: { rideId: string }) {
  return (
    <div style={{ display: `flex`, flexDirection: `column`, gap: `16px` }}>
      <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
        Weather conditions recorded during the ride
      </p>
      <div style={{ display: `grid`, gridTemplateColumns: `repeat(auto-fill, minmax(140px, 1fr))`, gap: `12px` }}>
        {[
          { icon: `🌡️`, label: `Temperature`, value: `22°C` },
          { icon: `💧`, label: `Humidity`, value: `58%` },
          { icon: `💨`, label: `Wind`, value: `12 km/h` },
          { icon: `☀️`, label: `Conditions`, value: `Clear` },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            style={{
              backgroundColor: `#1e293b`,
              borderRadius: `10px`,
              padding: `16px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              display: `flex`,
              flexDirection: `column`,
              gap: `8px`,
            }}
          >
            <span style={{ fontSize: `24px` }}>{icon}</span>
            <span style={{ fontSize: `10px`, color: `#64748b`, fontWeight: 700, textTransform: `uppercase`, letterSpacing: `0.08em` }}>{label}</span>
            <span style={{ fontSize: `20px`, fontWeight: 800, color: `#f1f5f9` }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentsTabContent(_props: { rideId: string }) {
  const comments = [
    { author: `Luka H.`, time: `2h ago`, text: `Epic climb! Those hairpins above the cable car are insane 🔥` },
    { author: `Carlos R.`, time: `5h ago`, text: `Nice twistiness score. Did you push hard on the descent?` },
  ];

  return (
    <div style={{ display: `flex`, flexDirection: `column`, gap: `16px` }}>
      {comments.map((c) => (
        <div
          key={c.author}
          style={{
            backgroundColor: `#1e293b`,
            borderRadius: `10px`,
            padding: `16px`,
            border: `1px solid rgba(148,163,184,0.12)`,
          }}
        >
          <div style={{ display: `flex`, justifyContent: `space-between`, marginBottom: `8px` }}>
            <span style={{ fontSize: `13px`, fontWeight: 700, color: `#f1f5f9` }}>{c.author}</span>
            <span style={{ fontSize: `11px`, color: `#64748b` }}>{c.time}</span>
          </div>
          <p style={{ margin: 0, fontSize: `13px`, color: `#94a3b8`, lineHeight: 1.6 }}>{c.text}</p>
        </div>
      ))}
    </div>
  );
}

// ── Slot-registered tabs ──────────────────────────────────────────────────────

const COMPOSITION_TABS: RideDetailTab[] = [
  {
    key: `photos`,
    label: `Photos`,
    icon: `📷`,
    component: PhotosTabContent,
    order: 1,
  },
  {
    key: `weather`,
    label: `Weather`,
    icon: `🌤️`,
    component: WeatherTabContent,
    order: 2,
  },
  {
    key: `comments`,
    label: `Comments`,
    icon: `💬`,
    component: CommentsTabContent,
    order: 3,
  },
];

// ── Compositions ──────────────────────────────────────────────────────────────

/**
 * FullRideDetail — complete ride detail page with map, stats, elevation, and slot tabs.
 * Uses mock ride data from useRides hook.
 */
export const FullRideDetail = () => {
  return (
    <MockProvider>
      <RideDetail
        rideId={MOCK_RIDE.id}
        tabs={COMPOSITION_TABS}
      />
    </MockProvider>
  );
};

/**
 * NoTabs — ride detail without any registered slot tabs.
 * Shows the map, stats grid, and elevation profile only.
 */
export const NoTabs = () => {
  return (
    <MockProvider>
      <RideDetail
        rideId={MOCK_RIDE.id}
        tabs={[]}
      />
    </MockProvider>
  );
};

/**
 * RideNotFound — renders the not-found empty state for an unknown ride ID.
 */
export const RideNotFound = () => {
  return (
    <MockProvider>
      <RideDetail
        rideId="non-existent-ride-id"
        tabs={MOCK_TABS}
      />
    </MockProvider>
  );
};
