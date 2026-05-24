import * as React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { FeedList } from './feed-list.js';
import { MOCK_FEED_ITEMS } from './feed-list.mock.js';
import type { FeedItem } from '@markec/community.entities.feed-item';

const FEED_IMAGE_URL = `https://storage.googleapis.com/bit-generated-images/images/image_dark_motorcycle_community_acti_0_1779625014756.png`;

function PageWrapper({ children }: { children?: React.ReactNode }) {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 24px`,
        }}
      >
        <div style={{ maxWidth: `680px`, margin: `0 auto` }}>
          {children}
        </div>
      </div>
    </MockProvider>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
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
        Community
      </p>
      <h2
        style={{
          margin: `0 0 4px`,
          fontSize: `22px`,
          fontWeight: 800,
          color: `#f1f5f9`,
          letterSpacing: `-0.02em`,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>{subtitle}</p>
      )}
    </div>
  );
}

/**
 * Full Feed — all activity types rendered in a realistic community feed.
 */
export const FullFeed = () => {
  return (
    <PageWrapper>
      <div
        style={{
          borderRadius: `16px`,
          overflow: `hidden`,
          marginBottom: `24px`,
          height: `160px`,
          position: `relative`,
        }}
      >
        <img
          src={FEED_IMAGE_URL}
          alt="MotoTrack Community"
          style={{ width: `100%`, height: `100%`, objectFit: `cover`, display: `block` }}
        />
        <div
          style={{
            position: `absolute`,
            inset: 0,
            background: `linear-gradient(to bottom, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.85) 100%)`,
            display: `flex`,
            alignItems: `flex-end`,
            padding: `20px 24px`,
          }}
        >
          <div>
            <p style={{ margin: `0 0 2px`, fontSize: `11px`, fontWeight: 700, letterSpacing: `0.12em`, textTransform: `uppercase`, color: `#f97316` }}>
              Community
            </p>
            <h2 style={{ margin: 0, fontSize: `20px`, fontWeight: 800, color: `#f1f5f9`, letterSpacing: `-0.02em` }}>
              Activity Feed
            </h2>
          </div>
        </div>
      </div>

      <FeedList items={MOCK_FEED_ITEMS} />
    </PageWrapper>
  );
};

/**
 * Ride Only — feed filtered to show only ride activities.
 */
export const RideOnlyFeed = () => {
  const rideItems: FeedItem[] = MOCK_FEED_ITEMS.filter((item) => item.kind === `ride`);

  return (
    <PageWrapper>
      <SectionHeader
        title="Recent Rides"
        subtitle="Latest rides logged by the community"
      />
      <FeedList items={rideItems} />
    </PageWrapper>
  );
};

/**
 * Empty State — feed with no items.
 */
export const EmptyFeed = () => {
  return (
    <PageWrapper>
      <SectionHeader
        title="Activity Feed"
        subtitle="No activity to show yet"
      />
      <div
        style={{
          backgroundColor: `#0f172a`,
          borderRadius: `16px`,
          border: `1px solid rgba(148,163,184,0.12)`,
          overflow: `hidden`,
        }}
      >
        <FeedList items={[]} />
      </div>
    </PageWrapper>
  );
};
