import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Avatar } from './avatar.js';

const RACER_IMAGE = `https://storage.googleapis.com/bit-generated-images/images/image_professional_motorcycle_racer__0_1779615998015.png`;

const sectionLabel: React.CSSProperties = {
  fontSize: `11px`,
  fontWeight: `700`,
  letterSpacing: `0.12em`,
  textTransform: `uppercase`,
  color: `#f97316`,
  marginBottom: `16px`,
  marginTop: `0`,
};

const divider: React.CSSProperties = {
  height: `1px`,
  backgroundColor: `rgba(148,163,184,0.12)`,
  margin: `32px 0`,
};

const row: React.CSSProperties = {
  display: `flex`,
  alignItems: `center`,
  gap: `16px`,
  flexWrap: `wrap`,
};

const label: React.CSSProperties = {
  fontSize: `11px`,
  color: `#64748b`,
  marginTop: `8px`,
  textAlign: `center`,
  fontFamily: `monospace`,
};

const card: React.CSSProperties = {
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,
};

/**
 * All sizes — initials and image variants side by side.
 */
export const AllSizes = () => {
  const sizes = [`xs`, `sm`, `md`, `lg`, `xl`] as const;

  return (
    <MockProvider>
      <div style={{ padding: `40px`, backgroundColor: `#020617`, minHeight: `100vh` }}>
        <p style={sectionLabel}>Initials — all sizes</p>
        <div style={row}>
          {sizes.map((size) => (
            <div key={size} style={card}>
              <Avatar name="Marco Bianchi" size={size} />
              <span style={label}>{size}</span>
            </div>
          ))}
        </div>

        <div style={divider} />

        <p style={sectionLabel}>Image — all sizes</p>
        <div style={row}>
          {sizes.map((size) => (
            <div key={size} style={card}>
              <Avatar
                name="Marco Bianchi"
                src={RACER_IMAGE}
                size={size}
              />
              <span style={label}>{size}</span>
            </div>
          ))}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Status dots — online and offline indicators.
 */
export const WithStatus = () => {
  return (
    <MockProvider>
      <div style={{ padding: `40px`, backgroundColor: `#020617`, minHeight: `100vh` }}>
        <p style={sectionLabel}>Online status</p>
        <div style={row}>
          <div style={card}>
            <Avatar name="Marco Bianchi" size="xl" status="online" />
            <span style={label}>online · initials</span>
          </div>
          <div style={card}>
            <Avatar name="Marco Bianchi" src={RACER_IMAGE} size="xl" status="online" />
            <span style={label}>online · image</span>
          </div>
          <div style={card}>
            <Avatar name="Luka Horvat" size="lg" status="online" />
            <span style={label}>online · lg</span>
          </div>
          <div style={card}>
            <Avatar name="Carlos Ruiz" size="md" status="online" />
            <span style={label}>online · md</span>
          </div>
          <div style={card}>
            <Avatar name="Jan Novák" size="sm" status="online" />
            <span style={label}>online · sm</span>
          </div>
          <div style={card}>
            <Avatar name="Tomáš K" size="xs" status="online" />
            <span style={label}>online · xs</span>
          </div>
        </div>

        <div style={divider} />

        <p style={sectionLabel}>Offline status</p>
        <div style={row}>
          <div style={card}>
            <Avatar name="Marco Bianchi" size="xl" status="offline" />
            <span style={label}>offline · initials</span>
          </div>
          <div style={card}>
            <Avatar name="Marco Bianchi" src={RACER_IMAGE} size="xl" status="offline" />
            <span style={label}>offline · image</span>
          </div>
          <div style={card}>
            <Avatar name="Luka Horvat" size="lg" status="offline" />
            <span style={label}>offline · lg</span>
          </div>
          <div style={card}>
            <Avatar name="Carlos Ruiz" size="md" status="offline" />
            <span style={label}>offline · md</span>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Team roster — realistic MotoTrack rider list with mixed states.
 */
export const TeamRoster = () => {
  const riders = [
    { name: `Marco Bianchi`, role: `Team Captain`, src: RACER_IMAGE, status: `online` as const },
    { name: `Luka Horvat`, role: `Lead Rider`, status: `online` as const },
    { name: `Carlos Ruiz`, role: `Rookie`, status: `offline` as const },
    { name: `Jan Novák`, role: `Mechanic`, status: `offline` as const },
    { name: `Tomáš Kováč`, role: `Strategist`, status: `online` as const },
  ];

  return (
    <MockProvider>
      <div style={{ padding: `40px`, backgroundColor: `#020617`, minHeight: `100vh` }}>
        <p style={sectionLabel}>Team Roster</p>
        <div style={{ display: `flex`, flexDirection: `column`, gap: `12px`, maxWidth: `360px` }}>
          {riders.map((rider) => (
            <div
              key={rider.name}
              style={{
                display: `flex`,
                alignItems: `center`,
                gap: `14px`,
                backgroundColor: `#0f172a`,
                borderRadius: `12px`,
                padding: `12px 16px`,
                border: `1px solid rgba(148,163,184,0.12)`,
                boxShadow: `0 2px 8px rgba(0,0,0,0.4)`,
              }}
            >
              <Avatar
                name={rider.name}
                src={rider.src}
                size="md"
                status={rider.status}
              />
              <div>
                <div style={{ fontSize: `14px`, fontWeight: `700`, color: `#f1f5f9` }}>
                  {rider.name}
                </div>
                <div style={{ fontSize: `12px`, color: `#64748b`, marginTop: `2px` }}>
                  {rider.role}
                </div>
              </div>
              <div style={{ marginLeft: `auto` }}>
                <span
                  style={{
                    fontSize: `10px`,
                    fontWeight: `600`,
                    letterSpacing: `0.08em`,
                    color: rider.status === `online` ? `#22c55e` : `#64748b`,
                    textTransform: `uppercase`,
                  }}
                >
                  {rider.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockProvider>
  );
};
