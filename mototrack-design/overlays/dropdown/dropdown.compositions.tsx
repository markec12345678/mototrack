import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Dropdown } from './dropdown.js';
import { type DropdownItem } from './dropdown-item-type.js';

// ─── Icons ────────────────────────────────────────────────────────────────────

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2v12M3 2h8l-2 4 2 4H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Trigger Buttons ──────────────────────────────────────────────────────────

function UserTrigger() {
  return (
    <div
      style={{
        display: `flex`,
        alignItems: `center`,
        gap: `10px`,
        padding: `6px 12px`,
        backgroundColor: `var(--colors-surface-secondary)`,
        borderRadius: `var(--borders-radius-large)`,
        border: `1px solid var(--colors-border-default)`,
        cursor: `pointer`,
        transition: `background-color 150ms ease`,
      }}
    >
      <div
        style={{
          width: `32px`,
          height: `32px`,
          borderRadius: `50%`,
          background: `linear-gradient(135deg, #f97316, #ea580c)`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          fontWeight: `700`,
          fontSize: `13px`,
          color: `#020617`,
          flexShrink: 0,
        }}
      >
        MR
      </div>
      <div style={{ textAlign: `left` }}>
        <div style={{ fontSize: `13px`, fontWeight: `600`, color: `var(--colors-text-primary)` }}>Marco Rossi</div>
        <div style={{ fontSize: `11px`, color: `var(--colors-text-muted)` }}>Race Admin</div>
      </div>
    </div>
  );
}

function CountryTrigger({ label, flag }: { label: string; flag: string }) {
  return (
    <div
      style={{
        display: `flex`,
        alignItems: `center`,
        gap: `8px`,
        padding: `8px 14px`,
        backgroundColor: `var(--colors-surface-secondary)`,
        borderRadius: `var(--borders-radius-medium)`,
        border: `1px solid var(--colors-border-default)`,
        cursor: `pointer`,
      }}
    >
      <span style={{ fontSize: `18px` }}>{flag}</span>
      <span style={{ fontSize: `13px`, fontWeight: `500`, color: `var(--colors-text-primary)` }}>{label}</span>
    </div>
  );
}

// ─── Item Datasets ────────────────────────────────────────────────────────────

const userMenuItems: DropdownItem[] = [
  { key: `profile`, label: `View Profile`, icon: <UserIcon />, variant: `default` },
  { key: `settings`, label: `Settings`, icon: <SettingsIcon />, variant: `default` },
  { key: `divider-1`, label: ``, divider: true },
  { key: `logout`, label: `Sign Out`, icon: <LogoutIcon />, variant: `danger` },
];

const routeActionItems: DropdownItem[] = [
  { key: `view`, label: `View Route`, icon: <RouteIcon />, variant: `default` },
  { key: `edit`, label: `Edit Route`, icon: <EditIcon />, variant: `default` },
  { key: `flag`, label: `Flag for Review`, icon: <FlagIcon />, variant: `default` },
  { key: `divider-1`, label: ``, divider: true },
  { key: `delete`, label: `Delete Route`, icon: <TrashIcon />, variant: `danger` },
];

const countryItems: DropdownItem[] = [
  { key: `it`, label: `🇮🇹  Italy`, variant: `default` },
  { key: `es`, label: `🇪🇸  Spain`, variant: `default` },
  { key: `de`, label: `🇩🇪  Germany`, variant: `default` },
  { key: `fr`, label: `🇫🇷  France`, variant: `default` },
  { key: `si`, label: `🇸🇮  Slovenia`, variant: `default` },
  { key: `cz`, label: `🇨🇿  Czechia`, variant: `default` },
  { key: `sk`, label: `🇸🇰  Slovakia`, variant: `default` },
  { key: `hr`, label: `🇭🇷  Croatia`, variant: `default` },
];

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * UserMenu — dropdown used in the top navigation bar for account actions.
 */
