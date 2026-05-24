import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Modal } from './modal.js';

/* ── Shared helpers ─────────────────────────────────────────────────────────── */

const triggerButtonStyle: React.CSSProperties = {
  padding: '10px 24px',
  backgroundColor: '#f97316',
  color: '#020617',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '700',
  fontSize: '14px',
  cursor: 'pointer',
  letterSpacing: '0.02em',
};

const outlineButtonStyle: React.CSSProperties = {
  padding: '10px 24px',
  backgroundColor: 'transparent',
  color: '#94a3b8',
  border: '1px solid rgba(148,163,184,0.25)',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
};

const dangerButtonStyle: React.CSSProperties = {
  padding: '10px 24px',
  backgroundColor: 'rgba(239,68,68,0.15)',
  color: '#ef4444',
  border: '1px solid rgba(239,68,68,0.25)',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
};

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  flexWrap: 'wrap',
  padding: '40px',
};

/* ── Checklist item ─────────────────────────────────────────────────────────── */

type ChecklistItem = { id: string; label: string; checked: boolean };

const defaultChecklist: ChecklistItem[] = [
  { id: `tyre`, label: `Tyre pressure & condition`, checked: false },
  { id: `brakes`, label: `Brake pads & fluid level`, checked: false },
  { id: `chain`, label: `Chain tension & lubrication`, checked: false },
  { id: `lights`, label: `Headlight, tail & indicators`, checked: false },
  { id: `fuel`, label: `Fuel level & reserve`, checked: false },
  { id: `mirrors`, label: `Mirror alignment`, checked: false },
  { id: `controls`, label: `Throttle & clutch free play`, checked: false },
  { id: `gear`, label: `Riding gear & helmet`, checked: false },
];

/**
 * Pre-Ride Checklist — lg modal with interactive checklist body and action footer.
 */
export const PreRideChecklist = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>(defaultChecklist);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const allChecked = checkedCount === items.length;

  const handleReset = () => setItems(defaultChecklist);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <button type="button" style={triggerButtonStyle} onClick={() => setOpen(true)}>
          🏍️ Pre-Ride Checklist
        </button>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Pre-Ride Safety Checklist"
          size="lg"
          footer={
            <>
              <button type="button" style={outlineButtonStyle} onClick={handleReset}>
                Reset
              </button>
              <button
                type="button"
                style={{
                  ...triggerButtonStyle,
                  opacity: allChecked ? 1 : 0.5,
                  cursor: allChecked ? `pointer` : `not-allowed`,
                }}
                onClick={() => allChecked && setOpen(false)}
              >
                {allChecked ? `✓ Ready to Ride` : `${checkedCount} / ${items.length} Complete`}
              </button>
            </>
          }
        >
          <div style={{ display: `flex`, flexDirection: `column`, gap: `4px` }}>
            <p
              style={{
                margin: `0 0 16px`,
                fontSize: `13px`,
                color: `#64748b`,
                lineHeight: `1.6`,
              }}
            >
              Complete all safety checks before heading out. Your safety is the priority.
            </p>
            {items.map((item) => (
              <label
                key={item.id}
                style={{
                  display: `flex`,
                  alignItems: `center`,
                  gap: `12px`,
                  padding: `12px 14px`,
                  borderRadius: `8px`,
                  cursor: `pointer`,
                  backgroundColor: item.checked
                    ? `rgba(34,197,94,0.08)`
                    : `rgba(148,163,184,0.05)`,
                  border: `1px solid ${item.checked ? `rgba(34,197,94,0.2)` : `rgba(148,163,184,0.1)`}`,
                  transition: `all 0.15s ease`,
                }}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.id)}
                  style={{ accentColor: `#22c55e`, width: `16px`, height: `16px`, cursor: `pointer` }}
                />
                <span
                  style={{
                    fontSize: `14px`,
                    fontWeight: `500`,
                    color: item.checked ? `#22c55e` : `#f1f5f9`,
                    textDecoration: item.checked ? `line-through` : `none`,
                    transition: `color 0.15s ease`,
                  }}
                >
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </Modal>
      </div>
    </MockProvider>
  );
};

/**
 * Share Dialog — sm modal for sharing a route or session.
 */
