import React, { useMemo } from 'react';
import classNames from 'classnames';
import type { Direction } from './round-trip-config.js';
import styles from './route-preview.module.scss';

export type RoutePreviewProps = {
  distance: number;
  twistiness: number;
  direction: Direction;
  className?: string;
};

/**
 * Mini SVG preview of a circular/twisty round-trip route.
 * The path morphs based on twistiness and direction.
 */
export function RoutePreview({ distance, twistiness, direction, className }: RoutePreviewProps) {
  const path = useMemo(
    () => buildRoutePath(twistiness, direction),
    [twistiness, direction]
  );

  const distanceLabel = `${distance} km`;
  const twistLabel = twistiness < 33 ? `Scenic` : twistiness < 66 ? `Twisty` : `Extreme`;

  return (
    <div className={classNames(styles.previewContainer, className)}>
      <svg
        viewBox="0 0 200 160"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
        aria-label="Round trip route preview"
        role="img"
      >
        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowStrong" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>

        {/* Background grid dots */}
        {buildGridDots().map((dot) => (
          <circle
            key={dot.key}
            cx={dot.cx}
            cy={dot.cy}
            r="0.8"
            fill="rgba(148,163,184,0.2)"
          />
        ))}

        {/* Shadow path */}
        <path
          d={path}
          fill="none"
          stroke="rgba(249,115,22,0.15)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Main route path */}
        <path
          d={path}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          className={styles.routePath}
        />

        {/* Direction arrow */}
        <DirectionArrow direction={direction} twistiness={twistiness} />

        {/* Start/End marker */}
        <circle cx="100" cy="140" r="5" fill="#f97316" filter="url(#glowStrong)" />
        <circle cx="100" cy="140" r="3" fill="#fff" />

        {/* Distance label */}
        <text
          x="100"
          y="18"
          textAnchor="middle"
          fill="#f97316"
          fontSize="10"
          fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="0.05em"
        >
          {distanceLabel}
        </text>

        {/* Twistiness label */}
        <text
          x="100"
          y="30"
          textAnchor="middle"
          fill="rgba(148,163,184,0.7)"
          fontSize="7.5"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="0.08em"
        >
          {twistLabel.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildGridDots(): { key: string; cx: number; cy: number }[] {
  const dots: { key: string; cx: number; cy: number }[] = [];
  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < 8; row++) {
      dots.push({ key: `${col}-${row}`, cx: col * 22 + 11, cy: row * 20 + 10 });
    }
  }
  return dots;
}

function buildRoutePath(twistiness: number, direction: Direction): string {
  const cx = 100;
  const cy = 90;
  const rx = 62;
  const ry = 48;

  if (twistiness < 20) {
    // Near-perfect ellipse
    const sweep = direction === `clockwise` ? 1 : 0;
    return [
      `M ${cx} ${cy + ry}`,
      `A ${rx} ${ry} 0 1 ${sweep} ${cx - 0.01} ${cy + ry}`,
      `Z`,
    ].join(` `);
  }

  // Build a polygon of control points around the ellipse, then add wobble
  const numPoints = 8 + Math.floor(twistiness / 15);
  const wobbleScale = (twistiness / 100) * 22;
  const points: [number, number][] = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
    const wobble = seededRandom(i, twistiness) * wobbleScale - wobbleScale / 2;
    const r = 1 + wobble / Math.max(rx, ry);
    const px = cx + rx * r * Math.cos(angle);
    const py = cy + ry * r * Math.sin(angle);
    points.push([px, py]);
  }

  if (direction === `counterclockwise`) {
    points.reverse();
  }

  // Close the loop
  const allPoints = [...points, points[0]];

  let d = `M ${allPoints[0][0].toFixed(1)} ${allPoints[0][1].toFixed(1)}`;
  for (let i = 1; i < allPoints.length; i++) {
    const prev = allPoints[i - 1];
    const curr = allPoints[i];
    const mx = ((prev[0] + curr[0]) / 2).toFixed(1);
    const my = ((prev[1] + curr[1]) / 2).toFixed(1);
    d += ` Q ${prev[0].toFixed(1)} ${prev[1].toFixed(1)} ${mx} ${my}`;
  }
  d += ` Z`;
  return d;
}

function seededRandom(seed: number, salt: number): number {
  const x = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function DirectionArrow({ direction, twistiness }: { direction: Direction; twistiness: number }) {
  // Place arrow at the top of the ellipse
  const angle = direction === `clockwise` ? 0 : Math.PI;
  const cx = 100 + 62 * Math.cos(angle - Math.PI / 2);
  const cy = 90 + 48 * Math.sin(angle - Math.PI / 2);
  const rotate = direction === `clockwise` ? 90 : -90;

  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotate})`} opacity={twistiness > 5 ? 1 : 0.4}>
      <path
        d="M0 -6 L4 2 L0 0 L-4 2 Z"
        fill="#f97316"
        filter="url(#glow)"
      />
    </g>
  );
}
