import * as React from 'react';
import classNames from 'classnames';
import { NavInstruction } from '@markec/navigation.entities.nav-instruction';
import { Speedometer } from '@markec/mototrack-design.hud.speedometer';
import { Compass } from '@markec/mototrack-design.hud.compass';
import { GpsQualityIndicator } from '@markec/mototrack-design.hud.gps-quality-indicator';
import { FuelGauge } from '@markec/mototrack-design.hud.fuel-gauge';
import { TurnBanner } from '@markec/navigation.ui.turn-banner';
import type { DrivingModeHudData } from './driving-mode-hud-data-type.js';
import styles from './driving-mode-hud.module.scss';

// ─── Icons ────────────────────────────────────────────────────────────────────

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
      <line x1={9} y1={3} x2={9} y2={18} />
      <line x1={15} y1={6} x2={15} y2={21} />
    </svg>
  );
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_DATA: DrivingModeHudData = {
  speed: 87,
  heading: 47,
  streetName: `Avtocesta A1`,
  eta: `14:32`,
  distanceToDestinationKm: 38.4,
  currentFuelLiters: 14.2,
  tankCapacityLiters: 18,
  fuelRangeKm: 218,
  gpsAccuracyMeters: 7,
  nextInstruction: NavInstruction.from({
    id: `default-instr`,
    text: `Zavijte desno`,
    distanceM: 1200,
    modifier: `turn-right`,
    announceAt: 300,
  }),
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type FontScale = `1x` | `1.5x` | `2x`;

export type DrivingModeHudProps = {
  /**
   * All live driving data displayed in the HUD.
   */
  data?: DrivingModeHudData;

  /**
   * Font scale multiplier for accessibility.
   * - 1x: default
   * - 1.5x: larger text
   * - 2x: maximum accessibility size
   */
  fontScale?: FontScale;

  /**
   * Speed warning threshold in km/h. Above this the speedometer turns amber, 1.4× turns red.
   */
  warningThreshold?: number;

  /**
   * Whether voice guidance is enabled on the turn banner.
   */
  voiceEnabled?: boolean;

  /**
   * Called when the user taps the exit button to return to the map.
   */
  onExit?: () => void;

  /**
   * Called when voice guidance is toggled.
   */
  onVoiceToggle?: (enabled: boolean) => void;

  /**
   * Whether a Bluetooth helmet is connected.
   */
  btConnected?: boolean;

  /**
   * Name of the connected BT device.
   */
  btDeviceName?: string;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

// ─── Scale class map ──────────────────────────────────────────────────────────

const SCALE_CLASS: Record<FontScale, string> = {
  '1x': styles.scale1x,
  '1.5x': styles.scale15x,
  '2x': styles.scale2x,
};

// ─── Component ────────────────────────────────────────────────────────────────

export function DrivingModeHud({
  data = DEFAULT_DATA,
  fontScale = `1x`,
  warningThreshold = 120,
  voiceEnabled = true,
  onExit,
  onVoiceToggle,
  btConnected = false,
  btDeviceName = ``,
  className,
  style,
}: DrivingModeHudProps) {
  const scaleClass = SCALE_CLASS[fontScale];

  const compassSize = fontScale === `2x` ? 180 : fontScale === `1.5x` ? 160 : 140;

  return (
    <div
      className={classNames(styles.hud, scaleClass, className)}
      style={style}
      role="main"
      aria-label="Driving mode HUD"
    >
      {/* Ambient background glow */}
      <div className={styles.ambientGlow} />

      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <div className={styles.liveBadge}>
            <span className={styles.liveDot} />
            <span className={styles.liveLabel}>Live</span>
          </div>

          <div className={styles.gpsRow}>
            <GpsQualityIndicator
              accuracyMeters={data.gpsAccuracyMeters}
              size={10}
              showTooltip={false}
            />
            <span className={styles.gpsLabel}>GPS</span>
          </div>
        </div>

        <div className={styles.topBarRight}>
          <div className={styles.etaBlock}>
            <span className={styles.etaLabel}>ETA</span>
            <span className={styles.etaValue}>{data.eta}</span>
            <span className={styles.distanceValue}>{data.distanceToDestinationKm.toFixed(1)} km</span>
          </div>

          <div className={styles.divider} />

          <button
            type="button"
            className={styles.exitButton}
            onClick={() => onExit?.()}
            aria-label="Exit driving mode and return to map"
          >
            <span className={styles.exitIcon}>
              <MapIcon />
            </span>
            <span className={styles.exitLabel}>Map</span>
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className={styles.mainContent}>
        {/* Middle row: Compass | Speedometer | Side panel */}
        <div className={styles.middleRow}>
          {/* Compass */}
          <div className={styles.compassSection}>
            <Compass
              heading={data.heading}
              size={compassSize}
              showDegrees
              showSource={false}
            />
            <span className={styles.compassLabel}>Heading</span>
          </div>

          {/* Speedometer */}
          <div className={styles.speedometerSection}>
            <Speedometer
              speed={data.speed}
              size="driving-mode"
              warningThreshold={warningThreshold}
              showUnit
            />
          </div>

          {/* Side panel: stat cards */}
          <div className={styles.sidePanel}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Speed</span>
              <span className={styles.statValue}>
                {Math.round(data.speed)}
                <span className={styles.statUnit}> km/h</span>
              </span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Arrives</span>
              <span className={styles.statValue}>{data.eta}</span>
              <span className={styles.distanceValue}>{data.distanceToDestinationKm.toFixed(1)} km left</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Fuel range</span>
              <span className={styles.statValue}>
                {data.fuelRangeKm}
                <span className={styles.statUnit}> km</span>
              </span>
            </div>
          </div>
        </div>

        {/* Street name */}
        <div className={styles.speedSection}>
          <div className={styles.streetNameRow}>
            <span className={styles.streetDot} />
            <span className={styles.streetName}>{data.streetName}</span>
          </div>
        </div>

        {/* Turn banner */}
        {data.nextInstruction && (
          <div className={styles.turnSection}>
            <TurnBanner
              instruction={data.nextInstruction}
              streetName={data.streetName}
              voiceEnabled={voiceEnabled}
              onVoiceToggle={onVoiceToggle}
              btConnected={btConnected}
              btDeviceName={btDeviceName}
            />
          </div>
        )}
      </div>

      {/* ── Bottom bar: Fuel gauge + font scale badge ── */}
      <div className={styles.bottomBar}>
        <div className={styles.fuelSection}>
          <FuelGauge
            currentLiters={data.currentFuelLiters}
            tankCapacity={data.tankCapacityLiters}
            estimatedRange={data.fuelRangeKm}
            barHeight={10}
          />
        </div>

        <div className={styles.fontScaleBadge}>
          <span className={styles.fontScaleLabel}>Scale</span>
          <span className={styles.fontScaleValue}>{fontScale}</span>
        </div>
      </div>
    </div>
  );
}
