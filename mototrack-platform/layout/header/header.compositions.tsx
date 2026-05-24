import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Header } from './header.js';
import {
  MOCK_HEADER_ACTIONS,
  MOCK_SOS_ACTION,
  MOCK_MOTOCHAT_ACTION,
  MOCK_NOTIFICATIONS_ACTION,
  MOCK_AVATAR_URL,
} from './header.mock.js';

const pageStyle: React.CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
};

const contentStyle: React.CSSProperties = {
  padding: `48px 32px`,
  maxWidth: `800px`,
  margin: `0 auto`,
};

const labelStyle: React.CSSProperties = {
  fontSize: `11px`,
  fontWeight: 700,
  letterSpacing: `0.12em`,
  textTransform: `uppercase` as const,
  color: `#f97316`,
  marginBottom: `8px`,
  marginTop: `0`,
};

const descStyle: React.CSSProperties = {
  fontSize: `14px`,
  color: `#64748b`,
  lineHeight: `1.6`,
  marginTop: `8px`,
  marginBottom: `0`,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: `#0f172a`,
  borderRadius: `12px`,
  padding: `20px 24px`,
  border: `1px solid rgba(148,163,184,0.12)`,
  boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
  marginTop: `32px`,
};

/**
 * Full header — all three actions (SOS, MotoChat, Notifications) + UserBar.
 */
export const FullHeader = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <Header
          headerActions={MOCK_HEADER_ACTIONS}
          profileHref="/profile"
          settingsHref="/settings"
          loginHref="/login"
          signupHref="/signup"
        />
        <div style={contentStyle}>
          <p style={labelStyle}>Full Header</p>
          <p style={descStyle}>
            Sticky dark-gradient header with Logo on the left, all three slot actions (SOS, MotoChat,
            Notifications) in the center/right, and the UserBar on the far right. On mobile, actions
            collapse into a 3-dot menu — only SOS stays visible.
          </p>
          <div style={cardStyle}>
            <div style={{ display: `grid`, gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`, gap: `16px` }}>
              {[
                { label: `Logo`, desc: `Links to home, sm size` },
                { label: `SOS Button`, desc: `Always visible, pulsing red glow` },
                { label: `MotoChat`, desc: `Opens rider chat panel` },
                { label: `Notifications`, desc: `Bell icon with updates` },
                { label: `UserBar`, desc: `Auth-aware, far right` },
              ].map(({ label, desc }) => (
                <div
                  key={label}
                  style={{
                    backgroundColor: `#1e293b`,
                    borderRadius: `10px`,
                    padding: `14px 16px`,
                    border: `1px solid rgba(148,163,184,0.1)`,
                  }}
                >
                  <div style={{ fontSize: `11px`, fontWeight: 700, color: `#f97316`, letterSpacing: `0.08em`, textTransform: `uppercase`, marginBottom: `6px` }}>
                    {label}
                  </div>
                  <div style={{ fontSize: `13px`, color: `#94a3b8` }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * SOS-only header — only the SOS action registered in the slot.
 */
export const SosOnlyHeader = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <Header
          headerActions={[MOCK_SOS_ACTION]}
          loginHref="/login"
          signupHref="/signup"
        />
        <div style={contentStyle}>
          <p style={labelStyle}>SOS Only</p>
          <p style={descStyle}>
            When only the SOS action is registered in the slot, the header renders just the pulsing
            SOS button. No 3-dot menu appears since there are no other actions to collapse.
          </p>
          <div style={cardStyle}>
            <div style={{ display: `flex`, flexDirection: `column` as const, gap: `12px` }}>
              {[
                { icon: `🚨`, title: `Emergency SOS`, desc: `Sends your GPS location to emergency contacts and nearby riders.` },
                { icon: `📍`, title: `Live Location`, desc: `Broadcasts your position on the MotoTrack map for 15 minutes.` },
                { icon: `📞`, title: `Auto-call`, desc: `Optionally dials your emergency contact after a 10-second countdown.` },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  style={{
                    display: `flex`,
                    alignItems: `flex-start`,
                    gap: `14px`,
                    padding: `14px 16px`,
                    backgroundColor: `rgba(220,38,38,0.06)`,
                    borderRadius: `10px`,
                    border: `1px solid rgba(220,38,38,0.2)`,
                  }}
                >
                  <span style={{ fontSize: `22px`, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: `13px`, fontWeight: 700, color: `#f1f5f9`, marginBottom: `4px` }}>{title}</div>
                    <div style={{ fontSize: `12px`, color: `#94a3b8` }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Custom actions header — custom set of actions demonstrating slot flexibility.
 */
export const CustomActionsHeader = () => {
  const customActions = [
    { ...MOCK_SOS_ACTION },
    { ...MOCK_MOTOCHAT_ACTION, label: `Chat`, icon: `💬`, order: 2 },
    { ...MOCK_NOTIFICATIONS_ACTION, label: `Alerts`, icon: `🔔`, order: 3 },
    {
      key: `live`,
      label: `Live`,
      icon: `📡`,
      order: 4,
      onClick: () => undefined,
    },
  ];

  return (
    <MockProvider>
      <div style={pageStyle}>
        <Header
          headerActions={customActions}
          avatarSrc={MOCK_AVATAR_URL}
          profileHref="/profile"
          settingsHref="/settings"
          loginHref="/login"
          signupHref="/signup"
        />
        <div style={contentStyle}>
          <p style={labelStyle}>Custom Actions Slot</p>
          <p style={descStyle}>
            Four actions registered in the slot: SOS, Chat, Alerts, and a Live tracking toggle.
            On desktop all four are visible. On mobile, SOS stays pinned and the rest collapse
            into the 3-dot overflow menu.
          </p>
          <div style={cardStyle}>
            <p style={{ margin: `0 0 16px`, fontSize: `12px`, fontWeight: 700, color: `#f97316`, letterSpacing: `0.1em`, textTransform: `uppercase` }}>
              Registered Slot Actions
            </p>
            <div style={{ display: `flex`, flexDirection: `column` as const, gap: `8px` }}>
              {customActions.map((action) => (
                <div
                  key={action.key}
                  style={{
                    display: `flex`,
                    alignItems: `center`,
                    gap: `12px`,
                    padding: `10px 14px`,
                    backgroundColor: `#1e293b`,
                    borderRadius: `8px`,
                    border: `1px solid rgba(148,163,184,0.1)`,
                  }}
                >
                  <span style={{ fontSize: `18px` }}>{action.icon}</span>
                  <div>
                    <div style={{ fontSize: `13px`, fontWeight: 600, color: `#f1f5f9` }}>{action.label}</div>
                    <div style={{ fontSize: `11px`, color: `#64748b` }}>order: {action.order}</div>
                  </div>
                  {action.key === `sos` && (
                    <span style={{ marginLeft: `auto`, fontSize: `10px`, fontWeight: 700, color: `#ef4444`, letterSpacing: `0.08em`, textTransform: `uppercase` }}>
                      Always visible
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
