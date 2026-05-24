import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { LatLng } from '@markec/maps.entities.lat-lng';
import type { MapLibre3DProps } from './map-libre-3d-props-type.js';
import styles from './map-libre-3d.module.scss';

// ─── Default values ───────────────────────────────────────────────────────────

const DEFAULT_CENTER: LatLng = LatLng.from({ lat: 46.5253, lng: 10.4536 }); // Stelvio Pass
const DEFAULT_ZOOM = 12;
const DEFAULT_PITCH = 60;
const DEFAULT_BEARING = 0;
const DEFAULT_HEIGHT = `100%`;
const DEFAULT_ROUTE: LatLng[] = [];

// ─── WebGL detection ──────────────────────────────────────────────────────────

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement(`canvas`);
    const ctx =
      canvas.getContext(`webgl`) || canvas.getContext(`experimental-webgl`);
    return !!ctx;
  } catch {
    return false;
  }
}

// ─── Fallback 2D notice ───────────────────────────────────────────────────────

function FallbackNotice({ center, route }: { center: LatLng; route: LatLng[] }) {
  const zoom = 11;
  const lat = center.lat;
  const lng = center.lng;

  const tileX = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const latRad = (lat * Math.PI) / 180;
  const tileY = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );

  const staticSrc = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;

  return (
    <div className={styles.fallback}>
      <div className={styles.fallbackMap}>
        <img
          src={staticSrc}
          alt="2D map tile"
          className={styles.fallbackTile}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = `none`;
          }}
        />
        <div className={styles.fallbackOverlay}>
          <div className={styles.fallbackIcon}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 3L29 28H3L16 3Z"
                stroke="#f97316"
                strokeWidth="2"
                fill="rgba(249,115,22,0.15)"
              />
              <line x1="16" y1="12" x2="16" y2="20" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="23" r="1.5" fill="#f97316" />
            </svg>
          </div>
          <p className={styles.fallbackTitle}>3D terrain unavailable</p>
          <p className={styles.fallbackDesc}>
            WebGL is not supported in this browser. Showing a 2D map instead.
          </p>
          {route.length > 0 && (
            <p className={styles.fallbackRoute}>
              Route: {route.length} waypoints
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Compass icon ─────────────────────────────────────────────────────────────

function CompassIcon({ bearing }: { bearing: number }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{ transform: `rotate(${bearing}deg)`, transition: `transform 0.3s ease` }}
    >
      <circle cx="10" cy="10" r="9" stroke="rgba(148,163,184,0.4)" strokeWidth="1" />
      <polygon points="10,2 12,10 10,8 8,10" fill="#f97316" />
      <polygon points="10,18 12,10 10,12 8,10" fill="rgba(148,163,184,0.5)" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MapLibre3D({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  pitch = DEFAULT_PITCH,
  bearing = DEFAULT_BEARING,
  route = DEFAULT_ROUTE,
  height = DEFAULT_HEIGHT,
  className,
  style,
}: MapLibre3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentBearing, setCurrentBearing] = useState(bearing);
  const [currentPitch, setCurrentPitch] = useState(pitch);
  const [error, setError] = useState<string | null>(null);

  // Detect WebGL on mount (client-side only)
  useEffect(() => {
    setWebGLSupported(detectWebGL());
  }, []);

  // Dynamically load MapLibre GL JS and initialise the map
  useEffect(() => {
    if (webGLSupported !== true) return;
    if (!containerRef.current) return;

    let cancelled = false;
    let mapInstance: { remove: () => void; getBearing: () => number; getPitch: () => number; flyTo: (opts: unknown) => void; on: (event: string, cb: unknown) => void; addSource: (id: string, source: unknown) => void; setTerrain: (opts: unknown) => void; addLayer: (layer: unknown) => void; addControl: (ctrl: unknown, pos: string) => void } | null = null;

    const initMap = async () => {
      try {
        const maplibre = await import(`maplibre-gl`);
        const MapLibreMap = maplibre.Map;

        if (cancelled || !containerRef.current) return;

        const styleUrl = `https://tiles.openfreemap.org/styles/bright`;

        const instance = new MapLibreMap({
          container: containerRef.current,
          style: styleUrl,
          center: [center.lng, center.lat],
          zoom,
          pitch,
          bearing,
        });

        mapInstance = instance as unknown as typeof mapInstance;
        mapRef.current = mapInstance;

        instance.on(`load`, () => {
          if (cancelled) return;

          // ── Terrain-RGB DEM ───────────────────────────────────────────────
          instance.addSource(`terrain-dem`, {
            type: `raster-dem`,
            url: `https://demotiles.maplibre.org/terrain-tiles/tiles.json`,
            tileSize: 256,
          });

          instance.setTerrain({ source: `terrain-dem`, exaggeration: 1.5 });

          // ── Sky layer (cast to any — sky type not in all maplibre typings) ─
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          instance.addLayer({
            id: `sky`,
            type: `sky`,
            paint: {
              'sky-type': `atmosphere`,
              'sky-atmosphere-sun': [0.0, 90.0],
              'sky-atmosphere-sun-intensity': 15,
            },
          } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

          // ── Route polyline ────────────────────────────────────────────────
          if (route.length > 1) {
            const coordinates = route.map((pt) => [pt.lng, pt.lat]);

            instance.addSource(`route`, {
              type: `geojson`,
              data: {
                type: `Feature`,
                properties: {},
                geometry: {
                  type: `LineString`,
                  coordinates,
                },
              },
            });

            instance.addLayer({
              id: `route-glow`,
              type: `line`,
              source: `route`,
              layout: { 'line-join': `round`, 'line-cap': `round` },
              paint: {
                'line-color': `#f97316`,
                'line-width': 8,
                'line-opacity': 0.3,
                'line-blur': 4,
              },
            });

            instance.addLayer({
              id: `route-line`,
              type: `line`,
              source: `route`,
              layout: { 'line-join': `round`, 'line-cap': `round` },
              paint: {
                'line-color': `#f97316`,
                'line-width': 3,
                'line-opacity': 0.95,
              },
            });
          }

          setMapLoaded(true);
        });

        instance.on(`rotate`, () => {
          setCurrentBearing(Math.round(instance.getBearing()));
        });

        instance.on(`pitch`, () => {
          setCurrentPitch(Math.round(instance.getPitch()));
        });

        instance.on(`error`, (e: { error: Error }) => {
          console.warn(`MapLibre error:`, e.error);
        });

        instance.addControl(
          new maplibre.NavigationControl({ visualizePitch: true }),
          `top-right`
        );

        instance.addControl(
          new maplibre.ScaleControl({ maxWidth: 100, unit: `metric` }),
          `bottom-left`
        );
      } catch (err) {
        if (!cancelled) {
          setError(`Failed to load map library.`);
          console.error(err);
        }
      }
    };

    void initMap();

    return () => {
      cancelled = true;
      if (mapInstance) {
        mapInstance.remove();
        mapRef.current = null;
        setMapLoaded(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webGLSupported]);

  // ── Sync props changes to live map ────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    const m = mapRef.current as { flyTo: (opts: unknown) => void };
    m.flyTo({ center: [center.lng, center.lat], zoom, pitch, bearing, duration: 1200 });
  }, [center.lat, center.lng, zoom, pitch, bearing]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (webGLSupported === null) {
    return (
      <div
        className={classNames(styles.root, className)}
        style={{ ...style, height }}
      >
        <div className={styles.skeleton}>
          <div className={styles.skeletonPulse} />
        </div>
      </div>
    );
  }

  if (!webGLSupported) {
    return (
      <div
        className={classNames(styles.root, className)}
        style={{ ...style, height }}
      >
        <FallbackNotice center={center} route={route} />
      </div>
    );
  }

  return (
    <div
      className={classNames(styles.root, className)}
      style={{ ...style, height }}
    >
      <div ref={containerRef} className={styles.mapContainer} />

      {!mapLoaded && !error && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <span className={styles.loadingText}>Loading 3D terrain…</span>
        </div>
      )}

      {error && (
        <div className={styles.errorOverlay}>
          <span className={styles.errorText}>{error}</span>
        </div>
      )}

      {mapLoaded && (
        <div className={styles.hud}>
          <div className={styles.hudCompass}>
            <CompassIcon bearing={currentBearing} />
          </div>
          <div className={styles.hudStats}>
            <span className={styles.hudStat}>
              <span className={styles.hudLabel}>Pitch</span>
              <span className={styles.hudValue}>{currentPitch}°</span>
            </span>
            <span className={styles.hudStat}>
              <span className={styles.hudLabel}>Bearing</span>
              <span className={styles.hudValue}>{currentBearing}°</span>
            </span>
            {route.length > 0 && (
              <span className={styles.hudStat}>
                <span className={styles.hudLabel}>Route</span>
                <span className={classNames(styles.hudValue, styles.hudRoute)}>
                  {route.length} pts
                </span>
              </span>
            )}
          </div>
        </div>
      )}

      {mapLoaded && (
        <div className={styles.badge3d}>
          <span>3D</span>
        </div>
      )}
    </div>
  );
}
