import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

// Guard: Leaflet requires window/document — skip on server (SSR).
const isClient = typeof window !== 'undefined';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let MapContainer: any, TileLayer: any, Polyline: any, Marker: any, Popup: any, useMapEvents: any, CircleMarker: any, useMap: any;
if (isClient) {
  // Dynamic require so the bundler does not evaluate leaflet on the server.
  const rl = require('react-leaflet');
  ({ MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents, CircleMarker, useMap } = rl);
}

import type { Map as LeafletMap, LeafletMouseEvent } from 'leaflet';
import { TileStylePicker } from '@markec/maps.ui.tile-style-picker';
import { MapLayerToggle } from '@markec/maps.ui.map-layer-toggle';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { TileProvider } from '@markec/maps.entities.tile-provider';
import type { MapPolyline } from './polyline-type.js';
import type { MapMarker } from './map-marker-type.js';
import type { DraggableWaypoint } from './draggable-waypoint-type.js';
import type { MapOverlay } from './map-overlay-type.js';
import styles from './moto-map.module.scss';

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_TILE = TileProvider.from({
  key: `carto-dark`,
  label: `Dark`,
  urlTemplate: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`,
  attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`,
  maxZoom: 19,
  subdomains: [`a`, `b`, `c`, `d`],
});

const DEFAULT_CENTER = LatLng.from({ lat: 43.8563, lng: 18.4131 });
const DEFAULT_ZOOM = 13;

// ── Sub-components ────────────────────────────────────────────────────────────

type ClickHandlerProps = {
  onClick?: (latlng: LatLng) => void;
};

function ClickHandler({ onClick }: ClickHandlerProps) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onClick?.(LatLng.from({ lat: e.latlng.lat, lng: e.latlng.lng }));
    },
  });
  return null;
}

type MapRefSetterProps = {
  onReady: (map: LeafletMap) => void;
};

function MapRefSetter({ onReady }: MapRefSetterProps) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  return null;
}

type RiderMarkerProps = {
  position: LatLng;
};

function RiderMarker({ position }: RiderMarkerProps) {
  return (
    <CircleMarker
      center={[position.lat, position.lng]}
      radius={10}
      pathOptions={{
        color: `#f97316`,
        fillColor: `#f97316`,
        fillOpacity: 1,
        weight: 3,
      }}
    />
  );
}

type WaypointMarkerProps = {
  waypoint: DraggableWaypoint;
  onDrag?: (id: string, latlng: LatLng) => void;
  onRemove?: (id: string) => void;
};

