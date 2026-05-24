import * as React from 'react';
import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { PageLayout } from '@markec/mototrack-design.layouts.page-layout';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Button } from '@markec/mototrack-design.actions.button';
import { Tabs } from '@markec/mototrack-design.navigation.tabs';
import { MotoMap } from '@markec/maps.ui.moto-map';
import { TwistinessHeatmapLayer } from '@markec/maps.ui.twistiness-heatmap-layer';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { RideTrackLine } from '@markec/rides.ui.ride-track-line';
import { ElevationProfile } from '@markec/rides.ui.elevation-profile';
import { useRides } from '@markec/rides.hooks.use-rides';
import type { RideDetailTab } from './ride-detail-tab-type.js';
import styles from './ride-detail.module.scss';

// ── Icons ─────────────────────────────────────────────────────────────────────

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2v8M5 7l3 3 3-3M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(`en-GB`, {
    weekday: `long`,
    day: `numeric`,
    month: `long`,
    year: `numeric`,
  });
}

function twistinessLabel(score: number): string {
  if (score >= 8) return `Extreme`;
  if (score >= 6) return `Twisty`;
  if (score >= 4) return `Moderate`;
  if (score >= 2) return `Mild`;
  return `Straight`;
}

function twistinessColor(score: number): string {
  if (score >= 8) return `#ef4444`;
  if (score >= 6) return `#f97316`;
  if (score >= 4) return `#eab308`;
  if (score >= 2) return `#22c55e`;
  return `#3b82f6`;
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

type DeleteModalProps = {
  rideName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
};

function DeleteModal({ rideName, onConfirm, onCancel, isDeleting }: DeleteModalProps) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalIcon}>🗑️</div>
        <Heading level={3} size="lg">Delete Ride?</Heading>
        <p className={styles.modalText}>
          Are you sure you want to delete <strong>&quot;{rideName}&quot;</strong>? This action cannot be undone.
        </p>
        <div className={styles.modalActions}>
          <Button variant="ghost" size="md" onClick={() => onCancel()} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={() => onConfirm()} loading={isDeleting} leftIcon={<TrashIcon />}>
            Delete Ride
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Stats Grid ────────────────────────────────────────────────────────────────

type StatCardProps = {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
};

