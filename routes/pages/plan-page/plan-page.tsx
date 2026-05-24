import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { MotoMap } from '@markec/maps.ui.moto-map';
import type { MapPolyline } from '@markec/maps.ui.moto-map';
import type { DraggableWaypoint } from '@markec/maps.ui.moto-map';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { Button } from '@markec/mototrack-design.actions.button';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { RouteModePicker } from '@markec/routes.ui.route-mode-picker';
import type { RouteMode } from '@markec/routes.ui.route-mode-picker';
import { WaypointList } from '@markec/routes.ui.waypoint-list';
import { RouteShareDialog } from '@markec/routes.ui.route-share-dialog';
import { GpxImportButton } from '@markec/routes.ui.gpx-import-button';
import type { ParsedGpxRoute } from '@markec/routes.ui.gpx-import-button';
import { RoundTripConfig } from '@markec/routes.ui.round-trip-config';
import { useOsrm } from '@markec/routes.hooks.use-osrm';
import { useSavedRoutes } from '@markec/routes.hooks.use-saved-routes';
import { Waypoint } from '@markec/routes.entities.waypoint';
import type { PlannedRoute } from '@markec/routes.entities.planned-route';
import styles from './plan-page.module.scss';

// ── Icons ─────────────────────────────────────────────────────────────────────

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2v8M8 10l-3-3M8 10l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WeatherIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1v1M8 10v1M3 6H2M14 6h-1M4.5 3.5l-.7-.7M12.2 11.2l-.7-.7M4.5 8.5l-.7.7M12.2 1.8l-.7.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 13a2 2 0 010-4h.5A3 3 0 0113 10.5a2 2 0 010 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MapDownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 3l4 2 4-2 4 2v9l-4-2-4 2-4-2V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5v8M9 3v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 3a1 1 0 011-1h8l3 3v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 2v3h5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="8" width="8" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2L8 10M8 2L5 5M8 2L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9v4a1 1 0 001 1h8a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TwistyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12C2 12 4 4 8 8C12 12 14 4 14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RoundTripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2a6 6 0 100 12A6 6 0 008 2z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 2v2M12 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_CENTER = LatLng.from({ lat: 46.0569, lng: 14.5058 });
const DEFAULT_ZOOM = 9;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m} min`;
}

function exportGpx(waypoints: Waypoint[], geometry: LatLng[], routeName: string): void {
  const wptXml = waypoints
    .map(
      (wp, i) =>
        `  <wpt lat="${wp.lat}" lon="${wp.lng}">\n    <name>${wp.name ?? `Waypoint ${i + 1}`}</name>\n  </wpt>`
    )
    .join('\n');

  const trkptXml = geometry
    .map((pt) => `      <trkpt lat="${pt.lat}" lon="${pt.lng}" />`)
    .join('\n');

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="MotoTrack" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>${routeName}</name></metadata>
${wptXml}
  <trk>
    <name>${routeName}</name>
    <trkseg>
${trkptXml}
    </trkseg>
  </trk>
</gpx>`;

  const blob = new Blob([gpx], { type: `application/gpx+xml` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement(`a`);
  a.href = url;
  a.download = `${routeName.replace(/\s+/g, `-`)}.gpx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type PlanPageProps = {
  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;

  /**
   * Initial waypoints to pre-populate the planner.
   */
  initialWaypoints?: Waypoint[];

  /**
   * Initial route name.
   */
  initialRouteName?: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function PlanPage({
  className,
  style,
  initialWaypoints = [],
  initialRouteName = `Moja Ruta`,
}: PlanPageProps) {
  const [waypoints, setWaypoints] = useState<Waypoint[]>(initialWaypoints);
  const [routeMode, setRouteMode] = useState<RouteMode>(`vijugasto`);
  const [routeName, setRouteName] = useState<string>(initialRouteName);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [twistyOpen, setTwistyOpen] = useState(false);
  const [roundTripOpen, setRoundTripOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { compute, data: osrmData, isLoading: isRouting } = useOsrm();
  const { save } = useSavedRoutes();

  // Recompute OSRM route whenever waypoints change (≥2 points)
  useEffect(() => {
    if (waypoints.length >= 2) {
      const latlngs = waypoints.map((wp) => LatLng.from({ lat: wp.lat, lng: wp.lng }));
      compute(latlngs);
    }
  }, [waypoints, compute]);

  // ── Map interactions ────────────────────────────────────────────────────────

  const handleMapClick = useCallback((latlng: LatLng) => {
    const id = `wp-${Date.now()}`;
    const newWp = Waypoint.from({ id, lat: latlng.lat, lng: latlng.lng });
    setWaypoints((prev) => [...prev, newWp]);
  }, []);

  const handleDrag = useCallback((id: string, latlng: LatLng) => {
    setWaypoints((prev) =>
      prev.map((wp) =>
        wp.id === id ? Waypoint.from({ id: wp.id, name: wp.name, lat: latlng.lat, lng: latlng.lng }) : wp
      )
    );
  }, []);

  const handleRemoveFromMap = useCallback((id: string) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
  }, []);

  // ── Waypoint list interactions ──────────────────────────────────────────────

  const handleNameChange = useCallback((id: string, name: string) => {
    setWaypoints((prev) =>
      prev.map((wp) => (wp.id === id ? Waypoint.from({ id: wp.id, name, lat: wp.lat, lng: wp.lng }) : wp))
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
  }, []);

  const handleReorder = useCallback((reordered: Waypoint[]) => {
    setWaypoints(reordered);
  }, []);

  // ── GPX import ──────────────────────────────────────────────────────────────

  const handleGpxLoad = useCallback((parsed: ParsedGpxRoute) => {
    const wps = parsed.waypoints.map((gw) =>
      Waypoint.from({ id: gw.id, name: gw.name, lat: gw.lat, lng: gw.lng })
    );
    if (wps.length > 0) {
      setWaypoints(wps);
      setRouteName(parsed.name);
    }
  }, []);

  // ── GPX export ──────────────────────────────────────────────────────────────

  const handleGpxExport = useCallback(() => {
    const geometry = osrmData?.geometry ?? waypoints.map((wp) => LatLng.from({ lat: wp.lat, lng: wp.lng }));
    exportGpx(waypoints, geometry, routeName);
  }, [osrmData, waypoints, routeName]);

  // ── Round-trip generate ─────────────────────────────────────────────────────

  const handleRoundTripGenerate = useCallback(
    (config: { distanceKm: number; twistiness: number; direction: string }) => {
      if (waypoints.length === 0) return;
      setIsGenerating(true);
      const start = waypoints[0];
      const startLatLng = LatLng.from({ lat: start.lat, lng: start.lng });
      const offsetKm = config.distanceKm / 4;
      const offsetDeg = offsetKm / 111;
      const dir = config.direction === `clockwise` ? 1 : -1;
      const generated: Waypoint[] = [
        start,
        Waypoint.from({ id: `rt-1`, lat: start.lat + offsetDeg * dir, lng: start.lng + offsetDeg }),
        Waypoint.from({ id: `rt-2`, lat: start.lat + offsetDeg * 1.5 * dir, lng: start.lng }),
        Waypoint.from({ id: `rt-3`, lat: start.lat + offsetDeg * dir, lng: start.lng - offsetDeg }),
        start,
      ];
      setWaypoints(generated);
      compute([startLatLng, ...generated.slice(1, -1).map((w) => LatLng.from({ lat: w.lat, lng: w.lng })), startLatLng]);
      setIsGenerating(false);
      setRoundTripOpen(false);
    },
    [waypoints, compute]
  );

  // ── Save ────────────────────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    if (waypoints.length < 2) return;
    setIsSaving(true);
    try {
      const geometry = osrmData?.geometry ?? waypoints.map((wp) => LatLng.from({ lat: wp.lat, lng: wp.lng }));
      await save({
        name: routeName,
        waypoints,
        mode: routeMode,
        geometry,
        distanceKm: osrmData?.distanceKm ?? 0,
        durationSec: osrmData?.durationSec ?? 0,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [waypoints, routeName, routeMode, osrmData, save]);

  // ── Derived data ────────────────────────────────────────────────────────────

  const draggableWaypoints: DraggableWaypoint[] = waypoints.map((wp) => ({
    id: wp.id,
    latlng: LatLng.from({ lat: wp.lat, lng: wp.lng }),
  }));

  const polylines: MapPolyline[] = osrmData?.geometry && osrmData.geometry.length > 1
    ? [{ points: osrmData.geometry, color: `#f97316`, weight: 4 }]
    : waypoints.length > 1
    ? [{ points: waypoints.map((wp) => LatLng.from({ lat: wp.lat, lng: wp.lng })), color: `#f97316`, weight: 3, dashArray: `6 4` }]
    : [];

  const distanceKm = osrmData?.distanceKm ?? 0;
  const durationSec = osrmData?.durationSec ?? 0;

  const shareRoute: PlannedRoute | null =
    waypoints.length >= 2
      ? ({
          id: `plan-draft`,
          name: routeName,
          waypoints,
          mode: routeMode,
          geometry: osrmData?.geometry ?? waypoints.map((wp) => LatLng.from({ lat: wp.lat, lng: wp.lng })),
          distanceKm,
          durationSec,
          createdAt: Date.now() / 1000,
        } as unknown as PlannedRoute)
      : null;

  const mapCenter =
    waypoints.length > 0
      ? LatLng.from({ lat: waypoints[0].lat, lng: waypoints[0].lng })
      : DEFAULT_CENTER;

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarTitleRow}>
            <Heading level={3} size="md" color="accent">
              🏍️ Planer Rute
            </Heading>
            <div className={styles.routingBadge} data-active={isRouting}>
              <span className={styles.routingDot} />
              <span className={styles.routingLabel}>{isRouting ? `Računam...` : `OSRM`}</span>
            </div>
          </div>
          <input
            className={styles.routeNameInput}
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Ime rute..."
            aria-label="Ime rute"
          />
        </div>

        {/* Scrollable content */}
        <div className={styles.sidebarContent}>
          {/* Mode picker */}
          <section className={styles.section}>
            <span className={styles.sectionLabel}>Tip rute</span>
            <RouteModePicker activeMode={routeMode} onModeChange={(m) => setRouteMode(m)} />
          </section>

          {/* Generators */}
          <section className={styles.section}>
            <span className={styles.sectionLabel}>Generatorji</span>
            <div className={styles.generatorButtons}>
              {/* Twisty generator toggle */}
              <button
                type="button"
                className={classNames(styles.generatorToggle, { [styles.generatorToggleActive]: twistyOpen })}
                onClick={() => {
                  setTwistyOpen((v) => !v);
                  setRoundTripOpen(false);
                }}
              >
                <TwistyIcon />
                <span>Vijugasta ruta</span>
                {twistyOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>

              {twistyOpen && (
                <div className={styles.generatorPanel}>
                  <p className={styles.generatorHint}>
                    Dodaj vsaj 2 točki na karti, nato generiraj vijugasto pot med njimi.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    disabled={waypoints.length < 2}
                    loading={isGenerating}
                    onClick={() => {
                      if (waypoints.length >= 2) {
                        const latlngs = waypoints.map((wp) => LatLng.from({ lat: wp.lat, lng: wp.lng }));
                        compute(latlngs);
                        setTwistyOpen(false);
                      }
                    }}
                  >
                    Generiraj vijugasto
                  </Button>
                </div>
              )}

              {/* Round-trip generator toggle */}
              <button
                type="button"
                className={classNames(styles.generatorToggle, { [styles.generatorToggleActive]: roundTripOpen })}
                onClick={() => {
                  setRoundTripOpen((v) => !v);
                  setTwistyOpen(false);
                }}
              >
                <RoundTripIcon />
                <span>Krožna ruta</span>
                {roundTripOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>

              {roundTripOpen && (
                <div className={styles.generatorPanel}>
                  {waypoints.length === 0 && (
                    <p className={styles.generatorHint}>
                      Najprej dodaj začetno točko na karti.
                    </p>
                  )}
                  <RoundTripConfig
                    loading={isGenerating}
                    onGenerate={(cfg) => handleRoundTripGenerate(cfg)}
                  />
                </div>
              )}
            </div>
          </section>

          {/* Waypoint list */}
          <section className={styles.section}>
            <WaypointList
              waypoints={waypoints}
              onNameChange={handleNameChange}
              onDelete={handleDelete}
              onReorder={handleReorder}
            />
          </section>

          {/* Stats */}
          {(distanceKm > 0 || waypoints.length >= 2) && (
            <section className={styles.statsSection}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Razdalja</span>
                <span className={styles.statValue}>
                  {distanceKm > 0 ? `${distanceKm.toFixed(1)} km` : `—`}
                </span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Čas vožnje</span>
                <span className={styles.statValue}>
                  {durationSec > 0 ? formatDuration(durationSec) : `—`}
                </span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Točke</span>
                <span className={styles.statValue}>{waypoints.length}</span>
              </div>
            </section>
          )}

          {/* Actions row */}
          <section className={styles.actionsSection}>
            <span className={styles.sectionLabel}>Orodja</span>
            <div className={styles.actionsRow}>
              <GpxImportButton onLoad={handleGpxLoad} label="Uvozi GPX" />
              <button
                type="button"
                className={styles.actionIconBtn}
                onClick={() => handleGpxExport()}
                disabled={waypoints.length === 0}
                title="Izvozi GPX"
                aria-label="Izvozi GPX"
              >
                <DownloadIcon />
                <span>GPX</span>
              </button>
              <button
                type="button"
                className={styles.actionIconBtn}
                title="Vreme"
                aria-label="Vreme"
              >
                <WeatherIcon />
                <span>Vreme</span>
              </button>
              <button
                type="button"
                className={styles.actionIconBtn}
                title="Offline karte"
                aria-label="Offline karte"
              >
                <MapDownloadIcon />
                <span>Offline</span>
              </button>
            </div>
          </section>
        </div>

        {/* Save / Share footer */}
        <div className={styles.sidebarFooter}>
          {savedSuccess && (
            <div className={styles.savedBadge}>
              ✓ Ruta shranjena!
            </div>
          )}
          <div className={styles.footerButtons}>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<ShareIcon />}
              disabled={!shareRoute}
              onClick={() => setShareDialogOpen(true)}
              fullWidth
            >
              Deli
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<SaveIcon />}
              disabled={waypoints.length < 2}
              loading={isSaving}
              onClick={() => handleSave()}
              fullWidth
            >
              Shrani
            </Button>
          </div>
        </div>
      </aside>

      {/* ── Map ─────────────────────────────────────────────────────────────── */}
      <main className={styles.mapPane}>
        <MotoMap
          center={mapCenter}
          zoom={DEFAULT_ZOOM}
          className={styles.map}
          draggableWaypoints={draggableWaypoints}
          onDrag={handleDrag}
          onRemove={handleRemoveFromMap}
          onMapClick={handleMapClick}
          polylines={polylines}
        />
        {waypoints.length === 0 && (
          <div className={styles.mapHint}>
            <span>🗺️ Klikni na karto za dodajanje točk</span>
          </div>
        )}
      </main>

      {/* ── Share dialog ─────────────────────────────────────────────────────── */}
      {shareRoute && (
        <RouteShareDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          route={shareRoute}
        />
      )}
    </div>
  );
}
