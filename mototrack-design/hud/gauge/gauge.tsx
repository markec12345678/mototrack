import React, { useMemo } from 'react';
import classNames from 'classnames';
import styles from './gauge.module.scss';

export type ColorZone = {
  /**
   * Start value of the color zone (inclusive).
   */
  from: number;
  /**
   * End value of the color zone (inclusive).
   */
  to: number;
  /**
   * Color of the zone: 'green' | 'yellow' | 'red' | a CSS color string.
   */
  color: 'green' | 'yellow' | 'red' | string;
};

export type GaugeProps = {
  /**
   * Current value to display on the gauge.
   */
  value?: number;
  /**
   * Minimum value of the gauge range.
   */
  min?: number;
  /**
   * Maximum value of the gauge range.
   */
  max?: number;
  /**
   * Label displayed below the value (e.g. "Lean Angle").
   */
  label?: string;
  /**
   * Unit string appended to the value (e.g. "°", "m", "%").
   */
  unit?: string;
  /**
   * Color zones that paint arcs on the gauge track.
   */
  zones?: ColorZone[];
  /**
   * Diameter of the gauge in pixels.
   */
  size?: number;
  /**
   * Additional class name.
   */
  className?: string;
  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

const ZONE_COLOR_MAP: Record<string, string> = {
  green: 'var(--colors-status-success-default)',
  yellow: 'var(--colors-status-warning-default)',
  red: 'var(--colors-status-danger-default)',
};

const DEFAULT_ZONES: ColorZone[] = [
  { from: 0, to: 40, color: 'green' },
  { from: 40, to: 70, color: 'yellow' },
  { from: 70, to: 100, color: 'red' },
];

/** Arc spans from -225° to 45° (270° sweep), starting bottom-left going clockwise. */
const START_ANGLE_DEG = -225;
const SWEEP_DEG = 270;

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = degToRad(angleDeg);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function resolveZoneColor(color: string): string {
  return ZONE_COLOR_MAP[color] ?? color;
}

function valueToAngle(value: number, min: number, max: number): number {
  const clamped = Math.min(Math.max(value, min), max);
  const ratio = (clamped - min) / (max - min);
  return START_ANGLE_DEG + ratio * SWEEP_DEG;
}

export function Gauge({
  value = 45,
  min = 0,
  max = 100,
  label = `Lean Angle`,
  unit = `°`,
  zones = DEFAULT_ZONES,
  size = 200,
  className,
  style,
}: GaugeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = size * 0.075;
  const trackRadius = (size - strokeWidth * 2) / 2 - strokeWidth * 0.5;
  const needleLength = trackRadius * 0.72;
  const needleBaseWidth = size * 0.025;

  const clampedValue = Math.min(Math.max(value, min), max);
  const needleAngle = valueToAngle(clampedValue, min, max);

  const zoneArcs = useMemo(() => {
    return zones.map((zone) => {
      const fromClamped = Math.min(Math.max(zone.from, min), max);
      const toClamped = Math.min(Math.max(zone.to, min), max);
      const startDeg = valueToAngle(fromClamped, min, max);
      const endDeg = valueToAngle(toClamped, min, max);
      return {
        path: describeArc(cx, cy, trackRadius, startDeg, endDeg),
        color: resolveZoneColor(zone.color),
        key: `${zone.from}-${zone.to}-${zone.color}`,
      };
    });
  }, [zones, min, max, cx, cy, trackRadius]);

  const trackPath = describeArc(cx, cy, trackRadius, START_ANGLE_DEG, START_ANGLE_DEG + SWEEP_DEG);

  // Needle tip point
  const needleTip = polarToCartesian(cx, cy, needleLength, needleAngle);
  // Needle base — two points perpendicular to needle direction
  const perpAngle1 = needleAngle + 90;
  const perpAngle2 = needleAngle - 90;
  const base1 = polarToCartesian(cx, cy, needleBaseWidth, perpAngle1);
  const base2 = polarToCartesian(cx, cy, needleBaseWidth, perpAngle2);
  const needlePath = `M ${base1.x} ${base1.y} L ${needleTip.x} ${needleTip.y} L ${base2.x} ${base2.y} Z`;

  // Tick marks
  const tickCount = 9;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const ratio = i / (tickCount - 1);
    const angleDeg = START_ANGLE_DEG + ratio * SWEEP_DEG;
    const outerR = trackRadius + strokeWidth * 0.6;
    const innerR = trackRadius - strokeWidth * 0.6;
    const outer = polarToCartesian(cx, cy, outerR, angleDeg);
    const inner = polarToCartesian(cx, cy, innerR, angleDeg);
    const tickValue = min + ratio * (max - min);
    const labelR = trackRadius - strokeWidth * 1.6;
    const labelPos = polarToCartesian(cx, cy, labelR, angleDeg);
    return { outer, inner, labelPos, tickValue, key: i };
  });

  const displayValue = Number.isFinite(clampedValue)
    ? Math.round(clampedValue * 10) / 10
    : 0;

  // Determine active zone color for value glow
  const activeZone = zones.find(
    (z) => clampedValue >= z.from && clampedValue <= z.to
  );
  const activeColor = activeZone ? resolveZoneColor(activeZone.color) : `var(--colors-primary-default)`;

  const fontSize = {
    value: size * 0.18,
    unit: size * 0.09,
    label: size * 0.075,
    tick: size * 0.055,
  };

  return (
    <div
      className={classNames(styles.gauge, className)}
      style={{ width: size, height: size, ...style }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={`${label}: ${displayValue}${unit}`}
        className={styles.svg}
      >
        {/* Definitions */}
        <defs>
          <filter id={`glow-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={`bg-grad-${label}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(30,41,59,0.9)" />
            <stop offset="100%" stopColor="rgba(2,6,23,0.95)" />
          </radialGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={cx}
          cy={cy}
          r={size / 2 - 2}
          fill={`url(#bg-grad-${label})`}
          stroke="rgba(148,163,184,0.12)"
          strokeWidth="1"
        />

        {/* Track background */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(148,163,184,0.1)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Zone arcs */}
        {zoneArcs.map((arc) => (
          <path
            key={arc.key}
            d={arc.path}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            opacity="0.75"
          />
        ))}

        {/* Active zone glow arc (just the portion up to current value) */}
        <path
          d={describeArc(cx, cy, trackRadius, START_ANGLE_DEG, needleAngle)}
          fill="none"
          stroke={activeColor}
          strokeWidth={strokeWidth * 0.35}
          strokeLinecap="round"
          filter={`url(#glow-${label})`}
          opacity="0.9"
        />

        {/* Tick marks */}
        {ticks.map((tick) => (
          <g key={tick.key}>
            <line
              x1={tick.inner.x}
              y1={tick.inner.y}
              x2={tick.outer.x}
              y2={tick.outer.y}
              stroke="rgba(148,163,184,0.4)"
              strokeWidth={size * 0.008}
              strokeLinecap="round"
            />
            <text
              x={tick.labelPos.x}
              y={tick.labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={fontSize.tick}
              fill="rgba(148,163,184,0.55)"
              fontFamily="var(--typography-font-family)"
              fontWeight="500"
            >
              {Math.round(tick.tickValue)}
            </text>
          </g>
        ))}

        {/* Needle shadow */}
        <path
          d={needlePath}
          fill="rgba(0,0,0,0.5)"
          transform={`translate(2, 2)`}
          opacity="0.5"
        />

        {/* Needle */}
        <path
          d={needlePath}
          fill={activeColor}
          filter={`url(#glow-${label})`}
          className={styles.needle}
        />

        {/* Center hub */}
        <circle
          cx={cx}
          cy={cy}
          r={size * 0.055}
          fill="var(--colors-surface-secondary)"
          stroke={activeColor}
          strokeWidth={size * 0.012}
        />
        <circle
          cx={cx}
          cy={cy}
          r={size * 0.022}
          fill={activeColor}
        />

        {/* Value text */}
        <text
          x={cx}
          y={cy + size * 0.14}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize.value}
          fontWeight="800"
          fontFamily="var(--typography-font-family)"
          fill="var(--colors-text-primary)"
          letterSpacing="-0.03em"
        >
          {displayValue}
          <tspan
            fontSize={fontSize.unit}
            fontWeight="600"
            fill="var(--colors-text-secondary)"
            dy={-fontSize.value * 0.15}
          >
            {unit}
          </tspan>
        </text>

        {/* Label text */}
        <text
          x={cx}
          y={cy + size * 0.27}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize.label}
          fontWeight="600"
          fontFamily="var(--typography-font-family)"
          fill="var(--colors-text-muted)"
          letterSpacing="0.08em"
        >
          {label.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}