function StatCard({ label, value, unit, accent }: StatCardProps) {
  return (
    <div className={classNames(styles.statCard, { [styles.statCardAccent]: accent })}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statValueRow}>
        <span className={styles.statValue}>{value}</span>
        {unit && <span className={styles.statUnit}>{unit}</span>}
      </div>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────

type SectionHeaderProps = {
  children?: React.ReactNode;
};

function SectionHeader({ children }: SectionHeaderProps) {
  return <p className={styles.sectionHeader}>{children}</p>;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export type RideDetailProps = {
  /**
   * Slot-registered tab components from other aspects (Photos, Weather, Comments, etc.).
   */
  tabs?: RideDetailTab[];

  /**
   * Override the ride ID (falls back to :id route param).
   */
  rideId?: string;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function RideDetail({ tabs = [], rideId, className, style }: RideDetailProps) {
  const { id: paramId } = useParams<{ id: string }>();
  const resolvedId = rideId ?? paramId ?? ``;

  const { rides, loading, deleteRide } = useRides();

  const ride = useMemo(
    () => rides.find((r) => r.id === resolvedId) ?? null,
    [rides, resolvedId]
  );

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string>(``);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const sortedTabs = useMemo(
    () => [...tabs].sort((a, b) => (a.order ?? 99) - (b.order ?? 99)),
    [tabs]
  );

  const tabItems = useMemo(
    () =>
      sortedTabs.map((t) => ({
        key: t.key,
        label: t.label,
        icon: t.icon ? <span>{t.icon}</span> : undefined,
      })),
    [sortedTabs]
  );

  const resolvedActiveTabKey = activeTabKey || (sortedTabs[0]?.key ?? ``);

  const activeTab = sortedTabs.find((t) => t.key === resolvedActiveTabKey);

  const elevationPoints = useMemo(() => {
    if (!ride) return [];
    const pts = ride.track ?? [];
    const totalDist = ride.distanceKm ?? 0;
    return pts.map((pt, idx) => ({
      elevation: pt.elevation ?? 0,
      distanceKm: (idx / Math.max(pts.length - 1, 1)) * totalDist,
    }));
  }, [ride]);

  const handleExportGpx = () => {
    if (!ride) return;
    const gpxContent = buildGpx(ride);
    const blob = new Blob([gpxContent], { type: `application/gpx+xml` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement(`a`);
    a.href = url;
    a.download = `${ride.name ?? `ride-${ride.id}`}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!ride) return;
    setIsDeleting(true);
    try {
      await deleteRide(ride.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className={classNames(styles.root, className)} style={style}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Loading ride...</span>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className={classNames(styles.root, className)} style={style}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🏍️</span>
          <Heading level={2} size="xl">Ride not found</Heading>
          <p className={styles.emptyText}>This ride may have been deleted or the link is invalid.</p>
          <Button variant="secondary" size="md" href="/rides" leftIcon={<BackIcon />}>
            Back to Rides
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {showDeleteModal && (
        <DeleteModal
          rideName={ride.name ?? `Unnamed Ride`}
          onConfirm={() => { void handleDelete(); }}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}

      <PageLayout maxWidth="1280px" padding="var(--spacing-xl) var(--layout-gutter)" gap="var(--spacing-xl)">

        {/* ── Header ── */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <Button variant="ghost" size="sm" href="/rides" leftIcon={<BackIcon />}>
              All Rides
            </Button>
            <div className={styles.titleBlock}>
              <div className={styles.rideBadge}>
                <span className={styles.rideBadgeDot} />
                <span className={styles.rideBadgeLabel}>Ride Detail</span>
              </div>
              <Heading level={1} size="2xl">
                {ride.name ?? `Unnamed Ride`}
              </Heading>
              <p className={styles.rideDate}>{formatDate(ride.startedAt)}</p>
              {ride.notes && (
                <p className={styles.rideNotes}>{ride.notes}</p>
              )}
            </div>
          </div>
          <div className={styles.pageHeaderActions}>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<DownloadIcon />}
              onClick={() => handleExportGpx()}
            >
              Export GPX
            </Button>
            <Button
              variant="danger"
              size="md"
              leftIcon={<TrashIcon />}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div>
          <SectionHeader>Ride Statistics</SectionHeader>
          <div className={styles.statsGrid}>
            <StatCard label="Distance" value={ride.distanceKm.toFixed(1)} unit="km" accent />
            <StatCard label="Duration" value={formatDuration(ride.durationSec)} />
            <StatCard label="Max Speed" value={Math.round(ride.maxSpeedKmh).toString()} unit="km/h" accent />
            <StatCard label="Avg Speed" value={Math.round(ride.avgSpeedKmh).toString()} unit="km/h" />
            <StatCard label="Climb" value={Math.round(ride.climbM).toString()} unit="m" />
            <StatCard label="Descent" value={Math.round(ride.descentM).toString()} unit="m" />
            <div className={classNames(styles.statCard, styles.statCardTwistiness)}>
              <span className={styles.statLabel}>Twistiness</span>
              <div className={styles.statValueRow}>
                <span
                  className={styles.statValue}
                  style={{ color: twistinessColor(ride.twistinessScore) }}
                >
                  {ride.twistinessScore.toFixed(1)}
                </span>
                <span className={styles.statUnit}>/ 10</span>
              </div>
              <span
                className={styles.twistinessPill}
                style={{ backgroundColor: `${twistinessColor(ride.twistinessScore)}22`, color: twistinessColor(ride.twistinessScore) }}
              >
                {twistinessLabel(ride.twistinessScore)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Map ── */}
        <div>
          <div className={styles.mapSectionHeader}>
            <SectionHeader>Track Map</SectionHeader>
            <div className={styles.mapToggle}>
              <button
                type="button"
                className={classNames(styles.toggleBtn, { [styles.toggleBtnActive]: !showHeatmap })}
                onClick={() => setShowHeatmap(false)}
              >
                <RouteIcon />
                Track
              </button>
              <button
                type="button"
                className={classNames(styles.toggleBtn, { [styles.toggleBtnActive]: showHeatmap })}
                onClick={() => setShowHeatmap(true)}
              >
                <LayersIcon />
                Twistiness
              </button>
            </div>
          </div>
          <div className={styles.mapContainer}>
            {showHeatmap ? (
              <HeatmapMap track={ride.track} />
            ) : (
              <RideTrackLine track={ride.track} focused />
            )}
          </div>
        </div>

        {/* ── Elevation Profile ── */}
        {elevationPoints.length > 1 && (
          <div>
            <SectionHeader>Elevation Profile</SectionHeader>
            <div className={styles.elevationCard}>
              <ElevationProfile
                points={elevationPoints}
                climbM={ride.climbM}
                descentM={ride.descentM}
                height={100}
                showStats
              />
              <div className={styles.elevationFooter}>
                <span className={styles.elevationLabel}>0 km</span>
                <span className={styles.elevationLabel}>{ride.distanceKm.toFixed(1)} km</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Slot Tabs ── */}
        {sortedTabs.length > 0 && (
          <div>
            <SectionHeader>More Info</SectionHeader>
            <Tabs
              items={tabItems}
              activeKey={resolvedActiveTabKey}
              onTabChange={(key) => setActiveTabKey(key)}
            />
            {activeTab && (
              <div className={styles.tabContent}>
                <ActiveTabRenderer tab={activeTab} rideId={resolvedId} />
              </div>
            )}
          </div>
        )}

      </PageLayout>
    </div>
  );
}

// ── Heatmap Map wrapper ───────────────────────────────────────────────────────

type TrackPt = {
  lat: number;
  lng: number;
  ts: number;
  speed?: number | null;
  elevation?: number | null;
  accuracy?: number | null;
  heading?: number | null;
};

type HeatmapMapProps = {
  track: TrackPt[];
};

function HeatmapMap({ track }: HeatmapMapProps) {
  const latLngs = useMemo(
    () => track.map((pt) => LatLng.from({ lat: pt.lat, lng: pt.lng })),
    [track]
  );

  return (
    <MotoMap>
      <TwistinessHeatmapLayer track={latLngs} weight={5} opacity={0.9} />
    </MotoMap>
  );
}

// ── Active Tab Renderer ───────────────────────────────────────────────────────

type ActiveTabRendererProps = {
  tab: RideDetailTab;
  rideId: string;
};

function ActiveTabRenderer({ tab, rideId }: ActiveTabRendererProps) {
  const TabComponent = tab.component;
  return <TabComponent rideId={rideId} />;
}

// ── GPX Builder ───────────────────────────────────────────────────────────────

type RideForGpx = {
  id: string;
  name?: string | null;
  track: Array<{ lat: number; lng: number; ts: number; elevation?: number | null }>;
};

function buildGpx(ride: RideForGpx): string {
  const points = ride.track
    .map((pt) => {
      const ele = pt.elevation != null ? `<ele>${pt.elevation.toFixed(1)}</ele>` : ``;
      const time = `<time>${new Date(pt.ts).toISOString()}</time>`;
      return `    <trkpt lat="${pt.lat.toFixed(6)}" lon="${pt.lng.toFixed(6)}">${ele}${time}</trkpt>`;
    })
    .join(`\n`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="MotoTrack" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>${ride.name ?? `Ride ${ride.id}`}</name>
    <trkseg>
${points}
    </trkseg>
  </trk>
</gpx>`;
}
