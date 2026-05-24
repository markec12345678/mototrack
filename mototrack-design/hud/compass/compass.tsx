import React, { useEffect, useRef, useState, useCallback } from 'react';
import classNames from 'classnames';
import styles from './compass.module.scss';

export type CompassSource = 'deviceorientation' | 'gps' | 'manual';

export type CompassProps = {
  /**
   * Heading in degrees (0–359). Used when source is 'manual' or as GPS-derived bearing fallback.
   */
  heading?: number;

  /**
   * GPS-derived bearing in degrees (0–359). Used as fallback when DeviceOrientation API is unavailable.
   */
  gpsBearing?: number;

  /**
   * Size of the compass in pixels.
   */
  size?: number;

  /**
   * Show the degree value label inside the compass.
   */
  showDegrees?: boolean;

  /**
   * Show the active data source badge.
   */
  showSource?: boolean;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;

  /**
   * Callback fired when the heading changes.
   */
  onHeadingChange?: (heading: number, source: CompassSource) => void;
};

const CARDINALS = [
  { label: 'N', angle: 0 },
  { label: 'NE', angle: 45 },
  { label: 'E', angle: 90 },
  { label: 'SE', angle: 135 },
  { label: 'S', angle: 180 },
  { label: 'SW', angle: 225 },
  { label: 'W', angle: 270 },
  { label: 'NW', angle: 315 },
];

const TICK_COUNT = 72; // every 5°

function getCardinalLabel(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  if (normalized < 22.5 || normalized >= 337.5) return 'N';
  if (normalized < 67.5) return 'NE';
  if (normalized < 112.5) return 'E';
  if (normalized < 157.5) return 'SE';
  if (normalized < 202.5) return 'S';
  if (normalized < 247.5) return 'SW';
  if (normalized < 292.5) return 'W';
  return 'NW';
}

function lerpAngle(from: number, to: number, t: number): number {
  let diff = ((to - from + 540) % 360) - 180;
  return from + diff * t;
}

