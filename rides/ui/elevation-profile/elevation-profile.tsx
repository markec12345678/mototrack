import React, { useMemo } from 'react';
import classNames from 'classnames';
import styles from './elevation-profile.module.scss';

export type ElevationPoint = {
  elevation: number;
  distanceKm: number;
};

export type ElevationProfileProps = {
  /**
   * Array of elevation data points with distance along track.
   */
  points?: ElevationPoint[];

  /**
   * Current position along the track as a fraction 0–1.
   * Used to render the live position indicator.
   */
  progress?: number;

  /**
   * Total climb in metres.
   */
  climbM?: number;

  /**
   * Total descent in metres.
   */
  descentM?: number;

  /**
   * Width of the SVG canvas in pixels.
   */
  width?: number;

  /**
   * Height of the SVG canvas in pixels.
   */
  height?: number;

  /**
   * Whether to show the climb/descent stat labels.
   */
  showStats?: boolean;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline style overrides.
   */
  style?: React.CSSProperties;
};

const DEFAULT_POINTS: ElevationPoint[] = [
  { elevation: 320, distanceKm: 0 },
  { elevation: 345, distanceKm: 1.2 },
  { elevation: 410, distanceKm: 2.8 },
  { elevation: 480, distanceKm: 4.1 },
  { elevation: 520, distanceKm: 5.5 },
  { elevation: 495, distanceKm: 6.3 },
  { elevation: 440, distanceKm: 7.8 },
  { elevation: 390, distanceKm: 9.0 },
  { elevation: 360, distanceKm: 10.2 },
  { elevation: 420, distanceKm: 11.5 },
  { elevation: 510, distanceKm: 13.0 },
  { elevation: 560, distanceKm: 14.4 },
  { elevation: 530, distanceKm: 15.6 },
  { elevation: 470, distanceKm: 16.8 },
  { elevation: 400, distanceKm: 18.0 },
  { elevation: 350, distanceKm: 19.2 },
  { elevation: 320, distanceKm: 20.0 },
];

function ArrowUpIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M5 8.5V1.5M5 1.5L2 4.5M5 1.5L8 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M5 1.5V8.5M5 8.5L2 5.5M5 8.5L8 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ElevationProfile({
  points = DEFAULT_POINTS,
  progress = 0,
  climbM = 412,
  descentM = 412,
  width = 320,
  height = 80,
  showStats = true,
  className,
  style,
}: ElevationProfileProps) {
  const padding = { top: 8, right: 4, bottom: 4, left: 4 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const { pathD, areaD, posX, posY } = useMemo(() => {
    if (points.length < 2) {
      return { pathD: '', areaD: '', posX: 0, posY: innerH };
    }

    const elevations = points.map((p) => p.elevation);
    const distances = points.map((p) => p.distanceKm);

    const minElev = Math.min(...elevations);
    const maxElev = Math.max(...elevations);
    const elevRange = maxElev - minElev || 1;

    const minDist = distances[0];
    const maxDist = distances[distances.length - 1];
    const distRange = maxDist - minDist || 1;

    const toX = (d: number) => padding.left + ((d - minDist) / distRange) * innerW;
    const toY = (e: number) => padding.top + innerH - ((e - minElev) / elevRange) * innerH;

    const coords = points.map((p) => ({ x: toX(p.distanceKm), y: toY(p.elevation) }));

    // Smooth path using cubic bezier
    let pathStr = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cpX = (prev.x + curr.x) / 2;
      pathStr += ` C ${cpX},${prev.y} ${cpX},${curr.y} ${curr.x},${curr.y}`;
    }

    const bottomY = padding.top + innerH;
    const areaStr =
      `${pathStr} L ${coords[coords.length - 1].x},${bottomY} L ${coords[0].x},${bottomY} Z`;

    // Current position indicator
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const currentDist = minDist + clampedProgress * distRange;

    // Interpolate elevation at current distance
    let interpElev = elevations[0];
    for (let i = 1; i < points.length; i++) {
      if (currentDist <= points[i].distanceKm) {
        const t = (currentDist - points[i - 1].distanceKm) / (points[i].distanceKm - points[i - 1].distanceKm);
        interpElev = points[i - 1].elevation + t * (points[i].elevation - points[i - 1].elevation);
        break;
      }
      interpElev = elevations[elevations.length - 1];
    }

    const px = toX(currentDist);
    const py = toY(interpElev);

    return { pathD: pathStr, areaD: areaStr, posX: px, posY: py };
  }, [points, progress, innerW, innerH, padding.left, padding.top]);

  const gradientId = `elev-gradient-fill`;
  const glowId = `elev-glow`;
  const clipId = `elev-clip`;

  return (
    <div className={classNames(styles.container, className)} style={style}>
      {showStats && (
        <div className={styles.stats}>
          <span className={styles.statItem}>
            <span className={styles.climbIcon}>
              <ArrowUpIcon />
            </span>
            <span className={styles.statValue}>{Math.round(climbM)}</span>
            <span className={styles.statUnit}>m</span>
          </span>
          <span className={styles.statItem}>
            <span className={styles.descentIcon}>
              <ArrowDownIcon />
            </span>
            <span className={styles.statValue}>{Math.round(descentM)}</span>
            <span className={styles.statUnit}>m</span>
          </span>
        </div>
      )}

      <div className={styles.svgWrapper}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className={styles.svg}
          aria-label="Elevation profile"
          role="img"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--colors-primary-default)" stopOpacity="0.55" />
              <stop offset="60%" stopColor="var(--colors-primary-default)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--colors-primary-default)" stopOpacity="0.02" />
            </linearGradient>
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id={clipId}>
              <rect x={padding.left} y={padding.top} width={innerW} height={innerH} />
            </clipPath>
          </defs>

          {/* Gradient fill area */}
          {areaD && (
            <path
              d={areaD}
              fill={`url(#${gradientId})`}
              clipPath={`url(#${clipId})`}
              className={styles.area}
            />
          )}

          {/* Elevation line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="var(--colors-primary-default)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              clipPath={`url(#${clipId})`}
              className={styles.line}
            />
          )}

          {/* Current position indicator */}
          {progress > 0 && pathD && (
            <g className={styles.positionGroup} filter={`url(#${glowId})`}>
              {/* Vertical dashed line */}
              <line
                x1={posX}
                y1={padding.top}
                x2={posX}
                y2={padding.top + innerH}
                stroke="var(--colors-primary-default)"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              {/* Outer ring */}
              <circle
                cx={posX}
                cy={posY}
                r={6}
                fill="var(--colors-primary-default)"
                opacity="0.25"
              />
              {/* Inner dot */}
              <circle
                cx={posX}
                cy={posY}
                r={3.5}
                fill="var(--colors-primary-default)"
                stroke="var(--colors-text-inverse)"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