export const ShareDialog = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://mototrack.app/routes/alpine-loop-2024`;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MockProvider>
      <div style={pageStyle}>
        <button type="button" style={triggerButtonStyle} onClick={() => setOpen(true)}>
          ↗ Share Route
        </button>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Share Route"
          size="sm"
          footer={
            <>
              <button type="button" style={outlineButtonStyle} onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="button" style={triggerButtonStyle} onClick={handleCopy}>
                {copied ? `✓ Copied!` : `Copy Link`}
              </button>
            </>
          }
        >
          <div style={{ display: `flex`, flexDirection: `column`, gap: `16px` }}>
            <div
              style={{
                width: `100%`,
                aspectRatio: `16/9`,
                borderRadius: `10px`,
                overflow: `hidden`,
                background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
                display: `flex`,
                alignItems: `center`,
                justifyContent: `center`,
                border: `1px solid rgba(148,163,184,0.12)`,
                position: `relative`,
              }}
            >
              <svg
                style={{ position: `absolute`, inset: 0, width: `100%`, height: `100%`, opacity: 0.08 }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="sgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#sgrid)" />
              </svg>
              <div style={{ textAlign: `center`, position: `relative` }}>
                <div style={{ fontSize: `28px`, marginBottom: `6px` }}>🏔️</div>
                <div style={{ fontSize: `13px`, fontWeight: `700`, color: `#f1f5f9` }}>Alpine Loop 2024</div>
                <div style={{ fontSize: `11px`, color: `#64748b`, marginTop: `2px` }}>248 km · 3,400 m elevation</div>
              </div>
            </div>

            <div>
              <p style={{ margin: `0 0 8px`, fontSize: `12px`, fontWeight: `600`, color: `#64748b`, letterSpacing: `0.08em`, textTransform: `uppercase` }}>
                Share Link
              </p>
              <div
                style={{
                  display: `flex`,
                  alignItems: `center`,
                  gap: `8px`,
                  padding: `10px 14px`,
                  backgroundColor: `rgba(15,23,42,0.8)`,
                  borderRadius: `8px`,
                  border: `1px solid rgba(148,163,184,0.15)`,
                }}
              >
                <span style={{ flex: 1, fontSize: `12px`, color: `#94a3b8`, fontFamily: `monospace`, overflow: `hidden`, textOverflow: `ellipsis`, whiteSpace: `nowrap` }}>
                  {shareUrl}
                </span>
              </div>
            </div>

            <div style={{ display: `flex`, gap: `8px` }}>
              {[`WhatsApp`, `Telegram`, `Email`].map((platform) => (
                <button
                  key={platform}
                  type="button"
                  style={{
                    flex: 1,
                    padding: `8px 4px`,
                    backgroundColor: `rgba(148,163,184,0.06)`,
                    border: `1px solid rgba(148,163,184,0.12)`,
                    borderRadius: `8px`,
                    color: `#94a3b8`,
                    fontSize: `12px`,
                    fontWeight: `600`,
                    cursor: `pointer`,
                  }}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    </MockProvider>
  );
};

/**
 * Settings Modal — md modal with tabbed settings sections.
 */
export const SettingsModal = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(`profile`);
  const [units, setUnits] = useState<`metric` | `imperial`>(`metric`);
  const [notifications, setNotifications] = useState(true);
  const [liveTracking, setLiveTracking] = useState(true);

  const tabs = [
    { id: `profile`, label: `Profile` },
    { id: `units`, label: `Units` },
    { id: `privacy`, label: `Privacy` },
  ];

  return (
    <MockProvider>
      <div style={pageStyle}>
        <button type="button" style={outlineButtonStyle} onClick={() => setOpen(true)}>
          ⚙ Settings
        </button>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Settings"
          size="md"
          footer={
            <>
              <button type="button" style={dangerButtonStyle} onClick={() => setOpen(false)}>
                Discard
              </button>
              <button type="button" style={triggerButtonStyle} onClick={() => setOpen(false)}>
                Save Changes
              </button>
            </>
          }
        >
          {/* Tabs */}
          <div
            style={{
              display: `flex`,
              gap: `4px`,
              marginBottom: `24px`,
              backgroundColor: `rgba(15,23,42,0.6)`,
              borderRadius: `10px`,
              padding: `4px`,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: `8px 12px`,
                  borderRadius: `7px`,
                  border: `none`,
                  backgroundColor: activeTab === tab.id ? `#f97316` : `transparent`,
                  color: activeTab === tab.id ? `#020617` : `#94a3b8`,
                  fontWeight: `700`,
                  fontSize: `13px`,
                  cursor: `pointer`,
                  transition: `all 0.15s ease`,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {activeTab === `profile` && (
            <div style={{ display: `flex`, flexDirection: `column`, gap: `16px` }}>
              <div style={{ display: `flex`, alignItems: `center`, gap: `16px`, marginBottom: `8px` }}>
                <div
                  style={{
                    width: `64px`,
                    height: `64px`,
                    borderRadius: `50%`,
                    background: `linear-gradient(135deg, #f97316, #ea580c)`,
                    display: `flex`,
                    alignItems: `center`,
                    justifyContent: `center`,
                    fontSize: `24px`,
                    fontWeight: `800`,
                    color: `#020617`,
                    flexShrink: 0,
                  }}
                >
                  M
                </div>
                <div>
                  <div style={{ fontSize: `16px`, fontWeight: `700`, color: `#f1f5f9` }}>Marco Bianchi</div>
                  <div style={{ fontSize: `13px`, color: `#64748b`, marginTop: `2px` }}>marco@mototrack.app</div>
                </div>
              </div>
              {[
                { label: `Display Name`, value: `Marco Bianchi` },
                { label: `Rider Number`, value: `#46` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ margin: `0 0 6px`, fontSize: `12px`, fontWeight: `600`, color: `#64748b`, letterSpacing: `0.08em`, textTransform: `uppercase` }}>
                    {label}
                  </p>
                  <input
                    defaultValue={value}
                    style={{
                      width: `100%`,
                      padding: `10px 14px`,
                      backgroundColor: `rgba(15,23,42,0.8)`,
                      border: `1px solid rgba(148,163,184,0.15)`,
                      borderRadius: `8px`,
                      color: `#f1f5f9`,
                      fontSize: `14px`,
                      outline: `none`,
                      boxSizing: `border-box`,
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Units tab */}
          {activeTab === `units` && (
            <div style={{ display: `flex`, flexDirection: `column`, gap: `16px` }}>
              <p style={{ margin: `0 0 4px`, fontSize: `13px`, color: `#94a3b8`, lineHeight: `1.6` }}>
                Choose your preferred measurement system for speed, distance, and temperature.
              </p>
              {([`metric`, `imperial`] as const).map((u) => (
                <label
                  key={u}
                  style={{
                    display: `flex`,
                    alignItems: `center`,
                    gap: `14px`,
                    padding: `14px 16px`,
                    borderRadius: `10px`,
                    cursor: `pointer`,
                    border: `1px solid ${units === u ? `rgba(249,115,22,0.4)` : `rgba(148,163,184,0.1)`}`,
                    backgroundColor: units === u ? `rgba(249,115,22,0.08)` : `rgba(148,163,184,0.04)`,
                  }}
                >
                  <input
                    type="radio"
                    name="units"
                    value={u}
                    checked={units === u}
                    onChange={() => setUnits(u)}
                    style={{ accentColor: `#f97316`, width: `16px`, height: `16px` }}
                  />
                  <div>
                    <div style={{ fontSize: `14px`, fontWeight: `600`, color: `#f1f5f9`, textTransform: `capitalize` }}>{u}</div>
                    <div style={{ fontSize: `12px`, color: `#64748b`, marginTop: `2px` }}>
                      {u === `metric` ? `km/h · km · °C` : `mph · mi · °F`}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Privacy tab */}
          {activeTab === `privacy` && (
            <div style={{ display: `flex`, flexDirection: `column`, gap: `12px` }}>
              {[
                { label: `Push Notifications`, sub: `Race alerts, lap times, and updates`, value: notifications, onChange: () => setNotifications((v) => !v) },
                { label: `Live Tracking`, sub: `Share your position during active sessions`, value: liveTracking, onChange: () => setLiveTracking((v) => !v) },
              ].map(({ label, sub, value, onChange }) => (
                <div
                  key={label}
                  style={{
                    display: `flex`,
                    alignItems: `center`,
                    justifyContent: `space-between`,
                    padding: `14px 16px`,
                    borderRadius: `10px`,
                    border: `1px solid rgba(148,163,184,0.1)`,
                    backgroundColor: `rgba(148,163,184,0.04)`,
                    gap: `16px`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: `14px`, fontWeight: `600`, color: `#f1f5f9` }}>{label}</div>
                    <div style={{ fontSize: `12px`, color: `#64748b`, marginTop: `2px` }}>{sub}</div>
                  </div>
                  <button
                    type="button"
                    onClick={onChange}
                    style={{
                      width: `44px`,
                      height: `24px`,
                      borderRadius: `12px`,
                      border: `none`,
                      backgroundColor: value ? `#f97316` : `rgba(148,163,184,0.2)`,
                      cursor: `pointer`,
                      position: `relative`,
                      flexShrink: 0,
                      transition: `background-color 0.2s ease`,
                    }}
                  >
                    <span
                      style={{
                        position: `absolute`,
                        top: `2px`,
                        left: value ? `22px` : `2px`,
                        width: `20px`,
                        height: `20px`,
                        borderRadius: `50%`,
                        backgroundColor: `#fff`,
                        transition: `left 0.2s ease`,
                        display: `block`,
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Modal>
      </div>
    </MockProvider>
  );
};