function WaypointMarker({ waypoint, onDrag, onRemove }: WaypointMarkerProps) {
  return (
    <Marker
      position={[waypoint.latlng.lat, waypoint.latlng.lng]}
      draggable
      eventHandlers={{
        dragend(e) {
          const ll = (e.target as { getLatLng: () => { lat: number; lng: number } }).getLatLng();
          onDrag?.(waypoint.id, LatLng.from({ lat: ll.lat, lng: ll.lng }));
        },
      }}
    >
      {onRemove && (
        <Popup>
          <button
            type="button"
            className={styles.removeWaypointBtn}
            onClick={() => onRemove(waypoint.id)}
          >
            Remove waypoint
          </button>
        </Popup>
      )}
    </Marker>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

export type MotoMapProps = {
  /**
   * Map center coordinates.
   */
  center?: LatLng;

  /**
   * Initial zoom level.
   */
  zoom?: number;

  /**
   * Inline styles for the map root container.
   */
  style?: React.CSSProperties;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Polylines to draw on the map.
   */
  polylines?: MapPolyline[];

  /**
   * Markers to place on the map.
   */
  markers?: MapMarker[];

  /**
   * Draggable waypoints.
   */
  draggableWaypoints?: DraggableWaypoint[];

  /**
   * Called when a draggable waypoint is moved.
   */
  onDrag?: (id: string, latlng: LatLng) => void;

  /**
   * Called when a draggable waypoint remove button is clicked.
   */
  onRemove?: (id: string) => void;

  /**
   * Current rider position — rendered as an orange circle marker.
   */
  riderPosition?: LatLng;

  /**
   * Recorded ride track — rendered as a distinct polyline.
   */
  rideTrack?: LatLng[];

  /**
   * Called when the user clicks on the map (for waypoint adding).
   */
  onMapClick?: (latlng: LatLng) => void;

  /**
   * Slot-registered MapOverlay components to render at their requested positions.
   */
  overlays?: MapOverlay[];

  /**
   * Children rendered inside the map container (Leaflet-aware).
   */
  children?: React.ReactNode;
};

// ── Component ─────────────────────────────────────────────────────────────────

// Guard against SSR — Leaflet requires window/document at module evaluation time.
// The server.cjs SSR bundle has already failed; this check prevents the component
// from mounting during SSR (React will show a loading state and hydrate on client).
const IS_SERVER = typeof window === 'undefined';

export function MotoMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  style,
  className,
  polylines = [],
  markers = [],
  draggableWaypoints = [],
  onDrag,
  onRemove,
  riderPosition,
  rideTrack,
  onMapClick,
  overlays = [],
  children,
}: MotoMapProps) {
  // Return null on server to prevent Leaflet window access during SSR
  if (IS_SERVER) return null;

  const [activeTile, setActiveTile] = useState<TileProvider>(DEFAULT_TILE);
  const mapRef = useRef<LeafletMap | null>(null);

  const handleMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map;
  }, []);

  const handleTileSelect = useCallback((provider: TileProvider) => {
    setActiveTile(provider);
  }, []);

  const overlaysByPosition = overlays.reduce<Record<string, MapOverlay[]>>((acc, overlay) => {
    const pos = overlay.position ?? `bottom-right`;
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(overlay);
    return acc;
  }, {});

  const renderOverlayGroup = (position: string) => {
    const group = overlaysByPosition[position];
    if (!group || group.length === 0) return null;
    return group.map((overlay) => {
      const OverlayComponent = overlay.component;
      return <OverlayComponent key={overlay.key} />;
    });
  };

  return (
    <div className={classNames(styles.root, className)} style={style}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        className={styles.mapContainer}
        zoomControl={false}
        attributionControl
      >
        <MapRefSetter onReady={handleMapReady} />
        <ClickHandler onClick={onMapClick} />

        <TileLayer
          url={activeTile.urlTemplate}
          attribution={activeTile.attribution}
          maxZoom={activeTile.maxZoom ?? 19}
          subdomains={activeTile.subdomains.length > 0 ? activeTile.subdomains : [`a`, `b`, `c`]}
        />

        {rideTrack && rideTrack.length > 1 && (
          <Polyline
            positions={rideTrack.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: `#f97316`, weight: 4, opacity: 0.85 }}
          />
        )}

        {polylines.map((pl, idx) => (
          <Polyline
            key={idx}
            positions={pl.points.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: pl.color ?? `#3b82f6`,
              weight: pl.weight ?? 3,
              dashArray: pl.dashArray,
            }}
          />
        ))}

        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.latlng.lat, marker.latlng.lng]}>
            {marker.popup && <Popup>{marker.popup}</Popup>}
          </Marker>
        ))}

        {draggableWaypoints.map((wp) => (
          <WaypointMarker
            key={wp.id}
            waypoint={wp}
            onDrag={onDrag}
            onRemove={onRemove}
          />
        ))}

        {riderPosition && <RiderMarker position={riderPosition} />}

        {children}
      </MapContainer>

      <div className={classNames(styles.overlayCorner, styles.topLeft)}>
        {renderOverlayGroup(`top-left`)}
      </div>

      <div className={classNames(styles.overlayCorner, styles.topCenter)}>
        {renderOverlayGroup(`top-center`)}
      </div>

      <div className={classNames(styles.overlayCorner, styles.topRight)}>
        {renderOverlayGroup(`top-right`)}
      </div>

      <div className={classNames(styles.overlayCorner, styles.bottomLeft)}>
        {renderOverlayGroup(`bottom-left`)}
      </div>

      <div className={classNames(styles.overlayCorner, styles.bottomCenter)}>
        {renderOverlayGroup(`bottom-center`)}
      </div>

      <div className={classNames(styles.overlayCorner, styles.bottomRight)}>
        {renderOverlayGroup(`bottom-right`)}
        <div className={styles.defaultControls}>
          <MapLayerToggle />
          <TileStylePicker
            activeKey={activeTile.key}
            onSelect={handleTileSelect}
          />
        </div>
      </div>
    </div>
  );
}
