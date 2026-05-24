import React from 'react';
import { Icon, type IconSize } from '@markec/mototrack-design.content.icon';

export type MototrackIconProps = {
  /**
   * Size of the icon.
   * @default 'md'
   */
  size?: IconSize;

  /**
   * Color override. Accepts any valid CSS color value.
   * Defaults to currentColor.
   */
  color?: string;

  /**
   * Additional CSS class name.
   */
  className?: string;

  /**
   * Inline style overrides.
   */
  style?: React.CSSProperties;

  /**
   * Click handler.
   */
  onClick?: () => void;
};

// ─── SVG glyphs ──────────────────────────────────────────────────────────────

function MenuGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LogoutGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 17l5-5-5-5M15 12H3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function BellGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Named Icon Exports ───────────────────────────────────────────────────────

/**
 * MapIcon — 🗺️ — represents the live map / route view.
 */
export function MapIcon({ size = `md`, color, className, style, onClick }: MototrackIconProps) {
  return (
    <Icon size={size} color={color} glyph="🗺️" label="Map" className={className} style={style} onClick={onClick} />
  );
}

/**
 * PlanIcon — 🛤️ — represents route planning.
 */
export function PlanIcon({ size = `md`, color, className, style, onClick }: MototrackIconProps) {
  return (
    <Icon size={size} color={color} glyph="🛤️" label="Plan" className={className} style={style} onClick={onClick} />
  );
}

/**
 * TrackIcon — ▶️ — represents tracking / recording a ride.
 */
export function TrackIcon({ size = `md`, color, className, style, onClick }: MototrackIconProps) {
  return (
    <Icon size={size} color={color} glyph="▶️" label="Track" className={className} style={style} onClick={onClick} />
  );
}

/**
 * ExploreIcon — 🧭 — represents route discovery and exploration.
 */
export function ExploreIcon({ size = `md`, color, className, style, onClick }: MototrackIconProps) {
  return (
    <Icon size={size} color={color} glyph="🧭" label="Explore" className={className} style={style} onClick={onClick} />
  );
}

/**
 * ProfileIcon — 👤 — represents the user profile section.
 */
export function ProfileIcon({ size = `md`, color, className, style, onClick }: MototrackIconProps) {
  return (
    <Icon size={size} color={color} glyph="👤" label="Profile" className={className} style={style} onClick={onClick} />
  );
}

/**
 * SosIcon — 🚨 — represents emergency / SOS alert.
 */
export function SosIcon({ size = `md`, color, className, style, onClick }: MototrackIconProps) {
  return (
    <Icon size={size} color={color} glyph="🚨" label="SOS" className={className} style={style} onClick={onClick} />
  );
}

/**
 * ChatIcon — 💬 — represents the community chat / messaging.
 */
export function ChatIcon({ size = `md`, color, className, style, onClick }: MototrackIconProps) {
  return (
    <Icon size={size} color={color} glyph="💬" label="Chat" className={className} style={style} onClick={onClick} />
  );
}

/**
 * MenuIcon — hamburger menu for navigation drawers.
 */
export function MenuIcon({ size = `md`, color, className, style, onClick }: MototrackIconProps) {
  return (
    <Icon size={size} color={color} label="Menu" className={className} style={style} onClick={onClick}>
      <MenuGlyph />
    </Icon>
  );
}

/**
 * LogoutIcon — arrow-out-of-box for signing out.
 */
export function LogoutIcon({ size = `md`, color, className, style, onClick }: MototrackIconProps) {
  return (
    <Icon size={size} color={color} label="Logout" className={className} style={style} onClick={onClick}>
      <LogoutGlyph />
    </Icon>
  );
}

/**
 * SettingsIcon — gear wheel for application settings.
 */
export function SettingsIcon({ size = `md`, color, className, style, onClick }: MototrackIconProps) {
  return (
    <Icon size={size} color={color} label="Settings" className={className} style={style} onClick={onClick}>
      <SettingsGlyph />
    </Icon>
  );
}

/**
 * BellIcon — notification bell.
 */
export function BellIcon({ size = `md`, color, className, style, onClick }: MototrackIconProps) {
  return (
    <Icon size={size} color={color} label="Notifications" className={className} style={style} onClick={onClick}>
      <BellGlyph />
    </Icon>
  );
}