export const UserMenuDropdown = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `var(--colors-surface-background)`,
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
          justifyContent: `center`,
          gap: `48px`,
          padding: `48px 32px`,
        }}
      >
        <div style={{ textAlign: `center`, marginBottom: `8px` }}>
          <p
            style={{
              margin: `0 0 6px`,
              fontSize: `11px`,
              fontWeight: `700`,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `var(--colors-primary-default)`,
            }}
          >
            User Menu
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: `22px`,
              fontWeight: `800`,
              color: `var(--colors-text-primary)`,
              letterSpacing: `-0.02em`,
            }}
          >
            Account Dropdown
          </h2>
          <p style={{ margin: `8px 0 0`, fontSize: `14px`, color: `var(--colors-text-secondary)` }}>
            Click the trigger below to open the menu
          </p>
        </div>

        <Dropdown
          trigger={<UserTrigger />}
          items={userMenuItems}
          showChevron
          align="left"
        />
      </div>
    </MockProvider>
  );
};

/**
 * RouteActionMenu — contextual actions for a race route entry.
 */
export const RouteActionDropdown = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `var(--colors-surface-background)`,
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
          justifyContent: `center`,
          gap: `32px`,
          padding: `48px 32px`,
        }}
      >
        <div style={{ textAlign: `center` }}>
          <p
            style={{
              margin: `0 0 6px`,
              fontSize: `11px`,
              fontWeight: `700`,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `var(--colors-primary-default)`,
            }}
          >
            Route Actions
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: `22px`,
              fontWeight: `800`,
              color: `var(--colors-text-primary)`,
              letterSpacing: `-0.02em`,
            }}
          >
            Contextual Action Menu
          </h2>
        </div>

        <div
          style={{
            backgroundColor: `var(--colors-surface-primary)`,
            borderRadius: `var(--borders-radius-large)`,
            padding: `20px 24px`,
            border: `1px solid var(--colors-border-default)`,
            boxShadow: `var(--effects-shadows-medium)`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `space-between`,
            gap: `32px`,
            minWidth: `360px`,
          }}
        >
          <div>
            <div style={{ fontSize: `13px`, fontWeight: `700`, color: `var(--colors-text-primary)`, marginBottom: `4px` }}>
              Stelvio Pass — Stage 3
            </div>
            <div style={{ fontSize: `12px`, color: `var(--colors-text-muted)` }}>
              🇮🇹 Italy · 48 km · 2,758 m elevation
            </div>
          </div>
          <Dropdown
            trigger={
              <div
                style={{
                  display: `flex`,
                  alignItems: `center`,
                  justifyContent: `center`,
                  width: `34px`,
                  height: `34px`,
                  borderRadius: `var(--borders-radius-medium)`,
                  backgroundColor: `var(--colors-surface-secondary)`,
                  border: `1px solid var(--colors-border-default)`,
                  color: `var(--colors-text-secondary)`,
                  cursor: `pointer`,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="3" r="1.2" fill="currentColor" />
                  <circle cx="8" cy="8" r="1.2" fill="currentColor" />
                  <circle cx="8" cy="13" r="1.2" fill="currentColor" />
                </svg>
              </div>
            }
            items={routeActionItems}
            showChevron={false}
            align="right"
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * CountrySelector — dropdown for selecting a country/region filter.
 */
export const CountrySelectorDropdown = () => {
  const [selected, setSelected] = React.useState(`🇮🇹  Italy`);

  const itemsWithCallback: DropdownItem[] = countryItems.map((item) => ({
    ...item,
    onClick: () => setSelected(item.label),
  }));

  const flagChar = selected.split(`\u00a0`)[0].trim();

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `var(--colors-surface-background)`,
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
          justifyContent: `center`,
          gap: `32px`,
          padding: `48px 32px`,
        }}
      >
        <div style={{ textAlign: `center` }}>
          <p
            style={{
              margin: `0 0 6px`,
              fontSize: `11px`,
              fontWeight: `700`,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `var(--colors-primary-default)`,
            }}
          >
            Country Selector
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: `22px`,
              fontWeight: `800`,
              color: `var(--colors-text-primary)`,
              letterSpacing: `-0.02em`,
            }}
          >
            Filter by Country
          </h2>
          <p style={{ margin: `8px 0 0`, fontSize: `14px`, color: `var(--colors-text-secondary)` }}>
            Selected: <strong style={{ color: `var(--colors-primary-default)` }}>{selected}</strong>
          </p>
        </div>

        <Dropdown
          trigger={<CountryTrigger label={selected} flag={flagChar} />}
          items={itemsWithCallback}
          showChevron
          align="center"
        />
      </div>
    </MockProvider>
  );
};