export function Compass({
  heading: manualHeading,
  gpsBearing,
  size = 220,
  showDegrees = true,
  showSource = true,
  className,
  style,
  onHeadingChange,
}: CompassProps) {
  const [displayAngle, setDisplayAngle] = useState<number>(0);
  const [rawHeading, setRawHeading] = useState<number>(0);
  const [source, setSource] = useState<CompassSource>('manual');
  const [supported, setSupported] = useState<boolean>(true);

  const animFrameRef = useRef<number | null>(null);
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);

  // Smooth animation loop
  const animate = useCallback(() => {
    const current = currentAngleRef.current;
    const target = targetAngleRef.current;
    const next = lerpAngle(current, target, 0.12);
    currentAngleRef.current = next;
    setDisplayAngle(next);
    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [animate]);

  // DeviceOrientation API
  useEffect(() => {
    if (manualHeading !== undefined) return;

    if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
      setSupported(false);
      return;
    }

    let active = true;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!active) return;

      // webkitCompassHeading is available on iOS
      const ios = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
      let heading: number | null = null;

      if (ios !== undefined && ios !== null) {
        heading = ios;
      } else if (event.alpha !== null) {
        // Android: alpha is the compass bearing (0 = north, increases clockwise)
        heading = (360 - event.alpha) % 360;
      }

      if (heading !== null) {
        const h = ((heading % 360) + 360) % 360;
        setRawHeading(h);
        targetAngleRef.current = h;
        setSource('deviceorientation');
        onHeadingChange?.(h, 'deviceorientation');
      } else if (gpsBearing !== undefined) {
        const h = ((gpsBearing % 360) + 360) % 360;
        setRawHeading(h);
        targetAngleRef.current = h;
        setSource('gps');
        onHeadingChange?.(h, 'gps');
      } else {
        setSupported(false);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    // Fallback to GPS after 2s if no orientation event fires
    const fallbackTimer = setTimeout(() => {
      if (source === 'manual' && gpsBearing !== undefined) {
        const h = ((gpsBearing % 360) + 360) % 360;
        setRawHeading(h);
        targetAngleRef.current = h;
        setSource('gps');
        onHeadingChange?.(h, 'gps');
      }
    }, 2000);

    return () => {
      active = false;
      window.removeEventListener('deviceorientation', handleOrientation, true);
      clearTimeout(fallbackTimer);
    };
  }, [manualHeading, gpsBearing, onHeadingChange, source]);

  // GPS bearing fallback
  useEffect(() => {
    if (manualHeading !== undefined) return;
    if (source === 'deviceorientation') return;
    if (gpsBearing === undefined) return;

    const h = ((gpsBearing % 360) + 360) % 360;
    setRawHeading(h);
    targetAngleRef.current = h;
    setSource('gps');
    onHeadingChange?.(h, 'gps');
  }, [gpsBearing, source, manualHeading, onHeadingChange]);

  // Manual heading override
  useEffect(() => {
    if (manualHeading === undefined) return;
    const h = ((manualHeading % 360) + 360) % 360;
    setRawHeading(h);
    targetAngleRef.current = h;
    setSource('manual');
    onHeadingChange?.(h, 'manual');
  }, [manualHeading, onHeadingChange]);

  const cardinal = getCardinalLabel(rawHeading);
  const deg = Math.round(((rawHeading % 360) + 360) % 360);

  const sourceLabel: Record<CompassSource, string> = {
    deviceorientation: 'GYRO',
    gps: 'GPS',
    manual: 'MANUAL',
  };

  const sourceClass: Record<CompassSource, string> = {
    deviceorientation: styles.sourceGyro,
    gps: styles.sourceGps,
    manual: styles.sourceManual,
  };

  const center = size / 2;
  const outerR = center - 4;
  const innerR = outerR - 14;
  const tickOuterR = outerR - 2;

  return (
    <div
      className={classNames(styles.compass, className)}
      style={{ width: size, height: size, ...style }}
      role="img"
      aria-label={`Compass heading ${deg} degrees ${cardinal}`}
    >
      {/* Outer glow ring */}
      <div className={styles.glowRing} style={{ width: size, height: size }} />

      {/* SVG compass rose */}
      <svg
        className={styles.svg}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle cx={center} cy={center} r={outerR} className={styles.bgCircle} />

        {/* Rotating ring with ticks and cardinal labels */}
        <g
          className={styles.rotatingRing}
          style={{ transform: `rotate(${-displayAngle}deg)`, transformOrigin: `${center}px ${center}px` }}
        >
          {/* Tick marks */}
          {Array.from({ length: TICK_COUNT }, (_, i) => {
            const angle = (i * 360) / TICK_COUNT;
            const rad = (angle * Math.PI) / 180;
            const isMajor = i % 18 === 0; // every 90°
            const isMinor = i % 6 === 0;  // every 30°
            const tickLen = isMajor ? 14 : isMinor ? 9 : 5;
            const r1 = tickOuterR;
            const r2 = tickOuterR - tickLen;
            const x1 = center + r1 * Math.sin(rad);
            const y1 = center - r1 * Math.cos(rad);
            const x2 = center + r2 * Math.sin(rad);
            const y2 = center - r2 * Math.cos(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={classNames(styles.tick, {
                  [styles.tickMajor]: isMajor,
                  [styles.tickMinor]: isMinor && !isMajor,
                })}
              />
            );
          })}

          {/* Cardinal and intercardinal labels */}
          {CARDINALS.map(({ label, angle }) => {
            const rad = (angle * Math.PI) / 180;
            const labelR = innerR - 6;
            const x = center + labelR * Math.sin(rad);
            const y = center - labelR * Math.cos(rad);
            const isCardinal = label.length === 1;
            const isNorth = label === 'N';
            return (
              <text
                key={label}
                x={x}
                y={y}
                className={classNames(styles.cardinalLabel, {
                  [styles.cardinalLabelPrimary]: isCardinal,
                  [styles.cardinalLabelNorth]: isNorth,
                  [styles.cardinalLabelSecondary]: !isCardinal,
                })}
                dominantBaseline="central"
                textAnchor="middle"
              >
                {label}
              </text>
            );
          })}

          {/* Degree markers every 30° */}
          {[30, 60, 120, 150, 210, 240, 300, 330].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const labelR = innerR - 6;
            const x = center + labelR * Math.sin(rad);
            const y = center - labelR * Math.cos(rad);
            return (
              <text
                key={angle}
                x={x}
                y={y}
                className={styles.degreeMarker}
                dominantBaseline="central"
                textAnchor="middle"
              >
                {angle}
              </text>
            );
          })}
        </g>

        {/* Inner circle */}
        <circle cx={center} cy={center} r={innerR - 22} className={styles.innerCircle} />

        {/* North indicator needle */}
        <g className={styles.needle}>
          {/* Red north tip */}
          <polygon
            points={`${center},${center - innerR + 36} ${center - 7},${center + 4} ${center + 7},${center + 4}`}
            className={styles.needleNorth}
          />
          {/* South tip */}
          <polygon
            points={`${center},${center + innerR - 36} ${center - 7},${center - 4} ${center + 7},${center - 4}`}
            className={styles.needleSouth}
          />
          {/* Center dot */}
          <circle cx={center} cy={center} r={5} className={styles.needleCenter} />
        </g>

        {/* Fixed top indicator triangle */}
        <polygon
          points={`${center},${center - outerR + 1} ${center - 6},${center - outerR + 11} ${center + 6},${center - outerR + 11}`}
          className={styles.topIndicator}
        />
      </svg>

      {/* Center readout */}
      <div className={styles.readout}>
        {showDegrees && (
          <div className={styles.degreesRow}>
            <span className={styles.degreesValue}>{deg}</span>
            <span className={styles.degreesSymbol}>°</span>
          </div>
        )}
        <div className={styles.cardinalBig}>{cardinal}</div>
      </div>

      {/* Source badge */}
      {showSource && (
        <div className={classNames(styles.sourceBadge, sourceClass[source])}>
          <span className={styles.sourceDot} />
          {sourceLabel[source]}
        </div>
      )}

      {/* Unsupported warning */}
      {!supported && source === 'manual' && manualHeading === undefined && (
        <div className={styles.unsupportedBadge}>NO SENSOR</div>
      )}
    </div>
  );
}
