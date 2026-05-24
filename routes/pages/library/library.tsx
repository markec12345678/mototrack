import * as React from 'react';
import { useState, useMemo } from 'react';
import classNames from 'classnames';
import { PageLayout } from '@markec/mototrack-design.layouts.page-layout';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Button } from '@markec/mototrack-design.actions.button';
import { useSavedRoutes } from '@markec/routes.hooks.use-saved-routes';
import { PlannedRoute } from '@markec/routes.entities.planned-route';
import type { RouteAction } from './route-card-action-type.js';
import styles from './library.module.scss';

// ── Mode config ────────────────────────────────────────────────────────────

type RouteMode = `all` | `paved` | `twisty` | `offroad`;

const MODE_FILTERS: { value: RouteMode; label: string; emoji: string }[] = [
  { value: `all`, label: `All`, emoji: `🗺️` },
  { value: `paved`, label: `Asfalt`, emoji: `🛣️` },
  { value: `twisty`, label: `Vijugasto`, emoji: `🌀` },
  { value: `offroad`, label: `Terensko`, emoji: `🏔️` },
];

// ── Mini-map SVG ───────────────────────────────────────────────────────────

type MiniMapProps = {
  geometry: { lat: number; lng: number }[];
  mode: string;
};

function MiniMap({ geometry, mode }: MiniMapProps) {
  if (!geometry || geometry.length < 2) {
    return (
      <div className={styles.miniMapWrapper}>
        <svg className={styles.miniMapSvg} viewBox="0 0 300 160" preserveAspectRatio="xMidYMid meet">
          <rect width="300" height="160" fill="#0a1628" />
          <text x="150" y="85" textAnchor="middle" fill="#334155" fontSize="13" fontFamily="Inter, sans-serif">
            No preview
          </text>
        </svg>
      </div>
    );
  }

  const lats = geometry.map((p) => p.lat);
  const lngs = geometry.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const W = 300;
  const H = 160;
  const PAD = 20;

  const latRange = maxLat - minLat || 0.001;
  const lngRange = maxLng - minLng || 0.001;

  const toX = (lng: number) => PAD + ((lng - minLng) / lngRange) * (W - PAD * 2);
  const toY = (lat: number) => H - PAD - ((lat - minLat) / latRange) * (H - PAD * 2);

  const points = geometry.map((p) => `${toX(p.lng).toFixed(1)},${toY(p.lat).toFixed(1)}`).join(` `);

  const strokeColor =
    mode === `paved` ? `#60a5fa` : mode === `offroad` ? `#4ade80` : `#f97316`;

  const glowColor =
    mode === `paved` ? `rgba(59,130,246,0.4)` : mode === `offroad` ? `rgba(34,197,94,0.4)` : `rgba(249,115,22,0.4)`;

  const startPt = geometry[0];
  const endPt = geometry[geometry.length - 1];
  const sx = toX(startPt.lng);
  const sy = toY(startPt.lat);
  const ex = toX(endPt.lng);
  const ey = toY(endPt.lat);

  const filterId = `glow-${mode}`;

  return (
    <div className={styles.miniMapWrapper}>
      <svg
        className={styles.miniMapSvg}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={`bg-${mode}`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0f1f3d" />
            <stop offset="100%" stopColor="#0a1628" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill={`url(#bg-${mode})`} />

        {[0.25, 0.5, 0.75].map((t) => (
          <g key={t}>
            <line
              x1={PAD + t * (W - PAD * 2)}
              y1={PAD}
              x2={PAD + t * (W - PAD * 2)}
              y2={H - PAD}
              stroke="rgba(148,163,184,0.06)"
              strokeWidth="1"
            />
            <line
              x1={PAD}
              y1={PAD + t * (H - PAD * 2)}
              x2={W - PAD}
              y2={PAD + t * (H - PAD * 2)}
              stroke="rgba(148,163,184,0.06)"
              strokeWidth="1"
            />
          </g>
        ))}

        <polyline
          points={points}
          fill="none"
          stroke={glowColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${filterId})`}
        />

        <polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx={sx} cy={sy} r="5" fill="#0a1628" stroke={strokeColor} strokeWidth="2" />
        <circle cx={sx} cy={sy} r="2.5" fill={strokeColor} />

        <circle cx={ex} cy={ey} r="5" fill="#0a1628" stroke={strokeColor} strokeWidth="2" />
        <circle cx={ex} cy={ey} r="2.5" fill={strokeColor} />
      </svg>
      <div className={styles.miniMapOverlay} />
    </div>
  );
}

// ── Mode badge ─────────────────────────────────────────────────────────────

function ModeBadge({ mode }: { mode: string }) {
  const config: Record<string, { label: string; emoji: string; cls: string }> = {
    paved: { label: `Asfalt`, emoji: `🛣️`, cls: styles.modeBadgePaved },
    twisty: { label: `Vijugasto`, emoji: `🌀`, cls: styles.modeBadgeTwisty },
    offroad: { label: `Terensko`, emoji: `🏔️`, cls: styles.modeBadgeOffroad },
  };
  const cfg = config[mode] ?? { label: mode, emoji: `🗺️`, cls: styles.modeBadgePaved };
  return (
    <span className={classNames(styles.modeBadge, cfg.cls)}>
      {cfg.emoji} {cfg.label}
    </span>
  );
}

// ── Duration formatter ─────────────────────────────────────────────────────

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ── Icons ──────────────────────────────────────────────────────────────────

function LoadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="4" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 7.1l5-2.2M5.5 8.9l5 2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GpxIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10l1.5 2L9 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Route Card ─────────────────────────────────────────────────────────────

type RouteCardProps = {
  route: PlannedRoute;
  onLoad: (route: PlannedRoute) => void;
  onShare: (route: PlannedRoute) => void;
  onExportGpx: (route: PlannedRoute) => void;
  onDelete: (route: PlannedRoute) => void;
  extraActions?: RouteAction[];
};

function RouteCard({ route, onLoad, onShare, onExportGpx, onDelete, extraActions = [] }: RouteCardProps) {
  return (
    <div className={styles.routeCard}>
      <MiniMap geometry={route.geometry} mode={route.mode} />
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <h3 className={styles.routeName}>{route.name}</h3>
          <ModeBadge mode={route.mode} />
        </div>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Distance</span>
            <span className={styles.statValue}>{route.distanceKm.toFixed(1)} km</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statLabel}>Duration</span>
            <span className={styles.statValue}>{formatDuration(route.durationSec)}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statLabel}>Waypoints</span>
            <span className={styles.statValue}>{route.waypoints.length}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={classNames(styles.actionBtn, styles.actionBtnLoad)}
            onClick={() => onLoad(route)}
            aria-label={`Load ${route.name} into planner`}
          >
            <LoadIcon />
            Load
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => onShare(route)}
            aria-label={`Share ${route.name}`}
          >
            <ShareIcon />
            Share
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => onExportGpx(route)}
            aria-label={`Export ${route.name} as GPX`}
          >
            <GpxIcon />
            GPX
          </button>
          {extraActions.map((action) => (
            <button
              key={action.key}
              type="button"
              className={styles.actionBtn}
              onClick={() => action.handler(route)}
              aria-label={action.label}
            >
              {action.icon} {action.label}
            </button>
          ))}
          <div className={styles.actionSpacer} />
          <button
            type="button"
            className={classNames(styles.actionBtn, styles.actionBtnDelete)}
            onClick={() => onDelete(route)}
            aria-label={`Delete ${route.name}`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton card ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonShimmer} />
    </div>
  );
}

// ── Library Page ───────────────────────────────────────────────────────────

export type LibraryProps = {
  /**
   * Called when the user clicks "Load" on a route card.
   */
  onLoadRoute?: (route: PlannedRoute) => void;

  /**
   * Called when the user clicks "Share" on a route card.
   */
  onShareRoute?: (route: PlannedRoute) => void;

  /**
   * Called when the user clicks "GPX" on a route card.
   */
  onExportGpx?: (route: PlannedRoute) => void;

  /**
   * Called when the user clicks "Delete" on a route card.
   */
  onDeleteRoute?: (route: PlannedRoute) => void;

  /**
   * Slot-injected extra actions for each route card.
   */
  extraActions?: RouteAction[];

  /**
   * Optional mock routes for testing / compositions.
   */
  mockRoutes?: PlannedRoute[];

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

export function Library({
  onLoadRoute,
  onShareRoute,
  onExportGpx,
  onDeleteRoute,
  extraActions = [],
  mockRoutes: mockRoutesProp,
  className,
  style,
}: LibraryProps) {
  const [activeFilter, setActiveFilter] = useState<RouteMode>(`all`);

  const { routes, loading: isLoading, deleteRoute } = useSavedRoutes({ mockData: mockRoutesProp });

  const filtered = useMemo(() => {
    if (activeFilter === `all`) return routes;
    return routes.filter((r) => r.mode === activeFilter);
  }, [routes, activeFilter]);

  const handleLoad = (route: PlannedRoute) => {
    onLoadRoute?.(route);
  };

  const handleShare = (route: PlannedRoute) => {
    onShareRoute?.(route);
  };

  const handleExportGpx = (route: PlannedRoute) => {
    onExportGpx?.(route);
  };

  const handleDelete = (route: PlannedRoute) => {
    deleteRoute(route.id);
    onDeleteRoute?.(route);
  };

  return (
    <div className={classNames(styles.page, className)} style={style}>
      <PageLayout>
        <div className={styles.header}>
          <p className={styles.eyebrow}>MotoTrack</p>
          <Heading level={1} size="2xl">
            Route Library
          </Heading>
          <p className={styles.subtitle}>
            Your saved routes — load into the planner, share with friends, or export as GPX.
          </p>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Filter:</span>
            {MODE_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={classNames(
                  styles.filterBtn,
                  f.value === `all` && styles.filterBtnAll,
                  f.value === `paved` && styles.filterBtnPaved,
                  f.value === `twisty` && styles.filterBtnTwisty,
                  f.value === `offroad` && styles.filterBtnOffroad,
                  activeFilter === f.value && styles.filterBtnActive
                )}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.emoji} {f.label}
              </button>
            ))}
          </div>
          <span className={styles.routeCount}>
            {isLoading ? `Loading...` : `${filtered.length} route${filtered.length !== 1 ? `s` : ``}`}
          </span>
        </div>

        <div className={styles.grid}>
          {isLoading &&
            [1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}

          {!isLoading && filtered.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🗺️</div>
              <h2 className={styles.emptyTitle}>No routes found</h2>
              <p className={styles.emptySubtitle}>
                {activeFilter === `all`
                  ? `You haven\u2019t saved any routes yet. Plan a route and save it to your library.`
                  : `No ${activeFilter} routes saved. Try a different filter or plan a new route.`}
              </p>
              <Button variant="primary" href="/planner">
                Plan a Route
              </Button>
            </div>
          )}

          {!isLoading &&
            filtered.map((route) => (
              <div key={route.id}>
                <RouteCard
                  route={route}
                  onLoad={handleLoad}
                  onShare={handleShare}
                  onExportGpx={handleExportGpx}
                  onDelete={handleDelete}
                  extraActions={extraActions}
                />
              </div>
            ))}
        </div>
      </PageLayout>
    </div>
  );
}
